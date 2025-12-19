import Header from "../../../components/Header";
import ClientDetail from "../../../components/ClientDetail";
import { Suspense } from "react";

// 1. Make the Page function 'async'
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Await the params to "unwrap" the slug
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<div className="p-10 text-center">Loading Client Details...</div>}>
          {/* 3. Pass the unwrapped slug */}
          <ClientDetail slug={slug} />
        </Suspense>
      </main>
    </div>
  );
}