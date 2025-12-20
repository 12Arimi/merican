import { Suspense } from "react";
import Header from "../../components/Header";
import Blogs from "../../components/Blogs";

export const metadata = {
  title: "Blog | Merican Limited",
  description: "Explore the latest insights on commercial kitchen design, stainless steel fabrication, and hospitality trends in Kenya.",
};

export default async function BlogPage() {
  // Fetch data on the server relative to your host
  // In production, use an absolute URL or fetch directly from Supabase here
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blogs`, { cache: 'no-store' });
  const initialBlogs = await res.json();

  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<div className="p-10 text-center">Loading Blog Posts...</div>}>
          {/* Pass the data to the client component */}
          <Blogs initialData={initialBlogs || []} />
        </Suspense>
      </main>
    </div>
  );
}