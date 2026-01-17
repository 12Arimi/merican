import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, phone, subject, message }]);

    if (dbError) throw dbError;

    // 2. Send via Brevo
    // NOTE: gitimuarimi@gmail.com MUST be a verified sender in your Brevo dashboard
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "Merican Contact Form", email: "gitimuarimi@gmail.com" },
        to: [
          { email: "sales@mericanltd.com" },
          { email: "edwin@mericanltd.com" }
        ],
        subject: `Contact Form: ${subject || 'New Inquiry'}`,
        htmlContent: `
          <h3>New Contact Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      })
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}