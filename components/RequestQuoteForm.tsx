"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RequestQuoteForm({ lang, t }: { lang: string; t: any }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
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
    // Dispatch event so Header cart count updates
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (!isLoaded) return <div className="loading-spinner">Loading...</div>;

  return (
    <>
      {/* LEFT: ITEMS LIST */}
      <div className="rfq-items-column rfq-card">
        <h2 className="rfq-title">{t.itemsTitle[lang] || t.itemsTitle.en}</h2>

        <div id="rfqCartItemsContainer">
          {cart.length === 0 ? (
            <div className="rfq-empty-box">
               <i className="fa fa-shopping-cart empty-cart-icon"></i>
               <h3>Your cart is empty!</h3>
               <p>Looks like you sneaked in without shopping 😄</p>
               <Link href={`/${lang}/products`} className="rfq-shop-btn">Go to Products</Link>
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
                    <span className="rfq-item-name">{item.name}</span>
                  </div>

                  <div className="rfq-item-controls">
                    <div className="rfq-qty-control">
                      <button onClick={() => updateQuantity(item.slug, -1)} disabled={item.quantity <= 1}>
                        -
                      </button>
                      <input type="number" className="rfq-qty-input" value={item.quantity} readOnly />
                      <button onClick={() => updateQuantity(item.slug, 1)}>+</button>
                    </div>
                    <button className="rfq-remove-btn" onClick={() => removeItem(item.slug)}>
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT: USER FORM */}
      <div className="rfq-form-column rfq-card">
        <h2 className="rfq-title">{t.detailsTitle[lang] || t.detailsTitle.en}</h2>
        <form action="/api/submit-quote" method="POST">
          <div className="rfq-form-group">
            <label>Full Name *</label>
            <input type="text" name="name" required />
          </div>

          <div className="rfq-form-group">
            <label>Email Address *</label>
            <input type="email" name="email" required />
          </div>

          <div className="rfq-form-group">
            <label>Phone Number *</label>
            <input type="text" name="phone" required />
          </div>

          {/* Hidden input to send the JSON cart data to the server */}
          <input type="hidden" name="cart_data" value={JSON.stringify(cart)} />

          <div className="rfq-form-group">
            <label>Project Details / Message *</label>
            <textarea name="message" rows={5} required></textarea>
          </div>

          <button type="submit" className="rfq-submit-btn" disabled={cart.length === 0}>
            Submit Quote Request
          </button>
        </form>
      </div>
    </>
  );
}