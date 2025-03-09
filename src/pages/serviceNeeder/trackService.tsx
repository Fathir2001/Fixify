import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./trackService.css";
import Modal from "react-modal";
Modal.setAppElement("#root");
import {
  FaBell,
  FaCalendarCheck,
  FaTools,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaArrowLeft,
  FaCheckCircle,
  FaHourglass,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";

// Updated interface to match the backend structure
interface ServiceRequest {
  _id: string;
  serviceNeeder: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  serviceProvider: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  serviceDetails: {
    serviceType: string;
    location: string;
    address: string;
    date: string;
    timeFrom: string;
    timeTo: string;
    totalHours: number;
    feePerHour: number;
    totalFee: number;
  };
  status: string;
  createdAt: string;
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

const TrackService: React.FC = () => {
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [snNotifications, setSNNotifications] = useState<SNNotification[]>([]);
  const [showNotificationsList, setShowNotificationsList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchServiceRequests();
    fetchSNNotifications();

    // Set up interval for periodic fetching of notifications
    const interval = setInterval(fetchSNNotifications, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/service-needer/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/service-requests/my-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch your service requests");
      }

      const data = await response.json();
      console.log("Service requests retrieved:", data);
      setServiceRequests(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const fetchSNNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/service-requests/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSNNotifications(data);
        setUnreadCount(data.filter((n: SNNotification) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        "http://localhost:5000/api/service-requests/notifications/mark-read",
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

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "accepted":
        return "status-accepted";
      case "ongoing":
        return "status-ongoing";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaHourglass className="status-icon pending" />;
      case "accepted":
        return <FaCheckCircle className="status-icon accepted" />;
      case "ongoing":
        return <FaSpinner className="status-icon ongoing" />;
      case "completed":
        return <FaCheckCircle className="status-icon completed" />;
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />;
      case "rejected":
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredRequests = serviceRequests.filter((req) => {
    if (activeTab === "all") return true;
    if (activeTab === "active")
      return ["pending", "ongoing"].includes(req.status);
    if (activeTab === "accepted") return req.status === "accepted";
    if (activeTab === "completed") return req.status === "completed";
    if (activeTab === "cancelled")
      return ["cancelled", "rejected"].includes(req.status);
    return true;
  });

  return (
    <div className="track-service-container">
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
            className="back-to-book-btn"
            onClick={() => navigate("/book-service")}
          >
            <FaArrowLeft /> Book Service
          </button>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </nav>

      <div className="track-service-content">
        <h1>Track Your Service Requests</h1>

        <div className="service-tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All Requests
          </button>
          <button
            className={activeTab === "active" ? "active" : ""}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={activeTab === "accepted" ? "active" : ""}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted
          </button>
          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={activeTab === "cancelled" ? "active" : ""}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" />
            <p>Loading your service requests...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No service requests found in this category.</p>
            <button
              className="book-new-service"
              onClick={() => navigate("/book-service")}
            >
              Book a New Service
            </button>
          </div>
        ) : (
          <div className="service-requests-list">
            {filteredRequests.map((request) => (
              <div key={request._id} className="service-request-card">
                <div className="service-header">
                  <h3>{request.serviceDetails.serviceType}</h3>
                  <div
                    className={`service-status ${getStatusClass(
                      request.status
                    )}`}
                  >
                    {getStatusIcon(request.status)} {request.status}
                  </div>
                </div>
                <div className="service-details">
                  <div className="detail-item">
                    <FaCalendarCheck className="detail-icon" />
                    <span>
                      <strong>Date:</strong> {formatDate(request.serviceDetails.date)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span>
                      <strong>Time:</strong> {request.serviceDetails.timeFrom} -{" "}
                      {request.serviceDetails.timeTo}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>
                      <strong>Location:</strong> {request.serviceDetails.location}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaTools className="detail-icon" />
                    <span>
                      <strong>Total Fee:</strong> LKR{" "}
                      {request.serviceDetails.totalFee.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => handleViewDetails(request)}
                >
                  View Full Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <Modal
          isOpen={showDetailsModal}
          onRequestClose={() => setShowDetailsModal(false)}
          className="modal-content details-modal"
          overlayClassName="modal-overlay"
        >
          <h2>{selectedRequest.serviceDetails.serviceType} Details</h2>
          <div className="request-full-details">
            <div className="detail-section">
              <h3>Service Information</h3>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span
                  className={`status-badge ${getStatusClass(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span>{formatDate(selectedRequest.serviceDetails.date)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span>
                  {selectedRequest.serviceDetails.timeFrom} - {selectedRequest.serviceDetails.timeTo}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span>{selectedRequest.serviceDetails.totalHours} hours</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Fee:</span>
                <span>LKR {selectedRequest.serviceDetails.totalFee.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Requested on:</span>
                <span>{formatDate(selectedRequest.createdAt)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Location Details</h3>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span>{selectedRequest.serviceDetails.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span>{selectedRequest.serviceDetails.address}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Service Provider</h3>
              <div className="detail-row">
                <span className="detail-label">
                  <FaUser className="provider-icon" /> Name:
                </span>
                <span>{selectedRequest.serviceProvider.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <FaPhone className="provider-icon" /> Contact:
                </span>
                <span>{selectedRequest.serviceProvider.phoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="modal-close-button"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Logout Modal */}
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

export default TrackService;