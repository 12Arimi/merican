"use client";

import React from 'react';
import { useTranslation } from "../lib/useTranslation";

const ServicesIcons = () => {
  const { t } = useTranslation();

  const servicesData = [
    { icon: "📐", title: t("services.cad.title"), desc: t("services.cad.desc") },
    { icon: "⚒️", title: t("services.custom.title"), desc: t("services.custom.desc") },
    { icon: "🔧", title: t("services.install.title"), desc: t("services.install.desc") },
    { icon: "🔬", title: t("services.test.title"), desc: t("services.test.desc") },
    { icon: "👥", title: t("services.train.title"), desc: t("services.train.desc") },
    { icon: "🤝", title: t("services.handover.title"), desc: t("services.handover.desc") },
  ];

  return (
    <section className="merican-services-section">
      <div className="merican-services-container">
        <h2 className="merican-services-title">{t("services.title")}</h2>
        <p className="merican-services-subtitle">{t("services.subtitle")}</p>
        <div className="merican-services-grid">
          {servicesData.map((item, index) => (
            <div key={index} className="merican-service-item">
              <div className="merican-service-icon">{item.icon}</div>
              <div className="merican-service-content">
                <h3 className="merican-service-title">{item.title}</h3>
                <p className="merican-service-description">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesIcons;