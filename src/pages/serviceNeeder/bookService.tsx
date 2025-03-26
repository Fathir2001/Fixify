import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bookService.css";
import Modal from "react-modal";
Modal.setAppElement("#root");
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

interface SNNotification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
  serviceRequestId: string;
  serviceProvider: {
    name: string;
    phoneNumber: string;
  };
  status: string;
}

const BookService: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [matchedProviders, setMatchedProviders] = useState<ServiceProvider[]>(
    []
  );
  const [snNotifications, setSNNotifications] = useState<SNNotification[]>([]);
  const [showNotificationsList, setShowNotificationsList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bookingData, setBookingData] = useState({
    serviceType: "",
    location: "",
    address: "",
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
  const [showModal, setShowModal] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<{
    success: boolean;
    message: string;
  }>({
    success: false,
    message: "",
  });
  const [countdown, setCountdown] = useState(8);

  const fetchSNNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Fetching notifications..."); // Debug log

      const response = await fetch(
        "http://localhost:5000/api/service-requests/sn-notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Received notifications:", data); // Debug log
        setSNNotifications(data);
        setUnreadCount(data.filter((n: SNNotification) => !n.read).length);
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // function to mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        "http://localhost:5000/api/service-requests/sn-notifications/mark-read",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUnreadCount(0);
      setSNNotifications(snNotifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // useEffect to fetch notifications
  useEffect(() => {
    // Initial fetch
    fetchSNNotifications();

    // Set up interval for periodic fetching
    const interval = setInterval(fetchSNNotifications, 30000); // every 30 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // Add click outside handler to close notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-wrapper") && showNotificationsList) {
        setShowNotificationsList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotificationsList]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/service-needer/login");
  };

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    setBookingData((prev) => ({ ...prev, serviceType: serviceName }));
    setStep(2);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleBookingConfirm = async (
    providerId: string,
    providerFee: number
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Calculate total hours
      const timeFrom = new Date(`2000/01/01 ${bookingData.timeFrom}`);
      const timeTo = new Date(`2000/01/01 ${bookingData.timeTo}`);
      const totalHours =
        (timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60);
      const totalFee = totalHours * providerFee;

      const response = await fetch(
        "http://localhost:5000/api/service-requests/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...bookingData,
            providerId,
            totalHours,
            totalFee,
          }),
        }
      );

      const data = await response.json();
      setBookingResponse({
        success: response.ok,
        message:
          data.message ||
          "Your service request has been sent successfully. Please wait for the provider to accept your request.",
      });
      setShowModal(true);

      // Start countdown timer and reload page after modal closes
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowModal(false);
            window.location.reload(); // Reload the page
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setBookingResponse({
        success: false,
        message: "Failed to create service request. Please try again.",
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
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

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <nav className="navbar-2">
        <div className="nav-left">
          <div className="notification-wrapper">
            <FaBell
              className="notification-icon"
              onClick={() => {
                setShowNotificationsList(!showNotificationsList);
                if (!showNotificationsList && unreadCount > 0) {
                  markNotificationsAsRead();
                }
              }}
            />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
            {showNotificationsList && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notifications-list">
                  {snNotifications && snNotifications.length > 0 ? (
                    snNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${
                          !notification.read ? "unread" : ""
                        }`}
                      >
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <p className="notification-time">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        {notification.status === "accepted" && (
                          <div className="provider-contact">
                            <p>Contact Provider:</p>
                            <p>{notification.serviceProvider.name}</p>
                            <p>{notification.serviceProvider.phoneNumber}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="nav-center">
          <h1>Fixify</h1>
        </div>
        <div className="nav-right">
          <button
            className="track-service-btn"
            onClick={() => navigate("/service-needer/track-service")}
          >
            Track Service
          </button>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
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
                  className="SN-service-card"
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
              <FaMapMarkerAlt />
              <input
                type="text"
                name="address"
                placeholder="Detailed Address"
                value={bookingData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group-3">
              <FaCalendar
                onClick={() => {
                  // Find the date input and programmatically click it
                  const dateInput =
                    document.querySelector('input[name="date"]');
                  if (dateInput) {
                    (dateInput as HTMLElement).click();
                  }
                }}
              />
              <input
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleInputChange}
                min={getTodayString()}
                required
                // Make the input field look more clickable with a cursor style
                style={{ cursor: "pointer" }}
                // Show the calendar popup when the input field itself is clicked
                onClick={(e) => {
                  // This ensures the browser's native date picker opens
                  e.currentTarget.showPicker();
                }}
              />
            </div>
            <div className="time-range-group">
              <div className="form-group-3">
                <FaClock />
                <select
                  name="timeFrom"
                  value={bookingData.timeFrom}
                  onChange={handleInputChange}
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
                  <strong>Address:</strong> {bookingData.address}
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
                      onClick={() =>
                        handleBookingConfirm(provider._id, provider.serviceFee)
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Book Now"}
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
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>
            {bookingResponse.success
              ? "Request Sent Successfully! If the Service Provider accepts, you will be notified."
              : "Request Failed"}
          </h2>
          <div
            className={
              bookingResponse.success ? "success-message" : "error-message"
            }
          >
            <p>{bookingResponse.message}</p>
            {bookingResponse.success && (
              <div className="countdown-timer">
                Closing in {countdown} seconds
              </div>
            )}
          </div>
        </Modal>
      )}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to log out from your account?</p>
          <div className="modal-buttons">
            <button className="confirm-button" onClick={handleLogoutConfirm}>
              Yes, Logout
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookService;
