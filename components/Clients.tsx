"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Client {
  id: number;
  name: string;
  slug: string;
  logo: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageBasePath = `${supabaseUrl}/storage/v1/object/public/images/clients/`;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading our clients...</div>;

  return (
    <section className="merican-clients-section">
      <div className="merican-clients-container">
        <h2 className="merican-clients-title">Our Clients</h2>
        <p className="merican-clients-subtitle">
          We are proud to work with a diverse range of clients across various industries, 
          providing them with high-quality commercial kitchen equipment.
        </p>

        <div className="merican-clients-grid">
          {clients.length > 0 ? (
            clients.map((client) => (
              <Link key={client.id} href={`/partners-clients/${client.slug}`} className="merican-client-link">
                <div className="merican-client-card">
                  <img 
                    src={client.logo ? `${imageBasePath}${client.logo}` : '/images/placeholder-client.png'} 
                    alt={client.name} 
                    loading="lazy" 
                    onError={(e) => { e.currentTarget.src = '/images/placeholder-client.png'; }}
                  />
                  <p className="client-name">{client.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center w-full">No clients found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Clients;