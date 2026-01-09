"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from "../lib/useTranslation";

interface Client {
  id: number;
  name: string;
  slug: string;
  logo: string;
}

interface ClientsProps {
  initialClients: Client[];
}

const Clients = ({ initialClients }: ClientsProps) => {
  const { t } = useTranslation();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageBasePath = `${supabaseUrl}/storage/v1/object/public/images/clients/`;

  return (
    <section className="merican-clients-section">
      <div className="merican-clients-container">
        <h2 className="merican-clients-title">{t("clients.title")}</h2>
        <p className="merican-clients-subtitle">
          {t("clients.subtitle")}
        </p>

        <div className="merican-clients-grid">
          {initialClients.length > 0 ? (
            initialClients.map((client) => (
              <Link key={client.id} href={`/partners-clients/${client.slug}`} className="merican-client-link">
                <div className="merican-client-card">
                  <img 
                    src={client.logo ? `${imageBasePath}${client.logo}` : '/images/placeholder-client.png'} 
                    alt={client.name} 
                    loading="lazy"
                  />
                  <p className="client-name">{client.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center w-full">{t("clients.noClients")}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Clients;