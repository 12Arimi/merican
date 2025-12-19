import { Suspense } from "react";
import Header from "../../components/Header";
import Clients from "../../components/Clients";
import Partners from "../../components/Partners";

export default function PartnersPage() {
  return (
    <div>
      <Header />
      
      {/* 🏙️ PAGE BANNER (Placed here so it only appears once at the top) */}
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">Partners and Clients</h1>
        </div>
      </section>

      <main>
        {/* 1. Clients Section (Top) */}
        <Suspense fallback={<div className="p-10 text-center">Loading Clients...</div>}>
          <Clients />
        </Suspense>

        {/* 2. Partners Section (Bottom) */}
        <Suspense fallback={<div className="p-10 text-center">Loading Partners...</div>}>
          <Partners />
        </Suspense>
      </main>
    </div>
  );
}