import ClientDetail from "@/components/ClientDetail";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

// 🔍 DYNAMIC SEO METADATA
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; lang: string }> 
}): Promise<Metadata> {
  const { slug, lang } = await params;

  const { data: client } = await supabase
    .from('clients')
    .select('name')
    .eq('slug', slug)
    .single();

  if (!client) {
    return { title: "Project Not Found | Merican Limited" };
  }

  // Localized Titles and Descriptions
  const seoData: Record<string, { title: string; desc: string }> = {
    en: {
      title: `${client.name} | Commercial Kitchen Project`,
      desc: `View the custom stainless steel fabrication and commercial kitchen installation project completed for ${client.name} by Merican Limited.`
    },
    sw: {
      title: `${client.name} | Mradi wa Jikoni`,
      desc: `Tazama mradi wa utengenezaji wa vifaa vya chuma na usanifu wa majiko ya kibiashara uliokamilika kwa ajili ya ${client.name} na Merican Limited.`
    },
    fr: {
      title: `${client.name} | Projet de Cuisine Commerciale`,
      desc: `Découvrez le projet de fabrication d'inox et d'installation de cuisine commerciale réalisé pour ${client.name} par Merican Limited.`
    },
    es: {
      title: `${client.name} | Proyecto de Cocina Comercial`,
      desc: `Vea el proyecto de fabricación de acero inoxidable e instalación de cocina industrial completado para ${client.name} por Merican Limited.`
    },
    de: {
      title: `${client.name} | Großküchenprojekt`,
      desc: `Sehen Sie sich das Projekt zur Edelstahlverarbeitung und Großkücheninstallation an, das für ${client.name} von Merican Limited durchgeführt wurde.`
    },
    it: {
      title: `${client.name} | Progetto Cucina Professionale`,
      desc: `Scopri il progetto di lavorazione dell'acciaio inox e installazione di cucine professionali completato per ${client.name} da Merican Limited.`
    }
  };

  const currentSeo = seoData[lang] || seoData.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/partners-clients/${slug}`,
      type: 'website',
    }
  };
}

// 📄 MAIN PAGE COMPONENT
export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string; lang: string }> 
}) {
  const { slug } = await params;

  // Fetch data on the server
  const { data: client, error } = await supabase
    .from('clients')
    .select('name, logo, gallery')
    .eq('slug', slug)
    .single();

  if (error || !client) {
    return notFound();
  }

  return (
    <div>
        <ClientDetail client={client} />
    </div>
  );
}