import { Suspense } from "react";
import Blogs from "@/components/Blogs";
import { supabase } from "@/lib/supabase";

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = (await params).lang || 'en';

  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Commercial Kitchen Insights & Hospitality Industry Trends", 
      desc: "Expert advice on kitchen design, stainless steel maintenance, and the latest hospitality industry trends in East Africa by Merican Limited." 
    },
    sw: { 
      title: "Makala za Majiko ya Kibiashara na Mitindo ya Sekta ya Ukarimu", 
      desc: "Ushauri wa kitaalamu kuhusu usanifu wa majiko, utunzaji wa vifaa vya chuma, na habari mpya za sekta ya ukarimu kutoka Merican Limited." 
    },
    fr: { 
      title: "Blog sur les Cuisines Commerciales et Tendances de l'Hôtellerie", 
      desc: "Conseils d'experts sur la conception de cuisines, l'entretien de l'inox et les dernières tendances de l'hôtellerie en Afrique de l'Est." 
    },
    es: { 
      title: "Blog de Cocinas Comerciales y Tendencias de Hostelería", 
      desc: "Consejos de expertos sobre diseño de cocinas, mantenimiento de acero inoxidable y las últimas tendencias en hostelería de Merican Limited." 
    },
    de: { 
      title: "Gewerbeküchen-Insights & Trends in der Hotellerie", 
      desc: "Expertenrat zu Küchendesign, Edelstahlpflege und den neuesten Trends in der Hotellerie in Ostafrika von Merican Limited." 
    },
    it: { 
      title: "Blog Cucine Professionali e Tendenze del Settore Horeca", 
      desc: "Consulenza esperta su progettazione cucine, manutenzione acciaio inox e le ultime tendenze del settore horeca in Africa Orientale." 
    }
  };

  const currentSeo = seo[lang] || seo.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/blog`,
      siteName: 'Merican Limited',
      type: 'website',
    }
  };
}

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
      <Blogs initialData={initialBlogs || []} />
    </div>
  );
}