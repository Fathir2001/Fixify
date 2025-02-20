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

interface ServiceProvider {
  _id: string;
  fullName: string;
  experience: string;
  serviceFee: number;
  rating?: number;
  phoneNumber: string;
  email: string;
}

const BookService: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [matchedProviders, setMatchedProviders] = useState<ServiceProvider[]>(
    []
  );
  const [bookingData, setBookingData] = useState({
    serviceType: "",
    location: "",
    date: "",
    timeFrom: "",
    timeTo: "",
  });

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

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    setBookingData((prev) => ({ ...prev, serviceType: serviceName }));
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to continue");
        return;
      }

      console.log("Sending booking data:", bookingData); // Debug log

      const response = await fetch(
        "http://localhost:5000/api/service-needers/find-providers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();
      console.log("Received response:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Failed to find service providers");
      }

      if (!data.providers || !Array.isArray(data.providers)) {
        throw new Error("Invalid response format from server");
      }

      setMatchedProviders(data.providers);
      setStep(3);
    } catch (error) {
      console.error("Error finding providers:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to find service providers"
      );
    }
  };

  const handleBookingConfirm = async (providerId: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/service-needers/book-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...bookingData,
            providerId,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Handle successful booking (e.g., redirect to booking confirmation page)
      console.log("Booking confirmed:", data);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      // Add hour:00
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      // Add hour:30 if not 20:00
      if (hour !== 20) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
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
                  onClick={() => handleServiceSelect(service.name)}
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
            {error && <div className="error-message">{error}</div>}
            <div className="form-group-3">
              <FaMapMarkerAlt />
              <input
                type="text"
                name="location"
                placeholder="Service Location"
                value={bookingData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group-3">
              <FaCalendar />
              <input
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="time-range-group">
              <div className="form-group-3">
                <FaClock />
                <select
                  name="timeFrom"
                  value={bookingData.timeFrom}
                  onChange={(e) =>
                    handleInputChange(
                      e as unknown as React.ChangeEvent<HTMLInputElement>
                    )
                  }
                  required
                >
                  <option value="">Select start time</option>
                  {generateTimeSlots().map((time) => (
                    <option key={`from-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-3">
                <FaClock />
                <select
                  name="timeTo"
                  value={bookingData.timeTo}
                  onChange={(e) =>
                    handleInputChange(
                      e as unknown as React.ChangeEvent<HTMLInputElement>
                    )
                  }
                  required
                >
                  <option value="">Select end time</option>
                  {generateTimeSlots()
                    .filter((time) => time > bookingData.timeFrom)
                    .map((time) => (
                      <option key={`to-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <button type="submit" className="next-button">
              Find Service Providers
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="booking-confirmation">
            <h2>Available Service Providers</h2>
            <div className="booking-summary">
              <h3>Booking Details</h3>
              <div className="summary-details">
                <p>
                  <strong>Service:</strong> {selectedService}
                </p>
                <p>
                  <strong>Location:</strong> {bookingData.location}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(bookingData.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {bookingData.timeFrom} -{" "}
                  {bookingData.timeTo}
                </p>
              </div>
            </div>

            <div className="providers-list">
              {matchedProviders.length > 0 ? (
                matchedProviders.map((provider) => (
                  <div key={provider._id} className="provider-card">
                    <h3>{provider.fullName}</h3>
                    <div className="provider-details">
                      <p>
                        <strong>Experience:</strong> {provider.experience}
                      </p>
                      <p>
                        <strong>Service Fee / Hour :</strong> LKR{" "}
                        {provider.serviceFee}
                      </p>
                    </div>
                    <button
                      className="select-provider-button"
                      onClick={() => handleBookingConfirm(provider._id)}
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-providers">
                  <p>
                    No service providers available for the selected criteria.
                  </p>
                  <button className="back-button" onClick={() => setStep(2)}>
                    Modify Search
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookService;
