import React, { useState } from 'react';
import { FaTools, FaEnvelope, FaLock, FaUserCircle, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './register.css';

const ServiceProviderRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    serviceType: '',
    phoneNumber: '',
    serviceArea: '',
    experience: ''
  });

  const serviceTypes = [
    'Electrician Services',
    'Plumbing Services',
    'Carpentry Services',
    'Vehicle Breakdown Assistance',
    'Home Appliance Repair',
    'House Cleaning Services',
    'Painting Services',
    'Gardening & Landscaping',
    'Roof Repair & Waterproofing'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your registration logic here
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <FaTools className="register-icon" />
          <h2>Service Provider Registration</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <FaUserCircle className="input-icon" />
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required 
            />
          </div>

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required 
            />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required 
            />
          </div>

          <div className="form-group">
            <FaTools className="input-icon" />
            <select 
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select Service Type</option>
              {serviceTypes.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <FaPhone className="input-icon" />
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required 
            />
          </div>

          <div className="form-group">
            <FaMapMarkerAlt className="input-icon" />
            <input 
              type="text" 
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              placeholder="Service Area"
              required 
            />
          </div>

          <div className="form-group">
            <textarea 
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Brief description of your experience"
              rows={4}
              required
            />
          </div>

          <button type="submit" className="register-button">
            Register as Service Provider
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderRegister;