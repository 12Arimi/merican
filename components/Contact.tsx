"use client";

import React, { useState } from 'react';

const Contact = () => {
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
    // For now, we'll just log the data. 
    // Later we can connect this to Supabase or an email service.
    console.log("Form Submitted:", formData);
    alert("Thank you! Your message has been sent.");
  };

  return (
    <>
      {/* 🏙️ PAGE BANNER */}
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">Contact Us</h1>
        </div>
      </section>

      {/* 📞 CONTACT SECTION */}
      <section className="merican-contact-section">
        <div className="merican-contact-container">
          <h2 className="merican-contact-title">Get In Touch</h2>
          <p className="merican-contact-subtitle">
            We’d love to hear from you! Reach out using the details below or send us a message.
          </p>

          <div className="merican-contact-grid">
            {/* Left: Contact Info */}
            <div className="merican-contact-info">
              <div className="contact-card">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h4>Our Location</h4>
                  <p>Industrial Area, Nanyuki Road next to National Oil Depot, Nairobi, Kenya</p>
                </div>
              </div>

              <div className="contact-card">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h4>Call Us</h4>
                  <p><a href="tel:+254740174448">+254 740 174 448</a></p>
                </div>
              </div>

              <div className="contact-card">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:sales@mericanltd.com">sales@mericanltd.com</a></p>
                </div>
              </div>

              <div className="contact-card">
                <i className="fa-solid fa-clock"></i>
                <div>
                  <h4>Working Hours</h4>
                  <p>Mon–Fri: 8:00am – 5:00pm<br />Sat: 8:00am – 1:00pm</p>
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
                    placeholder="Full Name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone Number" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder="Subject (Optional)"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message" 
                    rows={5} 
                    placeholder="Your Message" 
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="contact-btn">Send Message</button>
              </form>
            </div>
          </div>

          {/* 📍 Google Map Embed */}
          <div className="map-container" style={{ marginTop: '3rem' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.79061852445!2d36.8582227!3d-1.3004863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111663162357%3A0x666b6134b171630!2sNanyuki%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1710000000000!5m2!1sen!2ske" 
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