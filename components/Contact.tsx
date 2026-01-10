"use client";

import React, { useState } from 'react';
import { useTranslation } from "../lib/useTranslation";

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(t("contact.form.success"));
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      alert("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">{t("contact.banner")}</h1>
        </div>
      </section>

      <section className="merican-contact-section">
        <div className="merican-contact-container">
          <h2 className="merican-contact-title">{t("contact.title")}</h2>
          <p className="merican-contact-subtitle">{t("contact.subtitle")}</p>

          <div className="merican-contact-grid">
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

            <div className="merican-contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" name="name" placeholder={t("contact.form.name")} required value={formData.name} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder={t("contact.form.email")} required value={formData.email} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <input type="tel" name="phone" placeholder={t("contact.form.phone")} required value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <input type="text" name="subject" placeholder={t("contact.form.subject")} value={formData.subject} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <textarea name="message" rows={5} placeholder={t("contact.form.message")} required value={formData.message} onChange={handleChange} disabled={isSubmitting}></textarea>
                </div>
                <button type="submit" className="contact-btn" disabled={isSubmitting}>
                  {isSubmitting ? "..." : t("contact.form.send")}
                </button>
              </form>
            </div>
          </div>

          <div className="map-container" style={{ marginTop: '3rem' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7828326082004!2d36.877425699999996!3d-1.3053979999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f13d184849d01%3A0xa36a9a1bff8fb62e!2sMerican%20Limited!5e0!3m2!1sen!2ske!4v1768066378540!5m2!1sen!2ske" 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '8px' }} 
              allowFullScreen={true} 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;