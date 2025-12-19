import { Suspense } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <div>
      {/* Header Component */}
      <Header />
      
      <main>
        {/* Hero Section - Static content, no Suspense needed */}
        <Hero />

        {/* Wrap components that use client-side hooks (useSearchParams) 
          or dynamic data fetching in Suspense to fix the Vercel build error.
        */}
        <Suspense fallback={<div className="p-10 text-center">Loading Content...</div>}>
          {/* Categories Section */}
          <Categories />
          
          {/* Featured Products Section */}
          <FeaturedProducts />
          
          {/* Testimonials Section */}
          <Testimonials />
        </Suspense>
      </main>
    </div>
  );
}