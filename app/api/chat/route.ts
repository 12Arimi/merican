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

    // 1. Fetch Chat History
    const { data: history } = await supabase
      .from('messages')
      .select('content, sender_role')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    const contextHistory = history?.map(m => ({
      role: (m.sender_role === 'ai' || m.sender_role === 'agent') ? 'assistant' as const : 'user' as const,
      content: m.content
    })) || [];

    // 2. Tools
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "search_catalog",
          description: "Search for commercial kitchen equipment. Always use English.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" },
            },
            required: ["query"],
          },
        },
      },
    ];

    // 3. Refined System Prompt (proactive help-first behavior)
    const systemPrompt = {
      role: "system" as const,
      content: `
You are the official Merican Assistant for Merican Ltd (Nairobi).

Your goals:
1. Help users quickly
2. Convert users into qualified leads

--------------------
RESPONSE STYLE (MANDATORY)
--------------------
- Keep responses SHORT (2–5 lines)
- Simple language
- Easy to scan

--------------------
LEAD COLLECTION (MANDATORY)
--------------------
- Frequently invite users to share:
  - Their **Name**
  - Their **Phone or Email**
- Always bold exactly: **Name** and **Phone or Email**
- Example: "Please share your **Name** and **Phone or Email** and our team will assist you."

--------------------
WHEN PRODUCT IS NOT FOUND (CRITICAL BEHAVIOR)
--------------------
Never start by saying the product is unavailable or not listed.

Instead, ALWAYS respond proactively like:
"We can still help you with that.  
Please share your **Name** and **Phone or Email**, and our team will confirm the exact details for you."

You may optionally add:
"This item may not be listed yet, but our team handles custom and special requests."

This keeps the experience positive and conversion-focused.

--------------------
LINK SAFETY (STRICT)
--------------------
You may ONLY use these links:

Pages:
- /products
- /services-projects
- /blog
- /contact-us

Categories:
- /category/receiving
- /category/storage
- /category/preparation
- /category/production
- /category/dispatch-servery
- /category/wash-up-area
- /category/bar-area
- /category/gas-section
- /category/stainless-steel-fabrication
- /category/kitchen-support

Products:
- Only use /product/[slug] if returned by database tool

Never invent links.  
If unsure, suggest a category instead.

Always format links as: [Text](/path)

--------------------
PRODUCT INTEGRITY
--------------------
- If tool returns no products:
  - Do not invent products
  - Do not end the conversation
  - Focus on collecting **Name** and **Phone or Email**
  - Offer reassurance that the team will confirm availability

--------------------
TONE
--------------------
- Helpful
- Professional
- Calm
- Sales-aware but never pushy

Current language: ${lang}
`
    };

    // 4. OpenAI call
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        systemPrompt,
        ...contextHistory,
        messages[messages.length - 1]
      ],
      tools,
    });

    const assistantMessage = response.choices[0].message;
    let finalContent = assistantMessage.content;

    // 5. Tool execution
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
            {
              role: "assistant",
              content: assistantMessage.content || null,
              tool_calls: assistantMessage.tool_calls
            },
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(products || [])
            }
          ],
        });

        finalContent = finalResponse.choices[0].message.content;
      }
    }

    // 6. Save Messages
    const userMessage = messages[messages.length - 1].content;

    if (finalContent) {
      await supabase.from('messages').insert([
        { chat_id: chatId, content: userMessage, sender_role: 'user' },
        { chat_id: chatId, content: finalContent, sender_role: 'ai' }
      ]);
    }

    return NextResponse.json({ text: finalContent });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({
      text: "We can still assist you. Please share your **Name** and **Phone or Email** and our team will follow up."
    });
  }
}
