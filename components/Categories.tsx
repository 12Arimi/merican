"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from "../lib/useTranslation";

const Categories = () => {
  const { t, isLoading } = useTranslation();

  // Define the structure once to keep the JSX clean
  const CATEGORIES_LIST = [
    { href: "/category/receiving", img: "receiving-area.jpg", key: "receiving" },
    { href: "/category/storage", img: "storage-area.jpg", key: "storage" },
    { href: "/category/preparation", img: "preparation-section.jpg", key: "preparation" },
    { href: "/category/production", img: "production-section.jpg", key: "production" },
    { href: "/category/dispatch-servery", img: "servery-dispatch-section.jpg", key: "dispatchServery" },
    { href: "/category/wash-up-area", img: "wash-up-area.jpg", key: "washUpArea" },
    { href: "/category/bar-area", img: "bar-section.jpg", key: "barArea" },
    { href: "/category/gas-section", img: "commercial-kitchen-gas-section.jpg", key: "gasSection" },
    { href: "/category/stainless-steel-fabrication", img: "stainless-steel-fabrication.jpg", key: "stainlessSteelFabrication" },
    { href: "/category/kitchen-support", img: "commercial-kitchen-support.jpg", key: "kitchenSupport" },
  ];

  if (isLoading) {
    return <section className="merican-categories" style={{ opacity: 0 }}></section>;
  }

  return (
    <section className="merican-categories">
      <div className="merican-categories-container">
        {/* We use a new key for the section title */}
        <h2 className="merican-categories-title">{t("categories.title")}</h2>

        <div className="merican-categories-grid">
          {CATEGORIES_LIST.map((item) => (
            <Link key={item.key} href={item.href} className="merican-category-card">
              <div className="merican-category-image">
                <img 
                  src={`https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/${item.img}`} 
                  alt={t(`header.nav.${item.key}`)} 
                />
              </div>
              {/* This pulls the exact same translation as your Nav Menu */}
              <p className="merican-category-text">{t(`header.nav.${item.key}`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;