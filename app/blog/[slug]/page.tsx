import Header from "../../../components/Header";
import BlogDetails from "../../../components/BlogDetails";
import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";

// Define the interface here to ensure it matches the component
interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  created_at: string;
}

export default async function SingleBlogPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Fetch current blog details
  const { data: blog } = await supabase
    .from('blog')
    .select('id, cover_image, title, slug, content, created_at')
    .eq('slug', slug)
    .single();

  if (!blog) {
    return notFound();
  }

  // 2. Fetch popular blogs for the sidebar
  // FIXED: Added 'content' to the select even if not used, to match the Blog interface
  const { data: popularBlogs } = await supabase
    .from('blog')
    .select('id, cover_image, title, slug, content, created_at')
    .neq('slug', slug)
    .limit(4);

  return (
    <div>
      <Header />
      <main>
        {/* We cast the data to Blog and Blog[] to stop the TypeScript errors */}
        <BlogDetails 
          initialBlog={blog as Blog} 
          initialPopular={(popularBlogs as Blog[]) || []} 
        />
      </main>
    </div>
  );
}