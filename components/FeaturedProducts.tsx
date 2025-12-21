"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "../lib/useTranslation";

// Helper component for individual cards
const ProductCard = ({ title, images }: { title: string; images: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatically cycle images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="merican-featured-card">
      <div className="merican-featured-carousel">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${title} ${idx + 1}`}
            className={idx === activeIndex ? "active" : ""}
            style={{ 
                display: idx === activeIndex ? 'block' : 'none',
                width: '100%',
                height: 'auto',
                transition: 'opacity 0.5s ease-in-out'
            }}
          />
        ))}
      </div>
      <div className="merican-featured-bottom">
        <div className="merican-featured-text">{title}</div>
        <div className="merican-featured-dots">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const { t, isLoading } = useTranslation();

  // Data structure moved inside to utilize the 't' function
  const FEATURED_DATA = [
    {
      title: t("featured.projects"),
      images: [
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-projects1.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-projects2.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-projects3.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-projects4.jpg",
      ]
    },
    {
      title: t("featured.maintenance"),
      images: [
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-service-maintenance1.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-service-maintenance2.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-service-maintenance3.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-service-maintenance4.jpg",
      ]
    },
    {
      title: t("featured.fabrication"),
      images: [
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/stainless-steel-fabrication1.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/stainless-steel-fabrication2.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/stainless-steel-fabrication3.jpg",
        "https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/stainless-steel-fabrication4.jpg",
      ]
    }
  ];

  // Prevent flashing raw keys by hiding section until translations are ready
  if (isLoading) {
    return <section className="merican-featured-products" style={{ opacity: 0, minHeight: '400px' }}></section>;
  }

  return (
    <section className="merican-featured-products">
      <div className="merican-featured-container">
        <h2 className="merican-featured-title">{t("featured.sectionTitle")}</h2>
        <div className="merican-featured-grid">
          {FEATURED_DATA.map((item, index) => (
            <ProductCard 
              key={index} 
              title={item.title} 
              images={item.images} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;