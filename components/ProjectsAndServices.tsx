"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from "../lib/useTranslation";

interface DBItem {
  slug: string;
  title: string;
  cover_image: string | null;
}

interface ProjectsAndServicesProps {
  projects: DBItem[];
  services: DBItem[];
}

const ProjectsAndServices = ({ projects, services }: ProjectsAndServicesProps) => {
  const { t } = useTranslation();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imagePath = `${supabaseUrl}/storage/v1/object/public/images/projects-services/`;

  const renderList = (title: string, items: DBItem[]) => (
    <div className="commercial-kitchen-column">
      <h2>{title}</h2>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.slug} className="item-card">
            <Link href={`/services-projects/${item.slug}`} className="card-link">
              <img 
                src={item.cover_image ? `${imagePath}${item.cover_image}` : '/images/placeholder.png'} 
                alt={item.title} 
              />
              <span>{item.title}</span>
            </Link>
            <Link href={`/services-projects/${item.slug}`} className="view-btn">
              {t("projectsServices.viewBtn")} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="commercial-kitchen-section">
      <div className="commercial-kitchen-container">
        {renderList(t("projectsServices.projectsTitle"), projects)}
        {renderList(t("projectsServices.servicesTitle"), services)}
      </div>
    </section>
  );
};

export default ProjectsAndServices;