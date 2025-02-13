import React, { useState } from "react";
import {
  FaTools,
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import "./register.css";

const ServiceProviderRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    serviceType: "",
    phoneNumber: "",
    serviceArea: "",
    experience: "",
    availableDays: [] as string[],
    timeFrom: "",
    timeTo: "",
  });

  const serviceTypes = [
    "Electrician Services",
    "Plumbing Services",
    "Carpentry Services",
    "Vehicle Breakdown Assistance",
    "Home Appliance Repair",
    "House Cleaning Services",
    "Painting Services",
    "Gardening & Landscaping",
    "Roof Repair & Waterproofing",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      const day = name.replace("day-", "");
      setFormData((prev) => ({
        ...prev,
        availableDays: target.checked
          ? [...prev.availableDays, day]
          : prev.availableDays.filter((d) => d !== day),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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

          <div className="form-group days-selection">
            <label className="days-label">Available Days</label>
            <div className="days-grid">
              {daysOfWeek.map((day, index) => (
                <label key={index} className="day-checkbox">
                  <input
                    type="checkbox"
                    name={`day-${day}`}
                    checked={formData.availableDays.includes(day)}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group time-range">
            <FaClock className="input-icon" />
            <div className="time-inputs">
              <input
                type="time"
                name="timeFrom"
                value={formData.timeFrom}
                onChange={handleChange}
                required
              />
              <span className="time-separator">to</span>
              <input
                type="time"
                name="timeTo"
                value={formData.timeTo}
                onChange={handleChange}
                required
              />
            </div>
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
