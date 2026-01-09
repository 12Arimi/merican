"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from "../lib/useTranslation";
import ReactMarkdown from 'react-markdown';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Footer = () => {
  const { t, lang } = useTranslation();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: t("footer.ai.welcome") }
  ]);

  const currentYear = new Date().getFullYear();

  // Initialize Chat Session
  useEffect(() => {
    const initChat = async () => {
      let existingId = localStorage.getItem("merican_chat_id");
      
      if (!existingId) {
        const { data } = await supabase
          .from('chats')
          .insert([{ lang: lang, status: 'active', owner: 'ai' }])
          .select().single();
        
        if (data) {
          existingId = data.id;
          localStorage.setItem("merican_chat_id", existingId!);
        }
      }
      
      setChatId(existingId);

      if (existingId) {
        const { data: history } = await supabase
          .from('messages')
          .select('content, sender_role')
          .eq('chat_id', existingId)
          .order('created_at', { ascending: true });

        if (history && history.length > 0) {
          const formattedHistory = history.map(m => ({
            role: m.sender_role === 'user' ? 'user' : 'ai',
            text: m.content
          }));
          setChatMessages([{ role: 'ai', text: t("footer.ai.welcome") }, ...formattedHistory]);
        }
      }
    };
    initChat();
  }, [lang, t]);

  // FIX: Smarter Scroll Logic
  // Only auto-scroll when the number of messages increases or typing starts
  useEffect(() => {
    if (chatBodyRef.current) {
      const { scrollHeight, clientHeight } = chatBodyRef.current;
      chatBodyRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages.length, isTyping]); 

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping || !chatId) return;

    const userMsg = { role: 'user', text: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang: lang,
          chatId: chatId,
          messages: chatMessages
            .filter(msg => msg.text !== t("footer.ai.welcome"))
            .map(msg => ({
              role: msg.role === 'ai' ? 'assistant' : 'user',
              content: msg.text
            })).concat({ role: 'user', content: userInput })
        }),
      });

      const data = await response.json();
      if (data.text) {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: lang === 'sw' ? "Hitilafu imetokea." : "An error occurred." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
    document.body.classList.toggle('merican-no-scroll', !isAIChatOpen);
  };

  const handleCookieChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem("cookieConsent", choice);
    setShowCookiePopup(false);
  };

  return (
    <>
      <footer className="merican-footer">
        <div className="merican-footer-container">
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
                <li><Link href={`/${lang}`}>{t("footer.nav.home")}</Link></li>
                <li><Link href={`/${lang}/products`}>{t("footer.nav.products")}</Link></li>
                <li><Link href={`/${lang}/services-projects`}>{t("footer.nav.services")}</Link></li>
                <li><Link href={`/${lang}/partners-clients`}>{t("footer.nav.partners")}</Link></li>
                <li><Link href={`/${lang}/blog`}>{t("footer.nav.blog")}</Link></li>
                <li><Link href={`/${lang}/contact-us`}>{t("footer.nav.contact")}</Link></li>
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

      <div className="merican-floating-buttons">
        <button className="merican-floating-btn merican-ai-chat-btn" onClick={toggleAIChat}>AI</button>
        <a href="https://wa.me/254740174448" className="merican-floating-btn merican-whatsapp-btn" target="_blank">
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      {isAIChatOpen && (
        <div className="merican-ai-modal" onClick={toggleAIChat}>
          <div className="merican-ai-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="merican-ai-header">
              <h3>{t("footer.ai.title")}</h3>
              <button className="merican-ai-close" onClick={toggleAIChat}>&times;</button>
            </div>
            
            <div className="merican-ai-chat-body" ref={chatBodyRef}>
              <div className="merican-chat-inner"> {/* Wrapper for Flexbox control */}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`merican-ai-message ${msg.role}`}>
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="merican-ai-message ai">
                    <p><i>{lang === 'sw' ? 'Msaidizi anaandika...' : 'Assistant is typing...'}</i></p>
                  </div>
                )}
              </div>
            </div>

            <div className="merican-ai-input-area">
              <input 
                type="text" 
                placeholder={t("footer.ai.placeholder")} 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
              />
              <button onClick={handleSendMessage} disabled={isTyping}>
                {isTyping ? "..." : t("footer.ai.send")}
              </button>
            </div>
          </div>
        </div>
      )}

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