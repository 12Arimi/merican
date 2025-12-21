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

  // Sync search input with URL params
  useEffect(() => {
    setSearchValue(searchParams.get('q')?.replace(/-/g, ' ') || '');
  }, [searchParams]);

  // Language Change Logic: Switch URL path (e.g., /en/contact -> /sw/contact)
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const segments = pathname.split('/');
    segments[1] = newLang; 
    const newPath = segments.join('/');
    
    // Set cookie for middleware to remember preference
    document.cookie = `lang=${newLang}; path=/; SameSite=Lax; Secure`;
    router.push(newPath);
  };

  // SEO Helper: Ensures every link is prefixed with the current language
  const langLink = (path: string) => `/${lang}${path === '/' ? '' : path}`;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchValue.trim()) {
      const slugQuery = searchValue.trim().replace(/\s+/g, '-');
      setIsSearchModalOpen(false);
      router.push(`/${lang}/search/${slugQuery}`);
    }
  };

  // Active link logic updated for locale paths
  const isActive = (path: string) => {
    const fullPath = `/${lang}${path === '/' ? '' : path}`;
    return pathname === fullPath || (path !== '/' && pathname.startsWith(fullPath + '/'));
  };

  return (
    <>
      <header className="merican-header">
        {/* Logo */}
        <div className="merican-logo">
          <Link href={langLink("/")} style={{ display: 'inline-block' }}>
            <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/mericanlogo.webp" alt="Merican Limited Logo" />
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="merican-search-container">
          <input
            type="text"
            placeholder={t("header.searchPlaceholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
        </div>

        {/* Icons Section */}
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
              <span className="merican-cart-badge" id="cartBadge">0</span>
            </div>
          </Link>

          <i className="fa-solid fa-bars" onClick={() => setIsMenuOpen(true)} />
        </div>
      </header>

      {/* Search Modal */}
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
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>
        </div>
      </div>

      {/* Side Menu - Fully Restored */}
      <div className={`merican-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="merican-menu-header">
          <span className="merican-menu-title">{t("header.menuTitle")}</span>
          <i className="fa-solid fa-xmark merican-menu-close" onClick={() => setIsMenuOpen(false)} />
        </div>
        <ul>
          <li>
            <Link href={langLink("/")} className={isActive('/') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t("header.nav.home")}
            </Link>
          </li>
          <li className={`merican-dropdown ${isProductDropdownOpen || isActive('/products') || isActive('/category') ? 'open active' : ''}`}>
            <a 
              href="#" 
              className="merican-dropdown-toggle"
              onClick={(e) => { e.preventDefault(); setIsProductDropdownOpen(!isProductDropdownOpen); }}
            >
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