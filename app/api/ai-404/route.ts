import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize outside the handler
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  // 1. Safety default for lang
  let lang = 'en'; 

  try {
    const body = await req.json();
    const brokenUrl = body.brokenUrl || '';
    lang = body.lang || 'en';

    const siteStructure = {
      static: ['/about', '/products', '/services-projects', '/partners-clients', '/blog', '/contact', '/request-for-quote'],
      categories: ['receiving', 'storage', 'preparation', 'production', 'dispatch-servery', 'bar-area', 'wash-up-area', 'kitchen-support', 'stainless-steel-fabrication', 'gas-section'],
    };

    const systemPrompt = `You are the Merican Limited AI Concierge.
      A user hit a 404 at: "${brokenUrl}". Language: "${lang}".
      Rules:
      1. Every URL MUST start with "/${lang}".
      2. Valid Static: ${siteStructure.static.map(s => `/${lang}${s}`).join(', ')}.
      3. Valid Categories: ${siteStructure.categories.map(c => `/${lang}/category/${c}`).join(', ')}.
      4. If URL looks like a product, suggest "/${lang}/products".
      Return ONLY JSON: {"message": "string", "suggestionLink": "string"}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Redirect this path: ${brokenUrl}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const content = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || "{}"));

  } catch (error: any) {
    console.error("API Error:", error.message);
    // Return a safe fallback so the frontend doesn't crash
    return NextResponse.json({ 
      message: "Page not found", 
      suggestionLink: `/${lang}` 
    }, { status: 200 }); // We use 200 here so the frontend "success" logic still runs
  }
}