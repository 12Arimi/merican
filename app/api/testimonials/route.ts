import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Adjust path if your lib is elsewhere

export async function GET() {
  try {
    // Fetch data from the 'testimonials' table in Supabase
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, client_name, client_company, client_avatar, testimonial_message, testimonial_image')
      .order('created_at', { ascending: false });

    // Handle Supabase errors
    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the data as JSON
    return NextResponse.json(data);
  } catch (err) {
    console.error('API Server Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}