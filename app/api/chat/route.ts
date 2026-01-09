import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { messages, lang, chatId } = await req.json();

    // 1. Fetch Chat Context
    const { data: history } = await supabase
      .from('messages')
      .select('content, sender_role')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    const contextHistory = history?.map(m => ({
      role: (m.sender_role === 'ai' || m.sender_role === 'agent') ? 'assistant' as const : 'user' as const,
      content: m.content
    })) || [];

    // 2. Define Tools
    const tools: OpenAI.Chat.ChatCompletionTool[] = [{
      type: "function",
      function: {
        name: "search_catalog",
        description: "Search for commercial kitchen equipment. IMPORTANT: Always search in English to match database records.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "The English name of the item (e.g., 'fryer')" },
          },
          required: ["query"],
        },
      },
    }];

    // 3. System Prompt with new Link logic and Categories
    const systemPrompt = {
      role: "system" as const,
      content: `You are the Merican Assistant in Nairobi. 
      Current language: ${lang}. 

      LINK RULES:
    LINK RULES:
      1. ALWAYS use relative paths. Never include "http", "https", or "yourwebsite.com".
      2. SINGLE PRODUCT: Use /product/[slug] (e.g., [/product/single-deck-oven]). Note: singular 'product'.
      3. ALL PRODUCTS: Use [/products]. Note: plural 'products'.
      4. CATEGORIES: If a user is interested in a specific section of the kitchen, use /category/[slug].
         Available categories:
         - Receiving Area: [/category/receiving]
         - Storage: [/category/storage]
         - Preparation: [/category/preparation]
         - Production: [/category/production]
         - Dispatch & Servery: [/category/dispatch-servery]
         - Wash-up Area: [/category/wash-up-area]
         - Bar Area: [/category/bar-area]
         - Gas Section: [/category/gas-section]
         - Stainless Steel Fabrication: [/category/stainless-steel-fabrication]
         - Kitchen Support: [/category/kitchen-support]
      5. STATIC PAGES: Services [/services-projects], Blog [/blog], Contact [/contact-us].
      6. FORMAT: Use Markdown [Text](URL). Never include language prefixes like /en/ or /sw/.

      SEARCH RULES:
      - If no exact match is found, suggest custom stainless steel fabrication and provide the link [/category/stainless-steel-fabrication].`
    };

    // 4. OpenAI Call
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemPrompt, ...contextHistory, messages[messages.length - 1]],
      tools: tools,
    });

    const assistantMessage = response.choices[0].message;
    let finalContent = assistantMessage.content;

    // 5. Handle Tool Execution
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      if ('function' in toolCall) {
        const { query } = JSON.parse(toolCall.function.arguments);

        const { data: products } = await supabase
          .from("products")
          .select("name, name_sw, slug, short_description")
          .or(`name.ilike.%${query}%,name_sw.ilike.%${query}%,short_description.ilike.%${query}%`)
          .limit(8);

        const finalResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            systemPrompt,
            ...contextHistory,
            messages[messages.length - 1],
            { role: "assistant", content: assistantMessage.content || null, tool_calls: assistantMessage.tool_calls },
            { role: "tool", tool_call_id: toolCall.id, content: JSON.stringify(products || []) }
          ],
        });
        finalContent = finalResponse.choices[0].message.content;
      }
    }

    // 6. Save to Database
    const userMessage = messages[messages.length - 1].content;
    if (finalContent) {
      await supabase.from('messages').insert([
        { chat_id: chatId, content: userMessage, sender_role: 'user' },
        { chat_id: chatId, content: finalContent, sender_role: 'ai' }
      ]);
    }

    return NextResponse.json({ text: finalContent });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ text: "I'm sorry, I'm having trouble with my connection. How else can I help you today?" });
  }
}