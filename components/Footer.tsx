"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from "../lib/useTranslation";

const Footer = () => {
  const { t } = useTranslation();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  
  // Initialize chat with translated welcome message
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: t("footer.ai.welcome") }
  ]);
  const [userInput, setUserInput] = useState("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setShowCookiePopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCookieChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem("cookieConsent", choice);
    setShowCookiePopup(false);
  };

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
    document.body.style.overflow = !isAIChatOpen ? 'hidden' : 'auto';
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        text: t("footer.ai.preview") 
      }]);
    }, 600);
  };

  return (
    <>
      <footer className="merican-footer">
        <div className="merican-footer-container">
          {/* Newsletter Section */}
          <div className="merican-footer-newsletter">
            <h3>{t("footer.newsletter.title")}</h3>
            <p>{t("footer.newsletter.text")}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t("footer.newsletter.placeholder")} required />
              <button type="submit" aria-label="Subscribe">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>

          {/* Top Section */}
          <div className="merican-footer-top">
            <div className="merican-footer-col merican-col-company">
              <h3>{t("footer.about.title")}</h3>
              <p>{t("footer.about.text")}</p>
              <div className="merican-social-links">
                <a href="https://facebook.com/mericanlimited" target="_blank"><i className="fab fa-facebook-f"></i></a>
                <a href="https://instagram.com/merican.limited/" target="_blank"><i className="fab fa-instagram"></i></a>
                <a href="https://twitter.com/mericanlimited" target="_blank"><i className="fab fa-twitter"></i></a>
                <a href="https://linkedin.com/company/merican-limited/" target="_blank"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://youtube.com/@mericanlimited" target="_blank"><i className="fab fa-youtube"></i></a>
              </div>
            </div>

            <div className="merican-footer-col merican-col-nav">
              <h3>{t("footer.nav.title")}</h3>
              <ul>
                <li><Link href="/">{t("footer.nav.home")}</Link></li>
                <li><Link href="/products">{t("footer.nav.products")}</Link></li>
                <li><Link href="/services-projects">{t("footer.nav.services")}</Link></li>
                <li><Link href="/partners-clients">{t("footer.nav.partners")}</Link></li>
                <li><Link href="/blog">{t("footer.nav.blog")}</Link></li>
                <li><Link href="/contact-us">{t("footer.nav.contact")}</Link></li>
              </ul>
            </div>

            <div className="merican-footer-col merican-col-contact">
              <h3>{t("footer.contact.title")}</h3>
              <p><i className="fas fa-map-marker-alt"></i> Industrial Area, Nanyuki Road, Nairobi, Kenya</p>
              <p><i className="fas fa-phone"></i> +254 740 174 448</p>
              <p><i className="fas fa-envelope"></i> <a href="mailto:sales@mericanltd.com">sales@mericanltd.com</a></p>
              <div className="merican-contact-details">
                <h4>{t("footer.contact.hours")}</h4>
                <ul className="hours-list">
                  <li>{t("footer.contact.monFri")}</li>
                  <li>{t("footer.contact.sat")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="merican-footer-bottom">
            <p>&copy; {currentYear} Merican Limited. {t("footer.rights")}</p>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="merican-floating-buttons">
        <button className="merican-floating-btn merican-ai-chat-btn" onClick={toggleAIChat}>
          AI
        </button>
        <a href="https://wa.me/254740174448" className="merican-floating-btn merican-whatsapp-btn" target="_blank">
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      {/* AI Chat Modal */}
      {isAIChatOpen && (
        <div className="merican-ai-modal" style={{ display: 'flex' }} onClick={toggleAIChat}>
          <div className="merican-ai-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="merican-ai-header">
              <h3>{t("footer.ai.title")}</h3>
              <button className="merican-ai-close" onClick={toggleAIChat}>&times;</button>
            </div>
            <div className="merican-ai-chat-body">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`merican-ai-message ${msg.role}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="merican-ai-input-area">
              <input 
                type="text" 
                placeholder={t("footer.ai.placeholder")} 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>{t("footer.ai.send")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Popup */}
      <div className={`cookie-popup ${showCookiePopup ? 'show' : ''}`}>
        <h3 className="cookie-header">{t("footer.cookies.title")}</h3>
        <p className="cookie-text">{t("footer.cookies.text")}</p>
        <div className="cookie-buttons">
          <button onClick={() => handleCookieChoice('accepted')} className="accept-btn">{t("footer.cookies.accept")}</button>
          <button onClick={() => handleCookieChoice('rejected')} className="reject-btn">{t("footer.cookies.reject")}</button>
        </div>
      </div>
    </>
  );
};

export default Footer;