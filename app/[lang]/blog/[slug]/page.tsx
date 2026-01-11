import BlogDetails from "@/components/BlogDetails";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

// 1. Define the Blog Interface
interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  created_at: string;
}

// 2. Dynamic SEO Metadata Generation
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string, lang: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug, lang } = resolvedParams;

  // Fetch blog details for SEO
  const { data: blog } = await supabase
    .from('blog')
    .select('title, content')
    .eq('slug', slug)
    .single();

  if (!blog) {
    return { title: "Article Not Found | Merican Limited" };
  }

  // Strip HTML tags and limit to 155 characters for a clean meta description
  const plainDescription = blog.content
    ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 155) + "..."
    : "Expert insights from Merican Limited regarding commercial kitchen solutions.";

  return {
    title: blog.title, // Page Title becomes the Article Title
    description: plainDescription,
    openGraph: {
      title: blog.title,
      description: plainDescription,
      url: `https://mericanltd.com/${lang}/blog/${slug}`,
      type: 'article',
      siteName: 'Merican Limited',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: plainDescription,
    }
  };
}

// 3. Main Page Component
export default async function SingleBlogPage({ 
  params 
}: { 
  params: Promise<{ slug: string, lang: string }> 
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch current blog details
  const { data: blog } = await supabase
    .from('blog')
    .select('id, cover_image, title, slug, content, created_at')
    .eq('slug', slug)
    .single();

  if (!blog) {
    return notFound();
  }

  // Fetch popular blogs for the sidebar
  const { data: popularBlogs } = await supabase
    .from('blog')
    .select('id, cover_image, title, slug, content, created_at')
    .neq('slug', slug) // Exclude the current blog
    .limit(4);

  return (
    <div>
      <BlogDetails 
        initialBlog={blog as Blog} 
        initialPopular={(popularBlogs as Blog[]) || []} 
      />
    </div>
  );
}