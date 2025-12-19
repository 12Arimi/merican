"use client";

import React from 'react';

const About = () => {
  return (
    <section className="merican-about-section">
      <div className="merican-about-container">
        <h2 className="merican-about-title">About Merican Limited</h2>
        <p className="merican-about-subtitle">Crafting excellence in commercial kitchen equipment since 2014</p>

        <p className="merican-about-description">
          At Merican Limited, we specialize in providing comprehensive solutions for commercial kitchens. 
          Our commitment to quality and innovation has made us a trusted partner for businesses across the industry.
        </p>

        <div className="merican-about-grid">
          {/* Mission Card */}
          <div className="merican-about-card">
            <h3 className="merican-about-card-title">Our Mission</h3>
            <p>
              To deliver exceptional commercial kitchen equipment and services that empower businesses 
              to achieve operational excellence and culinary success.
            </p>
          </div>

          {/* Values Card */}
          <div className="merican-about-card">
            <h3 className="merican-about-card-title">Our Values</h3>
            <ul className="merican-about-list">
              <li>Quality Excellence</li>
              <li>Customer Focus</li>
              <li>Innovation</li>
              <li>Reliability</li>
              <li>Professional Service</li>
            </ul>
          </div>

          {/* Expertise Card */}
          <div className="merican-about-card">
            <h3 className="merican-about-card-title">Our Expertise</h3>
            <ul className="merican-about-list">
              <li>Commercial Kitchen Equipment</li>
              <li>Kitchen Design and Planning</li>
              <li>Equipment Installation</li>
              <li>Maintenance Services</li>
              <li>Custom Solutions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;