"use client";

import React, { useState } from 'react';
import { useTranslation } from "../lib/useTranslation";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert(t("contact.form.success"));
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      {/* 🏙️ PAGE BANNER */}
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{t("contact.banner")}</h1>
        </div>
      </section>

      {/* 📞 CONTACT SECTION */}
      <section className="merican-contact-section">
        <div className="merican-contact-container">
          <h2 className="merican-contact-title">{t("contact.title")}</h2>
          <p className="merican-contact-subtitle">
            {t("contact.subtitle")}
          </p>

          <div className="merican-contact-grid">
            {/* Left: Contact Info */}
            <div className="merican-contact-info">
              <div className="contact-card">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h4>{t("contact.locationTitle")}</h4>
                  <p>{t("contact.location")}</p>
                </div>
              </div>

              <div className="contact-card">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h4>{t("contact.callTitle")}</h4>
                  <p><a href="tel:+254740174448">+254 740 174 448</a></p>
                </div>
              </div>

              <div className="contact-card">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h4>{t("contact.emailTitle")}</h4>
                  <p><a href="mailto:sales@mericanltd.com">sales@mericanltd.com</a></p>
                </div>
              </div>

              <div className="contact-card">
                <i className="fa-solid fa-clock"></i>
                <div>
                  <h4>{t("contact.hoursTitle")}</h4>
                  <p>{t("contact.hoursWeek")}<br />{t("contact.hoursSat")}</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="merican-contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder={t("contact.form.name")} 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder={t("contact.form.email")} 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder={t("contact.form.phone")} 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder={t("contact.form.subject")}
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message" 
                    rows={5} 
                    placeholder={t("contact.form.message")} 
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="contact-btn">{t("contact.form.send")}</button>
              </form>
            </div>
          </div>

          {/* 📍 Google Map Embed */}
          <div className="map-container" style={{ marginTop: '3rem' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15955.163353597816!2d36.877013!3d-1.300305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1141708892d7%3A0xc3f3453b341f2f81!2sMerican%20Limited!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '8px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;