import React from 'react';
import { FaTools, FaCheckCircle, FaClock, FaPhoneAlt, FaQuestionCircle } from 'react-icons/fa';
import './homePage.css';

const ServiceNeederHomePage: React.FC = () => {
  const services = [
    {
      title: "Electrical Services",
      description: "Expert electrical repairs and installations",
      icon: "🔌"
    },
    {
      title: "Plumbing Services",
      description: "Professional plumbing solutions",
      icon: "🚰"
    },
    // Add more services...
  ];

  const steps = [
    {
      title: "Book Service",
      description: "Choose the service you need and book online",
      icon: <FaTools />
    },
    {
      title: "Get Matched",
      description: "We'll connect you with an expert technician",
      icon: <FaCheckCircle />
    },
    {
      title: "Quick Service",
      description: "Get your repair done efficiently",
      icon: <FaClock />
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Expert Repairs at Your Fingertips</h1>
          <p>Find trusted professionals for all your repair needs</p>
          <button className="cta-button">Book a Service</button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <h2>Why Choose Fixify</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Expert Technicians</h3>
            <p>Qualified and experienced professionals</p>
          </div>
          {/* Add more benefits */}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <FaPhoneAlt />
              <span>1-800-FIXIFY</span>
            </div>
            {/* Add more contact details */}
          </div>
          <form className="contact-form">
            {/* Add form fields */}
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <FaQuestionCircle />
            <h3>How quickly can I get service?</h3>
            <p>Most services can be scheduled within 24 hours.</p>
          </div>
          {/* Add more FAQs */}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Ready to Get Started?</h2>
        <button className="cta-button">Schedule a Repair</button>
      </section>
    </div>
  );
};

export default ServiceNeederHomePage;