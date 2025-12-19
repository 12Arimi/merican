"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [searchValue, setSearchValue] = useState("");

  // Sync search input with URL params
  useEffect(() => {
    const q = searchParams.get("q");
    setSearchValue(q ? q.replace(/-/g, " ") : "");
  }, [searchParams]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!searchValue.trim()) return;

    const slugQuery = searchValue.trim().replace(/\s+/g, "-");
    setIsSearchModalOpen(false);
    router.push(`/search/${slugQuery}`);
  };

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      <header className="merican-header">
        {/* Logo */}
        <div className="merican-logo">
          <Link href="/">
            <img
              src="/images/mericanlogo.webp"
              alt="Merican Limited Logo"
            />
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="merican-search-container">
          <input
            type="text"
            placeholder="Search products, articles, or ideas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
        </div>

        {/* Icons */}
        <div className="merican-nav-icons">
          <i
            className="fa-solid fa-magnifying-glass merican-search-icon-mobile"
            onClick={() => setIsSearchModalOpen(true)}
          />

          {/* Language Selector (visual only) */}
          <div className="language-selector">
            <i className="fa-solid fa-globe lang-icon"></i>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>

          {/* Cart */}
          <Link href="/request-for-quote">
            <div className="merican-cart-icon-wrapper">
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="merican-cart-badge">0</span>
            </div>
          </Link>

          {/* Hamburger */}
          <i
            className="fa-solid fa-bars"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </header>

      {/* Search Modal */}
      <div
        className={`merican-search-modal ${
          isSearchModalOpen ? "active" : ""
        }`}
      >
        <div className="merican-search-modal-content">
          <i
            className="fa-solid fa-xmark merican-modal-close"
            onClick={() => setIsSearchModalOpen(false)}
          />
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      </div>

      {/* Side Menu */}
      <div className={`merican-menu ${isMenuOpen ? "active" : ""}`}>
        <div className="merican-menu-header">
          <span className="merican-menu-title">Menu</span>
          <i
            className="fa-solid fa-xmark"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>

        <ul>
          <li>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li
            className={`merican-dropdown ${
              isProductDropdownOpen ||
              isActive("/products") ||
              isActive("/category")
                ? "open active"
                : ""
            }`}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsProductDropdownOpen(!isProductDropdownOpen);
              }}
            >
              Products
              <i className="fa-solid fa-chevron-right"></i>
            </a>

            <div className="merican-submenu">
              <Link href="/products">All Products</Link>
              <Link href="/category/receiving">Receiving</Link>
              <Link href="/category/storage">Storage</Link>
              <Link href="/category/preparation">Preparation</Link>
              <Link href="/category/production">Production</Link>
              <Link href="/category/dispatch-servery">Dispatch / Servery</Link>
              <Link href="/category/bar-area">Bar Area</Link>
              <Link href="/category/wash-up-area">Wash-up Area</Link>
              <Link href="/category/kitchen-support">Kitchen Support</Link>
              <Link href="/category/stainless-steel-fabrication">
                Stainless Steel Fabrication
              </Link>
              <Link href="/category/gas-section">Gas Section</Link>
            </div>
          </li>

          <li><Link href="/services-projects">Services & Projects</Link></li>
          <li><Link href="/partners-clients">Partners & Clients</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>

      {/* Overlay */}
      <div
        className={`merican-overlay ${
          isMenuOpen || isSearchModalOpen ? "active" : ""
        }`}
        onClick={() => {
          setIsMenuOpen(false);
          setIsSearchModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;
