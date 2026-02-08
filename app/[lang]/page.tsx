// app/[lang]/page.tsx
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import CeoMessage from "@/components/CeoMessage";
import About from "@/components/About";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  // Fetch from MySQL
  const pool = db();
  const [rows] = await pool.query(`
    SELECT 
      id, client_name, client_company, client_avatar, 
      testimonial_message, testimonial_image, 
      testimonial_message_sw, testimonial_message_fr, 
      testimonial_message_de, testimonial_message_it, 
      testimonial_message_es
    FROM testimonials 
    ORDER BY id DESC
  `);

  const initialTestimonials = rows as any[];

  // 3. Render everything together
  return (
    <div>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Testimonials initialData={initialTestimonials || []} />
        <CeoMessage />
        <About />
    </div>
  );
}