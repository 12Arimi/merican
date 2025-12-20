import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      // Fetch ONE specific blog by slug
      const { data, error } = await supabase
        .from('blog')
        .select('id, cover_image, title, slug, content, created_at')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Fetch ALL blogs (for listing and popular sidebar)
      const { data, error } = await supabase
        .from('blog')
        .select('id, cover_image, title, slug, content, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.error('Blog API Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}