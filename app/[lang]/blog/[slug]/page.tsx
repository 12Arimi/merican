import BlogDetails from "@/components/BlogDetails";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  created_at: string;
}

export default async function SingleBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Fetch current blog
  const { data: blog } = await supabase
    .from("blog")
    .select("id, cover_image, title, slug, content, created_at")
    .eq("slug", slug)
    .single();

  if (!blog) {
    return notFound();
  }

  // 2. Fetch popular blogs
  const { data: popularBlogs } = await supabase
    .from("blog")
    .select("id, cover_image, title, slug, content, created_at")
    .neq("slug", slug)
    .limit(4);

  return (
    <BlogDetails
      initialBlog={blog as Blog}
      initialPopular={(popularBlogs as Blog[]) || []}
    />
  );
}
