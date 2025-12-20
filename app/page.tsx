import { Suspense } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Testimonials from "../components/Testimonials";
import CeoMessage from "../components/CeoMessage";
import About from "../components/About";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Fetch testimonials directly on the server
  const { data: initialTestimonials } = await supabase
    .from('testimonials')
    .select('id, client_name, client_company, client_avatar, testimonial_message, testimonial_image')
    .order('created_at', { ascending: false });

  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div className="p-10 text-center">Loading Content...</div>}>
          <Categories />
          <FeaturedProducts />
          
          {/* Pass the server-fetched data here */}
          <Testimonials initialData={initialTestimonials || []} />

          <CeoMessage />
          <About />
        </Suspense>
      </main>
    </div>
  );
}