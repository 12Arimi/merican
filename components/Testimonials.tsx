"use client";

import React, { useEffect, useState } from 'react';

// Define the shape of our testimonial data
interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  client_avatar: string;
  testimonial_message: string;
  testimonial_image: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // The base path for your images (ensure these exist in public/images/testimonials/)
  const imageBasePath = '/images/testimonials/';

  useEffect(() => {
    const getTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    getTestimonials();
  }, []);

  if (loading) return <div className="text-center py-10">Loading testimonials...</div>;

  return (
    <section className="merican-testimonials">
      <div className="merican-testimonials-container">
        <h2 className="merican-testimonials-title">Client Testimonials</h2>

        <div className="merican-testimonials-grid">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="merican-testimonial-card">
                
                {/* Main Testimonial Image */}
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
                    {/* Client Avatar */}
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
            <p>No client testimonials available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;