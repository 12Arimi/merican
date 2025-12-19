import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Ensure the path below matches where you put your CSS file
// If it's in public/assets/css/style.css, import it here:
// import "../public/assets/css/style.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merican Website",
  description: "Kitchen Equipment Experts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome for Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}