"use client";

import React from 'react';

const Partners = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxvghczvmslyiiyrpzaw.supabase.co';
  const imageBasePath = `${supabaseUrl}/storage/v1/object/public/images/`;

  const partnerLogos = [
    { src: 'partner1.webp', alt: 'Partner 1' },
    { src: 'partner2.jpg', alt: 'Partner 2' },
    { src: 'partner3.webp', alt: 'Partner 3' },
    { src: 'partner4.webp', alt: 'Partner 4' },
    { src: 'partner5.webp', alt: 'Partner 5' },
    { src: 'partner6.webp', alt: 'Lipagas' },
    { src: 'partner7.jpg', alt: 'Partner 7' },
  ];

  return (
    <section className="merican-partners-section">
      <div className="merican-partners-container">
        <h2 className="merican-partners-title">Strategic Partners</h2>
        <p className="merican-partners-subtitle">
          Our trusted partners help us deliver exceptional quality and innovation in commercial kitchen solutions.
        </p>

        <div className="merican-partners-grid">
          {partnerLogos.map((logo, index) => (
            <div key={index} className="merican-partner-card">
              <img 
                src={`${imageBasePath}${logo.src}`} 
                alt={logo.alt} 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;