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

    // 1. Fetch Chat Context from DB to ensure AI has full history
    const { data: history } = await supabase
      .from('messages')
      .select('content, sender_role')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    // Format history for OpenAI
    const contextHistory = history?.map(m => ({
      role: m.sender_role === 'ai' ? 'assistant' : m.sender_role === 'agent' ? 'assistant' : 'user',
      content: m.content
    })) || [];

    const tools: OpenAI.Chat.ChatCompletionTool[] = [{
      type: "function",
      function: {
        name: "search_catalog",
        description: "Search for commercial kitchen equipment, stainless steel products, and fabrication services.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term (e.g., 'table', 'fryer', 'sink')" },
          },
          required: ["query"],
        },
      },
    }];

    const systemPrompt = {
      role: "system" as const,
      content: `You are the Merican Assistant in Nairobi.
      - Start in ${lang === 'sw' ? 'Swahili' : 'English'}.
      - IMPORTANT: Reference previous parts of the conversation to stay helpful.
      - ONLY recommend products found in 'search_catalog'.`
    };

    // 2. Initial Call with full context history
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemPrompt, ...contextHistory, messages[messages.length - 1]],
      tools: tools,
    });

    const assistantMessage = response.choices[0].message;
    let finalContent = assistantMessage.content;

    // 3. Handle Tool Logic
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      if ('function' in toolCall) {
        const { query } = JSON.parse(toolCall.function.arguments);
        const { data: products } = await supabase
          .from("products")
          .select("name, name_sw, slug, short_description")
          .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
          .limit(6);

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

    // 4. Save User Message and AI Message to Database
    const userMessage = messages[messages.length - 1].content;
    
    await supabase.from('messages').insert([
      { chat_id: chatId, content: userMessage, sender_role: 'user' },
      { chat_id: chatId, content: finalContent, sender_role: 'ai' }
    ]);

    return NextResponse.json({ text: finalContent });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ text: "Error connecting. Try again later." });
  }
}