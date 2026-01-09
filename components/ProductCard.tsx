"use client";

import React from 'react';
import Link from 'next/link';
import ProductActions from './ProductActions';

export default function ProductCard({ product, lang }: { product: any, lang: string }) {
  // 1. Logic: Check translated column. If null/empty, fallback to .name (English)
  const langKey = `name_${lang}`;
 const name = (lang !== 'en' && product[langKey as keyof typeof product]) 
  ? product[langKey as keyof typeof product] 
  : product.name;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imagePath = `${supabaseUrl}/storage/v1/object/public/images/${product.img}`;

  return (
    <div className="product-card">
      <Link href={`/${lang}/product/${product.slug}`} className="product-card-link">
        <div className="product-image-wrapper">
            <img 
                src={product.img ? imagePath : '/placeholder.png'} 
                alt={name} 
                loading="lazy"
            />
        </div>
        <h3>{name}</h3>
      </Link>

      <div className="product-card-actions-wrapper" onClick={(e) => e.preventDefault()}>
        <ProductActions product={product} lang={lang} />
      </div>
    </div>
  );
}