"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: "Hello! I'm Merican Assistant, here to help with all things Merican Limited—your partner in commercial kitchen excellence in Nairobi." }
  ]);
  const [userInput, setUserInput] = useState("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Cookie Consent Logic
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
    if (!isAIChatOpen) {
      document.body.style.overflow = 'hidden'; // Restrict scrolling
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newMessages = [...chatMessages, { role: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    // Mock AI Response (Preview Mode)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        text: "This is a preview of the Merican AI Assistant. Soon I will be able to answer all your specific inquiries!" 
      }]);
    }, 600);
  };

  return (
    <>
      <footer className="merican-footer">
        <div className="merican-footer-container">
          {/* Newsletter Section */}
          <div className="merican-footer-newsletter">
            <h3>Subscribe to our Newsletter</h3>
            <p>Get the latest news and exclusive offers delivered straight to your inbox.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" aria-label="Subscribe">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>

          {/* Top Section */}
          <div className="merican-footer-top">
            <div className="merican-footer-col merican-col-company">
              <h3>About Merican Limited</h3>
              <p>Innovating commercial kitchens with high-quality, durable equipment and full-service solutions from design to installation.</p>
              <div className="merican-social-links">
                <a href="https://facebook.com/mericanlimited" target="_blank"><i className="fab fa-facebook-f"></i></a>
                <a href="https://instagram.com/merican.limited/" target="_blank"><i className="fab fa-instagram"></i></a>
                <a href="https://twitter.com/mericanlimited" target="_blank"><i className="fab fa-twitter"></i></a>
                <a href="https://linkedin.com/company/merican-limited/" target="_blank"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://youtube.com/@mericanlimited" target="_blank"><i className="fab fa-youtube"></i></a>
              </div>
            </div>

            <div className="merican-footer-col merican-col-nav">
              <h3>Navigation</h3>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/services">Our Services</Link></li>
                <li><Link href="/partners-clients">Projects/Clients</Link></li>
              </ul>
            </div>

            <div className="merican-footer-col merican-col-contact">
              <h3>Contact Us</h3>
              <p><i className="fas fa-map-marker-alt"></i> Industrial Area, Nanyuki Road, Nairobi, Kenya</p>
              <p><i className="fas fa-phone"></i> +254 740 174 448</p>
              <p><i className="fas fa-envelope"></i> <a href="mailto:sales@mericanltd.com">sales@mericanltd.com</a></p>
              <div className="merican-contact-details">
                <h4>Business Hours</h4>
                <ul className="hours-list">
                  <li>Mon - Fri: 8:00am to 5:00pm</li>
                  <li>Sat: 8:00am to 1:00pm</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="merican-footer-bottom">
            <p>&copy; {currentYear} Merican Limited. All rights reserved.</p>
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

      {/* AI Chat Modal (Preview) */}
      {isAIChatOpen && (
        <div className="merican-ai-modal" style={{ display: 'flex' }} onClick={toggleAIChat}>
          <div className="merican-ai-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="merican-ai-header">
              <h3>Merican AI Assistant</h3>
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
                placeholder="Type your message..." 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Popup */}
      <div className={`cookie-popup ${showCookiePopup ? 'show' : ''}`}>
        <h3 className="cookie-header">🍪 Cookie Preferences</h3>
        <p className="cookie-text">We use cookies to personalize your experience and analyze traffic.</p>
        <div className="cookie-buttons">
          <button onClick={() => handleCookieChoice('accepted')} className="accept-btn">Accept</button>
          <button onClick={() => handleCookieChoice('rejected')} className="reject-btn">Reject</button>
        </div>
      </div>
    </>
  );
};

export default Footer;