import { Suspense } from "react";
import Contact from "../../components/Contact";

export default function ContactPage() {
  return (
    <div>
        <Suspense fallback={<div className="p-10 text-center">Loading Contact Form...</div>}>
          <Contact />
        </Suspense>
    </div>
  );
}