import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import { FaBolt, FaWrench, FaHammer, FaCar, FaTools, 
//          FaBroom, FaPaintRoller, FaTree, FaHome } from 'react-icons/fa';
import './FirstPage.css';

// const services = [
//     {
//       id: 1,
//       title: 'Electrician Services',
//       description: 'Professional electrical installation and repair services',
//       icon: FaBolt
//     },
//     {
//       id: 2,
//       title: 'Plumbing Services',
//       description: 'Expert plumbing solutions for your home',
//       icon: FaWrench
//     },
//     {
//       id: 3,
//       title: 'Carpentry Services',
//       description: 'Custom woodwork and furniture repairs',
//       icon: FaHammer
//     },
//     {
//       id: 4,
//       title: 'Vehicle Breakdown',
//       description: '24/7 roadside assistance services',
//       icon: FaCar
//     },
//     {
//       id: 5,
//       title: 'Appliance Repair',
//       description: 'Fixing all types of home appliances',
//       icon: FaTools
//     },
//     {
//       id: 6,
//       title: 'House Cleaning',
//       description: 'Professional cleaning services',
//       icon: FaBroom
//     },
//     {
//       id: 7,
//       title: 'Painting Services',
//       description: 'Interior and exterior painting solutions',
//       icon: FaPaintRoller
//     },
//     {
//       id: 8,
//       title: 'Gardening & Landscaping',
//       description: 'Transform your outdoor spaces',
//       icon: FaTree
//     },
//     {
//       id: 9,
//       title: 'Roof Repair',
//       description: 'Waterproofing and roof maintenance',
//       icon: FaHome
//     }
// ];


const FirstPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleEstimateClick = () => {
    navigate('/user-type');
  };

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
            onClick={handleEstimateClick}
          >
            Get Started
          </motion.button>
        </motion.div>
      </section>

      {/* <section className="services-section">
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
                <service.icon />
              </motion.div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default FirstPage;