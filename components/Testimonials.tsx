"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "../lib/useTranslation";

// Ensure this interface matches your DB column names
interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  client_avatar: string;
  testimonial_message: string; // Default English
  testimonial_message_de?: string;
  testimonial_message_es?: string;
  testimonial_message_fr?: string;
  testimonial_message_it?: string;
  testimonial_message_sw?: string;
  testimonial_image: string;
}

interface TestimonialsProps {
  initialData: Testimonial[];
}

const Testimonials = ({ initialData }: TestimonialsProps) => {
  const { t, lang, isLoading } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData || []);

  const imageBasePath =
    "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/testimonials/";

  // Optional: if your data is small, we can simply update display dynamically without re-fetching
  const getTranslatedMessage = (testimonial: Testimonial) => {
    if (lang === "en") return testimonial.testimonial_message;

    const langKey = `testimonial_message_${lang}` as keyof Testimonial;
    const translated = testimonial[langKey];

    return translated && String(translated).trim() !== ""
      ? String(translated)
      : testimonial.testimonial_message;
  };

  if (isLoading) {
    return <section className="merican-testimonials" style={{ opacity: 0, minHeight: "400px" }} />;
  }

  return (
    <section className="merican-testimonials">
      <div className="merican-testimonials-container">
        <h2 className="merican-testimonials-title">{t("testimonials.sectionTitle")}</h2>

        <div className="merican-testimonials-grid">
          {testimonials && testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="merican-testimonial-card">
                {testimonial.testimonial_image && (
                  <div className="merican-testimonial-image">
                    <img
                      src={`${imageBasePath}${testimonial.testimonial_image}`}
                      alt={testimonial.client_name}
                    />
                  </div>
                )}

                <div className="merican-testimonial-content">
                  <p className="merican-testimonial-message">
                    {getTranslatedMessage(testimonial)}
                  </p>

                  <div className="merican-testimonial-client">
                    {testimonial.client_avatar && (
                      <img
                        src={`${imageBasePath}${testimonial.client_avatar}`}
                        alt={testimonial.client_name}
                      />
                    )}
                    <div>
                      <h3 className="merican-testimonial-name">{testimonial.client_name}</h3>
                      <span className="merican-testimonial-company">
                        {testimonial.client_company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-full">{t("testimonials.noData")}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
