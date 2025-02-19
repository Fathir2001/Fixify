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
  FaBell,
  FaUser,
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
    <div>
      <nav className="navbar-2">
        <div className="nav-left">
          <FaBell className="notification-icon" />
          <span className="notification-badge">2</span>
        </div>
        <div className="nav-center">
          <h1>Fixify</h1>
        </div>
        <div className="nav-right">
          <FaUser className="user-icon" />
        </div>
      </nav>

      <div className="book-service">
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
              <input
                type="time"
                required
                min="08:00"
                max="20:00"
                step="1800" // 30-minute intervals
              />
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
    </div>
  );
};

export default BookService;
