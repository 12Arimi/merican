"use client";

import React from 'react';

const CeoMessage = () => {
  // Use your Supabase URL for the CEO image
  // Note: I added /ceo.webp to your base path. Make sure the filename matches exactly!
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxvghczvmslyiiyrpzaw.supabase.co';
  const ceoImageUrl = `${supabaseUrl}/storage/v1/object/public/images/ceo.webp`;

  return (
    <section className="merican-ceo-section">
      <div className="merican-ceo-container">
        <h2 className="merican-ceo-title">CEO’s Message</h2>

        <div className="merican-ceo-grid">
          {/* LEFT: CEO IMAGE */}
          <div className="merican-ceo-photo-container">
            <img 
              src={ceoImageUrl} 
              alt="Fred Akuno - CEO" 
              className="merican-ceo-photo"
              onError={(e) => {
                // Fallback in case the image doesn't load
                e.currentTarget.src = '/images/ceo-placeholder.webp';
              }}
            />
            <div className="merican-ceo-badge">
              <h3 className="merican-ceo-name">Fred Akuno</h3>
              <span className="merican-ceo-role">Chief Executive Officer</span>
            </div>
          </div>

          {/* RIGHT: MESSAGE CARD */}
          <div className="merican-ceo-message-card">
            <p>
              As Merican Ltd continues to grow, we have established the need for adapting to 
              the current consumer needs within the market. Our success is informed by the 
              unique minds we have running our business, striving to continue as a fair 
              employer that adopts no bias in the recruitment process.
            </p>
            <p>
              We aim to continue in this light even in the future as we grow and venture 
              further into being the leader within the Commercial Kitchen Equipment industry.
            </p>
            <p>
              One of our key focus areas is our investment in Corporate Social Responsibility 
              (CSR) activities, with emphasis on environmental conservation. We believe in 
              active involvement in providing solutions for climate change effects, which 
              continue to affect our nation and the world at large.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoMessage;