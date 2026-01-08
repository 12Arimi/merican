"use client";

import React, { useState, useEffect } from 'react';

export default function ProductActions({ product, lang }: { product: any, lang: string }) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const existingItem = cart.find((item: any) => item.slug === product.slug);
      if (existingItem) {
        setQuantity(existingItem.quantity);
      }
    }
  }, [product.slug]);

  const updateCartStorage = (newQty: number) => {
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    if (newQty > 0) {
      const existingIndex = cart.findIndex((item: any) => item.slug === product.slug);
      const productData = {
        slug: product.slug,
        name: product[`name_${lang}`] || product.name,
        img: product.img,
        quantity: newQty
      };

      if (existingIndex > -1) {
        cart[existingIndex] = productData;
      } else {
        cart.push(productData);
      }
    } else {
      cart = cart.filter((item: any) => item.slug !== product.slug);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleSetQuantity = (newQty: number) => {
    const qty = Math.max(0, newQty);
    setQuantity(qty);
    updateCartStorage(qty);
  };

  const labels: any = {
    add: { en: 'Add to cart', sw: 'Ongeza kwa Kikapu', fr: 'Ajouter au panier', es: 'Añadir al carrito', de: 'In den Warenkorb', it: 'Aggiungi al carrello' },
    minus: { en: 'Decrease quantity', sw: 'Punguza kiasi', fr: 'Diminuer la quantité', es: 'Disminuir', de: 'Menge verringern', it: 'Diminuisci' },
    plus: { en: 'Increase quantity', sw: 'Ongeza kiasi', fr: 'Augmenter la quantité', es: 'Aumentar', de: 'Menge erhöhen', it: 'Aumenta' }
  };

  return (
    <div className="product-actions">
      {quantity === 0 ? (
        <button 
          className="add-to-cart-btn" 
          onClick={() => handleSetQuantity(1)}
        >
          {labels.add[lang] || labels.add.en}
        </button>
      ) : (
        <div className="quantity-control">
          <button 
            onClick={() => handleSetQuantity(quantity - 1)}
            aria-label={labels.minus[lang] || labels.minus.en}
          >
            -
          </button>
          <input 
            type="number" 
            value={quantity} 
            readOnly 
            className="quantity-input"
          />
          <button 
            onClick={() => handleSetQuantity(quantity + 1)}
            aria-label={labels.plus[lang] || labels.plus.en}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}