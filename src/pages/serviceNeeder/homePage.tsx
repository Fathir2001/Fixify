import React from "react";
import {
  FaTools,
  FaCheckCircle,
  FaClock,
  FaPhoneAlt,
  FaBolt,
  FaWrench,
  FaHammer,
  FaCar,
  FaBroom,
  FaPaintRoller,
  FaTree,
  FaHome,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./homePage.css";

const ServiceNeederHomePage: React.FC = () => {
  const services = [
    {
      id: 1,
      title: "Electrician Services",
      description: "Professional electrical installation and repair services",
      icon: FaBolt,
    },
    {
      id: 2,
      title: "Plumbing Services",
      description: "Expert plumbing solutions for your home",
      icon: FaWrench,
    },
    {
      id: 3,
      title: "Carpentry Services",
      description: "Custom woodwork and furniture repairs",
      icon: FaHammer,
    },
    {
      id: 4,
      title: "Vehicle Breakdown",
      description: "24/7 roadside assistance services",
      icon: FaCar,
    },
    {
      id: 5,
      title: "Appliance Repair",
      description: "Fixing all types of home appliances",
      icon: FaTools,
    },
    {
      id: 6,
      title: "House Cleaning",
      description: "Professional cleaning services",
      icon: FaBroom,
    },
    {
      id: 7,
      title: "Painting Services",
      description: "Interior and exterior painting solutions",
      icon: FaPaintRoller,
    },
    {
      id: 8,
      title: "Gardening & Landscaping",
      description: "Transform your outdoor spaces",
      icon: FaTree,
    },
    {
      id: 9,
      title: "Roof Repair",
      description: "Waterproofing and roof maintenance",
      icon: FaHome,
    },
  ];

  const steps = [
    {
      title: "Book Service",
      description: "Choose the service you need and book online",
      icon: <FaTools />,
    },
    {
      title: "Get Matched",
      description: "We'll connect you with an expert technician",
      icon: <FaCheckCircle />,
    },
    {
      title: "Quick Service",
      description: "Get your repair done efficiently",
      icon: <FaClock />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
              <span className="service-icon">
                <service.icon />
              </span>
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
            <div className="contact-item">
              <FaEnvelope />
              <span>support@fixify.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Repair Street, Fix City</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input type="text" id="name" placeholder="Your Name" required />
            </div>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="input-wrapper">
              <input type="tel" id="phone" placeholder="Your Phone" required />
            </div>
            <div className="input-wrapper">
              <select id="service" required>
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-wrapper">
              <textarea
                id="message"
                placeholder="Your Message"
                rows={4}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ServiceNeederHomePage;
