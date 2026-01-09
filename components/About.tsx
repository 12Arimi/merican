"use client";

import React from 'react';
import { useTranslation } from "../lib/useTranslation";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="merican-about-section">
      <div className="merican-about-container">
        <h2 className="merican-about-title">{t("about.title")}</h2>
        <p className="merican-about-subtitle">{t("about.subtitle")}</p>

        <p className="merican-about-description">
          {t("about.description")}
        </p>

        <div className="merican-about-grid">
          {/* Mission Card */}
          <div className="merican-about-card">
            <h3 className="merican-about-card-title">{t("about.mission")}</h3>
            <p>{t("about.missionText")}</p>
          </div>

          {/* Values Card */}
          <div className="merican-about-card">
            <h3 className="merican-about-card-title">{t("about.values")}</h3>
            <ul className="merican-about-list">
              <li>{t("about.v1")}</li>
              <li>{t("about.v2")}</li>
              <li>{t("about.v3")}</li>
              <li>{t("about.v4")}</li>
              <li>{t("about.v5")}</li>
            </ul>
          </div>

          {/* Expertise Card */}
          <div className="merican-about-card">
            <h3 className="merican-about-card-title">{t("about.expertise")}</h3>
            <ul className="merican-about-list">
              <li>{t("about.e1")}</li>
              <li>{t("about.e2")}</li>
              <li>{t("about.e3")}</li>
              <li>{t("about.e4")}</li>
              <li>{t("about.e5")}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;