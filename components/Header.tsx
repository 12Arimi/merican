"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from "../lib/useTranslation";

const HeaderContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, lang } = useTranslation();

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q')?.replace(/-/g, ' ') || '');
  
  // --- Cart Badge Logic ---
  const [cartCount, setCartCount] = useState(0);

  const updateBadge = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      // We count the number of products (array length), not total quantity
      setCartCount(cart.length);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Initial load
    updateBadge();

    // Listen for changes from ProductActions
    window.addEventListener('cartUpdated', updateBadge);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('cartUpdated', updateBadge);
  }, []);
  // -------------------------

  useEffect(() => {
    setSearchValue(searchParams.get('q')?.replace(/-/g, ' ') || '');
  }, [searchParams]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const segments = pathname.split('/');
    segments[1] = newLang; 
    const newPath = segments.join('/');
    document.cookie = `lang=${newLang}; path=/; SameSite=Lax; Secure`;
    router.push(newPath);
  };

  const langLink = (path: string) => `/${lang}${path === '/' ? '' : path}`;

const handleSearchSubmit = (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (searchValue.trim()) {
    setIsSearchModalOpen(false);
    
    // 1. Clean the term: remove extra spaces and replace internal spaces with '-'
    // Example: "cold  room" becomes "cold-room"
    const formattedTerm = searchValue
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    
    // 2. Navigate to the dash-separated URL
    router.push(`/${lang}/search/${formattedTerm}`);
    
    setSearchValue(""); 
  }
};

  const isActive = (path: string) => {
    const fullPath = `/${lang}${path === '/' ? '' : path}`;
    return pathname === fullPath || (path !== '/' && pathname.startsWith(fullPath + '/'));
  };

  return (
    <>
      <header className="merican-header">
        <div className="merican-logo">
          <Link href={langLink("/")} style={{ display: 'inline-block' }}>
            <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/mericanlogo.webp" alt="Merican Limited Logo" />
          </Link>
        </div>

        <div className="merican-search-container">
          <input
            type="text"
            placeholder={t("header.searchPlaceholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
        </div>

        <div className="merican-nav-icons">
          <i 
            className="fa-solid fa-magnifying-glass merican-search-icon-mobile" 
            onClick={() => setIsSearchModalOpen(true)}
          />

          <div className="language-selector">
            <i className="fa-solid fa-globe lang-icon"></i>
            <select id="languageSelect" value={lang} onChange={handleLanguageChange}>
              <option value="en">{t("header.language.english")}</option>
              <option value="sw">{t("header.language.swahili")}</option>
              <option value="fr">{t("header.language.french")}</option>
              <option value="es">{t("header.language.spanish")}</option>
              <option value="de">{t("header.language.german")}</option>
              <option value="it">{t("header.language.italian")}</option>
            </select>
          </div>

          <Link href={langLink("/request-for-quote")} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="merican-cart-icon-wrapper">
              <i className="fa-solid fa-cart-shopping"></i>
              {/* Only show badge if count > 0 */}
              {cartCount > 0 && (
                <span className="merican-cart-badge" id="cartBadge">{cartCount}</span>
              )}
            </div>
          </Link>

          <i className="fa-solid fa-bars" onClick={() => setIsMenuOpen(true)} />
        </div>
      </header>

      {/* ... Rest of your Search Modal, Side Menu, and Overlay remain exactly the same ... */}
      <div className={`merican-search-modal ${isSearchModalOpen ? 'active' : ''}`}>
        <div className="merican-search-modal-content">
          <i className="fa-solid fa-xmark merican-modal-close" onClick={() => setIsSearchModalOpen(false)} />
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder={t("header.searchModalPlaceholder")} 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus={isSearchModalOpen}
            />
            {/* If you have a search icon button, make sure it is type="submit" */}
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>
        </div>
      </div>

      <div className={`merican-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="merican-menu-header">
          <span className="merican-menu-title">{t("header.menuTitle")}</span>
          <i className="fa-solid fa-xmark merican-menu-close" onClick={() => setIsMenuOpen(false)} />
        </div>
        <ul>
          <li><Link href={langLink("/")} className={isActive('/') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t("header.nav.home")}</Link></li>
          <li><Link href={langLink("/about")} className={isActive('/about') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t("header.nav.about")}</Link></li>
          <li className={`merican-dropdown ${isProductDropdownOpen || isActive('/products') || isActive('/category') ? 'open active' : ''}`}>
            <a href="#" className="merican-dropdown-toggle" onClick={(e) => { e.preventDefault(); setIsProductDropdownOpen(!isProductDropdownOpen); }}>
              {t("header.nav.products")} <i className="fa-solid fa-chevron-right merican-dropdown-arrow"></i>
            </a>
            <div className="merican-submenu">
              <Link href={langLink("/products")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.allProducts")}</Link>
              <Link href={langLink("/category/receiving")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.receiving")}</Link>
              <Link href={langLink("/category/storage")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.storage")}</Link>
              <Link href={langLink("/category/preparation")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.preparation")}</Link>
              <Link href={langLink("/category/production")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.production")}</Link>
              <Link href={langLink("/category/dispatch-servery")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.dispatchServery")}</Link>
              <Link href={langLink("/category/bar-area")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.barArea")}</Link>
              <Link href={langLink("/category/wash-up-area")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.washUpArea")}</Link>
              <Link href={langLink("/category/kitchen-support")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.kitchenSupport")}</Link>
              <Link href={langLink("/category/stainless-steel-fabrication")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.stainlessSteelFabrication")}</Link>
              <Link href={langLink("/category/gas-section")} onClick={() => setIsMenuOpen(false)}>{t("header.nav.gasSection")}</Link>
            </div>
          </li>
          <li><Link href={langLink("/services-projects")} className={isActive('/services-projects') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t("header.nav.servicesProjects")}</Link></li>
          <li><Link href={langLink("/partners-clients")} className={isActive('/partners-clients') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t("header.nav.partnersClients")}</Link></li>
          <li><Link href={langLink("/blog")} className={isActive('/blog') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t("header.nav.blog")}</Link></li>
          <li><Link href={langLink("/contact")} className={isActive('/contact') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>{t("header.nav.contact")}</Link></li>
        </ul>
      </div>

      <div 
        className={`merican-overlay ${(isMenuOpen || isSearchModalOpen) ? 'active' : ''}`} 
        onClick={() => { setIsMenuOpen(false); setIsSearchModalOpen(false); }}
      />
    </>
  );
};

const Header = () => (
  <Suspense fallback={<div className="merican-header-placeholder" style={{ height: '80px' }} />}>
    <HeaderContent />
  </Suspense>
);

export default Header;