import { Suspense } from "react";
import Header from "@/components/Header";
import Blogs from "@/components/Blogs";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Blog | Merican Limited",
  description: "Explore the latest insights on commercial kitchen design, stainless steel fabrication, and hospitality trends in Kenya.",
};

export default async function BlogPage() {
  const { data: initialBlogs, error } = await supabase
    .from('blog')
    .select('id, cover_image, title, slug, content, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
  }

  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<div className="p-10 text-center">Loading Blog Posts...</div>}>
          {/* Pass the data directly to the client component */}
          <Blogs initialData={initialBlogs || []} />
        </Suspense>
      </main>
    </div>
  );
}