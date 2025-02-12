import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './FirstPage.css';

const services = [
    {
      id: 1,
      title: 'Emergency Repairs',
      description: '24/7 available for urgent home repairs',
      icon: '🔧'
    },
    {
      id: 2,
      title: 'Home Renovation',
      description: 'Complete home makeover services',
      icon: '🏠'
    },
    {
      id: 3,
      title: 'Plumbing Services',
      description: 'Expert plumbing solutions',
      icon: '🚰'
    },
    {
      id: 4,
      title: 'Electrical Work',
      description: 'Professional electrical repairs and installations',
      icon: '⚡'
    }
  ];

const FirstPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="hero-title"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Professional Home Repair Services
          </motion.h1>
          <p className="hero-subtitle">Transform your home with our expert repair and renovation services</p>
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Free Estimate
          </motion.button>
        </motion.div>
      </section>

      <section className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="service-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <motion.div 
                className="service-icon"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {service.icon}
              </motion.div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FirstPage;