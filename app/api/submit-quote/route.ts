import { NextResponse } from 'next/server';
import { db } from "@/lib/db"; // Your MySQL connection helper
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const cartDataRaw = formData.get('cart_data') as string;
    const cartItems = JSON.parse(cartDataRaw || '[]');

    const pool = db();

    // 1. SAVE TO MYSQL DATABASE
    try {
      await pool.query(
        `INSERT INTO quote_requests (name, email, phone, message, items) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone, message, JSON.stringify(cartItems)]
      );
    } catch (dbError) {
      console.error("MySQL Save Error:", dbError);
      return NextResponse.json({ error: 'Database save failed' }, { status: 500 });
    }

    // 2. SEND EMAIL VIA NODEMAILER (SMTP)
    const itemsHtml = cartItems.map((item: any) => 
      `<li><strong>${item.name}</strong> (Qty: ${item.quantity})</li>`
    ).join('');

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // 587 uses STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false 
      }
    });

    try {
      await transporter.sendMail({
        from: `"Merican Quote System" <info@arimi.co.ke>`,
        to: "sales@mericanltd.com",
        cc: "edwin@mericanltd.com",
        subject: `New Quote Request: ${name}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>New Quote Request Received</h2>
            <p><strong>Customer Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
            <hr />
            <h3>Requested Items:</h3>
            <ul>${itemsHtml}</ul>
          </div>
        `
      });
    } catch (emailErr) {
      // Don't crash the UI if only the email fails; the data is safe in MySQL
      console.error("SMTP Email Failed:", emailErr);
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