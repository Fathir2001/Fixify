import React, { useState } from "react";
import "./bookService.css";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaBolt,
  FaWrench,
  FaHammer,
  FaCar,
  FaTools,
  FaBroom,
  FaPaintRoller,
  FaTree,
  FaHome,
} from "react-icons/fa";

const BookService: React.FC = () => {
  const [step, setStep] = useState(1);

  const services = [
    {
      id: 1,
      name: "Electrician Services",
      price: "From $50",
      icon: FaBolt,
    },
    {
      id: 2,
      name: "Plumbing Services",
      price: "From $60",
      icon: FaWrench,
    },
    {
      id: 3,
      name: "Carpentry Services",
      price: "From $70",
      icon: FaHammer,
    },
    {
      id: 4,
      name: "Vehicle Breakdown Assistance",
      price: "From $80",
      icon: FaCar,
    },
    {
      id: 5,
      name: "Home Appliance Repair",
      price: "From $55",
      icon: FaTools,
    },
    {
      id: 6,
      name: "House Cleaning Services",
      price: "From $45",
      icon: FaBroom,
    },
    {
      id: 7,
      name: "Painting Services",
      price: "From $65",
      icon: FaPaintRoller,
    },
    {
      id: 8,
      name: "Gardening & Landscaping",
      price: "From $75",
      icon: FaTree,
    },
    {
      id: 9,
      name: "Roof Repair & Waterproofing",
      price: "From $85",
      icon: FaHome,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <div className="book-service">
      <h1>Book a Service</h1>
      <h2>Steps</h2>

      <div className="booking-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          1. Select Service
        </div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          2. Schedule
        </div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          3. Confirm
        </div>
      </div>

      {step === 1 && (
        <div className="service-selection">
          <h2>Select a Service</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => setStep(2)}
              >
                <span className="service-icon">
                  <service.icon />
                </span>
                <h3>{service.name}</h3>
                <p>{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>Schedule Your Service</h2>
          <div className="form-group-3">
            <FaMapMarkerAlt />
            <input type="text" placeholder="Service Location" required />
          </div>
          <div className="form-group-3">
            <FaCalendar />
            <input type="date" required />
          </div>
          <div className="form-group-3">
            <FaClock />
            <select required>
              <option value="">Select Time</option>
              <option value="morning">Morning (8 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
              <option value="evening">Evening (4 PM - 8 PM)</option>
            </select>
          </div>
          <button type="submit" className="next-button">
            Next
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="booking-confirmation">
          <h2>Confirm Your Booking</h2>
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            {/* Add booking summary details */}
          </div>
          <button className="confirm-button">Confirm Booking</button>
        </div>
      )}
    </div>
  );
};

export default BookService;
