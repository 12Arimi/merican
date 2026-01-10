import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const cartDataRaw = formData.get('cart_data') as string;
    const cartItems = JSON.parse(cartDataRaw || '[]');

    // 1. SAVE TO DATABASE FIRST
    const { error: dbError } = await supabase
      .from('quote_requests')
      .insert([{
        name,
        email,
        phone,
        message,
        items: cartItems
      }]);

    if (dbError) {
      console.error("Database Save Error:", dbError);
      return NextResponse.json({ error: 'Database save failed' }, { status: 500 });
    }

    // 2. ATTEMPT TO SEND EMAIL VIA BREVO
    const itemsHtml = cartItems.map((item: any) => 
      `<li><strong>${item.name}</strong> (Qty: ${item.quantity})</li>`
    ).join('');

    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY as string,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "Merican Quote System", email: "gitimuarimi@gmail.com" }, // Ensure this email is a verified sender in Brevo
          to: [{ email: "ceo@arimi.co.ke" }],
          cc: [{ email: "aaarghremy1@gmail.com" }],
          subject: `New Quote: ${name}`,
          htmlContent: `
            <h3>New Request from ${name}</h3>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
            <h4>Items:</h4>
            <ul>${itemsHtml}</ul>
          `
        })
      });
    } catch (emailErr) {
      // We don't stop the process if email fails, because the data is saved in DB!
      console.error("Brevo Email Sending Failed, but DB record created:", emailErr);
    }

    // 3. REDIRECT TO SUCCESS
    const referer = request.headers.get('referer') || '/';
    const successUrl = new URL(referer);
    successUrl.searchParams.set('success', 'true');
    return NextResponse.redirect(successUrl.toString(), { status: 303 });

  } catch (error) {
    console.error("Critical Submission Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}