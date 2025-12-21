// app/layout.tsx
import { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Static metadata for the root URL (English default, clean URL)
export const metadata: Metadata = {
  title: "Merican Limited | Commercial Kitchen Equipment Experts",
  description: "Quality stainless steel fabrication and kitchen solutions in East Africa.",
  alternates: {
    canonical: "https://mericanltd.vercel.app",
    languages: {
      'en': "https://mericanltd.vercel.app",        // Root = English version
      'sw': "https://mericanltd.vercel.app/sw",
      'fr': "https://mericanltd.vercel.app/fr",
      'es': "https://mericanltd.vercel.app/es",
      'de': "https://mericanltd.vercel.app/de",
      'it': "https://mericanltd.vercel.app/it",
      'x-default': "https://mericanltd.vercel.app", // Root as international default
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">  {/* Critical: tells browsers/crawlers this is English */}
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}