import { Metadata } from 'next';
import Contact from "@/components/Contact";

interface PageProps {
  params: Promise<{ lang?: string }>;
}

// 🔍 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (await params).lang || 'en';

  const seo: Record<string, { title: string; desc: string }> = {
    en: { 
      title: "Contact Our Experts | Commercial Kitchen Consultation & Support", 
      desc: "Get in touch with Merican Limited for expert commercial kitchen design, stainless steel fabrication quotes, and technical support in East Africa." 
    },
    sw: { 
      title: "Wasiliana na Wataalamu Wetu | Ushauri na Huduma za Jikoni", 
      desc: "Wasiliana na Merican Limited kwa ajili ya usanifu wa majiko ya kibiashara, nukuu za bei za vifaa vya chuma, na msaada wa kiufundi Mashariki mwa Afrika." 
    },
    fr: { 
      title: "Contactez Nos Experts | Consultation et Support Cuisine Commerciale", 
      desc: "Contactez Merican Limited pour la conception de cuisines professionnelles, des devis de fabrication en inox et un support technique en Afrique de l'Est." 
    },
    es: { 
      title: "Contacte a Nuestros Expertos | Consultoría y Soporte de Cocina Comercial", 
      desc: "Póngase en contacto con Merican Limited para diseño de cocinas industriales, presupuestos de fabricación en acero inoxidable y soporte técnico." 
    },
    de: { 
      title: "Kontaktieren Sie unsere Experten | Beratung & Support für Großküchen", 
      desc: "Kontaktieren Sie Merican Limited für professionelle Großküchenplanung, Angebote für Edelstahlverarbeitung und technischen Support in Ostafrika." 
    },
    it: { 
      title: "Contatta i Nostri Esperti | Consulenza e Supporto Cucine Professionali", 
      desc: "Contatta Merican Limited per la progettazione di cucine industriali, preventivi per lavorazioni in acciaio inox e supporto tecnico in Africa Orientale." 
    }
  };

  const currentSeo = seo[lang] || seo.en;

  return {
    title: currentSeo.title,
    description: currentSeo.desc,
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://mericanltd.com/${lang}/contact`,
      type: 'website',
    }
  };
}

// 📞 2. CONTACT PAGE COMPONENT
export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}