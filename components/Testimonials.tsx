"use client";

import React from 'react';

interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  client_avatar: string;
  testimonial_message: string;
  testimonial_image: string;
}

const Testimonials = ({ initialData }: { initialData: Testimonial[] }) => {
  const imageBasePath = 'https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/testimonials/';

  return (
    <section className="merican-testimonials">
      <div className="merican-testimonials-container">
        <h2 className="merican-testimonials-title">Client Testimonials</h2>

        <div className="merican-testimonials-grid">
          {initialData.length > 0 ? (
            initialData.map((testimonial) => (
              <div key={testimonial.id} className="merican-testimonial-card">
                
                {testimonial.testimonial_image && (
                  <div className="merican-testimonial-image">
                    <img
                      src={`${imageBasePath}${testimonial.testimonial_image}`}
                      alt={`Testimonial image for ${testimonial.client_name}`}
                    />
                  </div>
                )}

                <div className="merican-testimonial-content">
                  <p className="merican-testimonial-message">
                    {testimonial.testimonial_message}
                  </p>

                  <div className="merican-testimonial-client">
                    {testimonial.client_avatar && (
                      <img
                        src={`${imageBasePath}${testimonial.client_avatar}`}
                        alt={`Avatar of ${testimonial.client_name}`}
                      />
                    )}

                    <div>
                      <h3 className="merican-testimonial-name">
                        {testimonial.client_name}
                      </h3>
                      <span className="merican-testimonial-company">
                        {testimonial.client_company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-full">No client testimonials available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;