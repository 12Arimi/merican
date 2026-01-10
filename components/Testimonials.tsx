"use client";

import React from "react";
import { useTranslation } from "../lib/useTranslation";

// Updated Imports for Swiper 11+
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles (These usually don't throw errors)
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  client_avatar: string;
  testimonial_message: string;
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
  const { t, lang } = useTranslation();
  const testimonials = initialData || [];

  const imageBasePath =
    "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/testimonials/";

  const getTranslatedMessage = (testimonial: Testimonial) => {
    if (lang === "en") return testimonial.testimonial_message;
    const langKey = `testimonial_message_${lang}` as keyof Testimonial;
    const translated = testimonial[langKey];
    return translated && String(translated).trim() !== ""
      ? String(translated)
      : testimonial.testimonial_message;
  };

  return (
    <section className="merican-testimonials">
      <div className="merican-testimonials-container">
        <h2 className="merican-testimonials-title">{t("testimonials.sectionTitle")}</h2>

        {testimonials && testimonials.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            centeredSlides={false}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="merican-testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="merican-testimonial-card">
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
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center w-full">{t("testimonials.noData")}</p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;