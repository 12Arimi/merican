"use client";

import React from 'react';
import { useTranslation } from "../lib/useTranslation";

const CeoMessage = () => {
  const { t } = useTranslation();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxvghczvmslyiiyrpzaw.supabase.co';
  const ceoImageUrl = `${supabaseUrl}/storage/v1/object/public/images/ceo.webp`;

  return (
    <section className="merican-ceo-section">
      <div className="merican-ceo-container">
        <h2 className="merican-ceo-title">{t("ceo.title")}</h2>

        <div className="merican-ceo-grid">
          <div className="merican-ceo-photo-container">
            <img 
              src={ceoImageUrl} 
              alt="Fred Akuno - CEO" 
              className="merican-ceo-photo"
              onError={(e) => {
                e.currentTarget.src = '/images/ceo-placeholder.webp';
              }}
            />
            <div className="merican-ceo-badge">
              <h3 className="merican-ceo-name">Fred Akuno</h3>
              <span className="merican-ceo-role">{t("ceo.role")}</span>
            </div>
          </div>

          <div className="merican-ceo-message-card">
            <p>{t("ceo.paragraph1")}</p>
            <p>{t("ceo.paragraph2")}</p>
            <p>{t("ceo.paragraph3")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoMessage;