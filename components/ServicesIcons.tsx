import React from 'react';

const servicesData = [
  { icon: "📐", title: "CAD Layout", desc: "Professional kitchen layout and design using advanced CAD software for optimal space utilization." },
  { icon: "⚒️", title: "Custom Fabrication", desc: "Specialized stainless steel fabrication tailored to your unique kitchen requirements." },
  { icon: "🔧", title: "Installation", desc: "Expert installation of commercial kitchen equipment with precision and care." },
  { icon: "🔬", title: "Testing", desc: "Comprehensive testing of all installed equipment to ensure optimal performance." },
  { icon: "👥", title: "Training", desc: "Detailed training sessions for staff on equipment operation and maintenance." },
  { icon: "🤝", title: "Handover", desc: "Complete project handover with documentation and support." },
];

const ServicesIcons = () => {
  return (
    <section className="merican-services-section">
      <div className="merican-services-container">
        <h2 className="merican-services-title">Our Services</h2>
        <p className="merican-services-subtitle">Comprehensive commercial kitchen solutions from design to completion</p>
        <div className="merican-services-grid">
          {servicesData.map((item, index) => (
            <div key={index} className="merican-service-item">
              <div className="merican-service-icon">{item.icon}</div>
              <div className="merican-service-content">
                <h3 className="merican-service-title">{item.title}</h3>
                <p className="merican-service-description">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesIcons;