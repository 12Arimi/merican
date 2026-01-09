"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RequestQuoteForm({ lang, t }: { lang: string; t: any }) {
  // We initialize with an empty array to avoid hydration mismatch, 
  // but we remove the 'isLoaded' check to stop the flickering.
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (slug: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.slug === slug) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (slug: string) => {
    const updated = cart.filter(item => item.slug !== slug);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formLabels: any = {
    name: { en: "Name", sw: "Jina", fr: "Nom", es: "Nombre", de: "Name", it: "Nome" },
    email: { en: "Email Address", sw: "Anwani ya Barua Pepe", fr: "Adresse E-mail", es: "Correo Electrónico", de: "E-Mail-Adresse", it: "Indirizzo E-mail" },
    phone: { en: "Phone Number", sw: "Nambari ya Simu", fr: "Numéro de Téléphone", es: "Número de Teléfono", de: "Telefonnummer", it: "Numero di Telefono" },
    message: { en: "Project Details / Message", sw: "Maelezo ya Mradi / Ujumbe", fr: "Détails du projet / Message", es: "Detalles del proyecto / Mensaje", de: "Projektdetails / Nachricht", it: "Dettagli del progetto / Messaggio" },
    submit: { en: "Submit Quote Request", sw: "Tuma Ombi la Nukuu", fr: "Envoyer la demande", es: "Enviar solicitud", de: "Anfrage absenden", it: "Invia richiesta" },
    empty: { en: "Your cart is empty!", sw: "Kikapu chako ni tupu!", fr: "Votre panier est vide !", es: "¡Tu carrito está vacío!", de: "Ihr Warenkorb ist leer!", it: "Il tuo carrello è vuoto!" },
    goShop: { en: "Go to Products", sw: "Nenda kwenye Bidhaa", fr: "Voir les produits", es: "Ir a productos", de: "Zu den Produkten", it: "Vai ai prodotti" }
  };

  return (
    <>
      <div className="rfq-items-column rfq-card">
        <h2 className="rfq-title">{t.itemsTitle[lang] || t.itemsTitle.en}</h2>

        <div id="rfqCartItemsContainer">
          {cart.length === 0 ? (
            <div className="rfq-empty-box">
               <i className="fa fa-shopping-cart empty-cart-icon"></i>
               <h3>{formLabels.empty[lang] || formLabels.empty.en}</h3>
               <Link href={`/${lang}/products`} className="rfq-shop-btn">
                {formLabels.goShop[lang] || formLabels.goShop.en}
               </Link>
            </div>
          ) : (
            <ul className="rfq-item-list">
              {cart.map((item) => {
                const displayName = item.names?.[lang] || item.names?.en || item.name;
                return (
                  <li key={item.slug} className="rfq-item-card">
                    <div className="rfq-item-details">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${item.img}`} 
                        alt={displayName} 
                        className="rfq-item-img" 
                      />
                      <span className="rfq-item-name">{displayName}</span>
                    </div>
                    <div className="rfq-item-controls">
                      <div className="rfq-qty-control">
                        <button onClick={() => updateQuantity(item.slug, -1)} disabled={item.quantity <= 1}>-</button>
                        <input type="number" className="rfq-qty-input" value={item.quantity} readOnly />
                        <button onClick={() => updateQuantity(item.slug, 1)}>+</button>
                      </div>
                      <button className="rfq-remove-btn" onClick={() => removeItem(item.slug)}>🗑️</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="rfq-form-column rfq-card">
        <h2 className="rfq-title">{t.detailsTitle[lang] || t.detailsTitle.en}</h2>
        <form action="/api/submit-quote" method="POST">
          <div className="rfq-form-group">
            <label>{formLabels.name[lang] || formLabels.name.en} *</label>
            <input type="text" name="name" required />
          </div>
          <div className="rfq-form-group">
            <label>{formLabels.email[lang] || formLabels.email.en} *</label>
            <input type="email" name="email" required />
          </div>
          <div className="rfq-form-group">
            <label>{formLabels.phone[lang] || formLabels.phone.en} *</label>
            <input type="text" name="phone" required />
          </div>
          <input 
            type="hidden" 
            name="cart_data" 
            value={JSON.stringify(cart.map(item => ({
              slug: item.slug,
              name: item.names?.[lang] || item.names?.en || item.name,
              quantity: item.quantity
            })))} 
          />
          <div className="rfq-form-group">
            <label>{formLabels.message[lang] || formLabels.message.en} *</label>
            <textarea name="message" rows={5} required></textarea>
          </div>
          <button type="submit" className="rfq-submit-btn" disabled={cart.length === 0}>
            {formLabels.submit[lang] || formLabels.submit.en}
          </button>
        </form>
      </div>
    </>
  );
}