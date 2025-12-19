import { Suspense } from "react";
import Header from "../../components/Header";
import Contact from "../../components/Contact";

export default function ContactPage() {
  return (
    <div>
      {/* Header is included here so it shows on the contact page too */}
      <Header />
      
      <main>
        {/* We wrap Contact in Suspense because it's a best practice 
            if the page eventually handles dynamic URL queries */}
        <Suspense fallback={<div className="p-10 text-center">Loading Contact Form...</div>}>
          <Contact />
        </Suspense>
      </main>
    </div>
  );
}