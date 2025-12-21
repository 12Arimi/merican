// app/[lang]/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://mericanltd.vercel.app";

  return {
    title: "Merican Limited | Commercial Kitchen Equipment Experts",
    description: "Quality stainless steel fabrication and kitchen solutions in East Africa.",
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'sw': `${baseUrl}/sw`,
        'fr': `${baseUrl}/fr`,
        'es': `${baseUrl}/es`,
        'de': `${baseUrl}/de`,
        'it': `${baseUrl}/it`,
        'x-default': `${baseUrl}/en`,
      },
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <html lang={lang}>  {/* Fixed: was <div lang={lang}>, now correct on <html> */}
      <head />
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}