"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RequestQuoteForm({ lang, t }: { lang: string; t: any }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  // Listen for the ?success=true flag from the API redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setIsSubmitted(true);
      setCart([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [searchParams]);

  // Load initial cart
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
    name: { 
      en: "Name", 
      sw: "Jina", 
      fr: "Nom", 
      es: "Nombre", 
      de: "Name", 
      it: "Nome" 
    },
    email: { 
      en: "Email Address", 
      sw: "Anwani ya Barua Pepe", 
      fr: "Adresse e-mail", 
      es: "Correo electrónico", 
      de: "E-Mail-Adresse", 
      it: "Indirizzo e-mail" 
    },
    phone: { 
      en: "Phone Number", 
      sw: "Nambari ya Simu", 
      fr: "Numéro de téléphone", 
      es: "Número de teléfono", 
      de: "Telefonnummer", 
      it: "Numero di telefono" 
    },
    message: { 
      en: "Project Details / Message", 
      sw: "Maelezo ya Mradi / Ujumbe", 
      fr: "Détails du projet / Message", 
      es: "Detalles del proyecto / Mensaje", 
      de: "Projektdetails / Nachricht", 
      it: "Dettagli del progetto / Messaggio" 
    },
    submit: { 
      en: "Submit Quote Request", 
      sw: "Tuma Ombi la Nukuu", 
      fr: "Envoyer la demande de devis", 
      es: "Enviar solicitud de presupuesto", 
      de: "Angebotsanfrage senden", 
      it: "Invia richiesta di preventivo" 
    },
    sending: { 
      en: "Sending...", 
      sw: "Inatuma...", 
      fr: "Envoi en cours...", 
      es: "Enviando...", 
      de: "Wird gesendet...", 
      it: "Invio in corso..." 
    },
    empty: { 
      en: "Your cart is empty!", 
      sw: "Kikapu chako ni tupu!", 
      fr: "Votre panier est vide !", 
      es: "¡Tu carrito está vacío!", 
      de: "Ihr Warenkorb ist leer!", 
      it: "Il tuo carrello è vuoto!" 
    },
    goShop: { 
      en: "Go to Products", 
      sw: "Nenda kwenye Bidhaa", 
      fr: "Aller aux produits", 
      es: "Ir a productos", 
      de: "Zu den Produkten", 
      it: "Vai ai prodotti" 
    },
    thanks: { 
      en: "Request Received!", 
      sw: "Ombi Limepokelewa!", 
      fr: "Demande reçue !", 
      es: "¡Solicitud recibida!", 
      de: "Anfrage erhalten!", 
      it: "Richiesta ricevuta!" 
    },
    thanksSub: { 
      en: "Your quote request has been saved. We will contact you shortly.", 
      sw: "Ombi lako limehifadhiwa. Tutawasiliana nawe hivi karibuni.", 
      fr: "Votre demande de devis a été enregistrée. Nous vous contacterons sous peu.", 
      es: "Su solicitud de presupuesto ha sido guardada. Nos pondremos en contacto con usted en breve.", 
      de: "Ihre Angebotsanfrage wurde gespeichert. Wir werden uns in Kürze bei Ihnen melden.", 
      it: "La tua richiesta di preventivo è stata salvata. Ti contatteremo a breve." 
    }
  };

  if (isSubmitted) {
    return (
      <div className="rfq-card" style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1' }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#28a745', marginBottom: '20px' }}></i>
        <h2 className="rfq-title">{formLabels.thanks[lang] || formLabels.thanks.en}</h2>
        <p>{formLabels.thanksSub[lang] || formLabels.thanksSub.en}</p>
        <Link href={`/${lang}/products`} className="rfq-shop-btn" style={{ marginTop: '30px' }}>
          {formLabels.goShop[lang] || formLabels.goShop.en}
        </Link>
      </div>
    );
  }

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
              {cart.map((item) => (
                <li key={item.slug} className="rfq-item-card">
                  <div className="rfq-item-details">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${item.img}`} 
                      alt={item.name} 
                      className="rfq-item-img" 
                    />
                    <span className="rfq-item-name">{item.names?.[lang] || item.name}</span>
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
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rfq-form-column rfq-card">
        <h2 className="rfq-title">{t.detailsTitle[lang] || t.detailsTitle.en}</h2>
        <form 
          action="/api/submit-quote" 
          method="POST" 
          onSubmit={() => setIsSubmitting(true)}
        >
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
              name: item.names?.[lang] || item.name,
              quantity: item.quantity
            })))} 
          />
          
          <div className="rfq-form-group">
            <label>{formLabels.message[lang] || formLabels.message.en} *</label>
            <textarea name="message" rows={5} required></textarea>
          </div>

          <button 
            type="submit" 
            className="rfq-submit-btn" 
            disabled={cart.length === 0 || isSubmitting}
          >
            {isSubmitting ? formLabels.sending[lang] : formLabels.submit[lang]}
          </button>
        </form>
      </div>
    </>
  );
}