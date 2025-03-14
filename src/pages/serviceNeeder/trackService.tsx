import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./trackService.css";
import Modal from "react-modal";
Modal.setAppElement("#root");
import {
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
  isRejected?: boolean; // Flag to identify rejected services from ServiceRejected collection
}

const TrackService: React.FC = () => {
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [rejectedServices, setRejectedServices] = useState<ServiceRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotificationsList, setShowNotificationsList] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [startButtonMessage, setStartButtonMessage] = useState<{
    id: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchAllServiceData();
  }, []);

  const fetchAllServiceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/service-needer/login");
        return;
      }

      // Fetch regular service requests
      const requestsResponse = await fetch(
        "http://localhost:5000/api/service-requests/my-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch rejected services
      const rejectedResponse = await fetch(
        "http://localhost:5000/api/service-requests/my-rejected-services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!requestsResponse.ok) {
        throw new Error("Failed to fetch your service requests");
      }

      const requestsData = await requestsResponse.json();

      let rejectedData: ServiceRequest[] = [];
      if (rejectedResponse.ok) {
        rejectedData = await rejectedResponse.json();
        // Add a flag to identify rejected services
        rejectedData = rejectedData.map((service) => ({
          ...service,
          isRejected: true,
          status: "rejected", // Make sure status is "rejected" for display purposes
        }));
      }

      console.log("Service requests retrieved:", requestsData);
      console.log("Rejected services retrieved:", rejectedData);

      setServiceRequests(requestsData);
      setRejectedServices(rejectedData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
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

  useEffect(() => {
    if (!startButtonMessage) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Close if clicking outside of tooltip and button
      if (
        !target.closest(".start-button-message-tooltip") &&
        !target.closest(".header-start-btn")
      ) {
        setStartButtonMessage(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [startButtonMessage]);

  useEffect(() => {
    if (startButtonMessage) {
      document.documentElement.style.setProperty(
        "--show-hover-tooltip",
        "none"
      );
    } else {
      document.documentElement.style.setProperty(
        "--show-hover-tooltip",
        "block"
      );
    }
  }, [startButtonMessage]);

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
      case "expired":
        return "status-expired";
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
      case "expired":
        return <FaTimesCircle className="status-icon expired" />;
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

  const isServiceExpired = (request: ServiceRequest): boolean => {
    // Skip already completed, cancelled or rejected services
    if (["completed", "cancelled", "rejected"].includes(request.status)) {
      return false;
    }

    const currentDate = new Date();
    const serviceDate = new Date(request.serviceDetails.date);

    // Parse end time (handle formats like "5:00 PM")
    const timeParts = request.serviceDetails.timeTo.split(" ");
    const timeString = timeParts[0];
    const period = timeParts[1] || "";

    let [hours, minutes] = timeString.split(":").map(Number);

    // Convert to 24-hour format if PM
    if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Set the end time on the service date
    serviceDate.setHours(hours, minutes, 0, 0);

    // Check if the service end time has passed
    return serviceDate < currentDate;
  };

  const canStartService = (
    request: ServiceRequest
  ): { canStart: boolean; message?: string } => {
    // Only check for accepted services
    if (request.status !== "accepted") {
      return { canStart: false };
    }

    const currentDate = new Date();
    const serviceDate = new Date(request.serviceDetails.date);

    // Parse start time
    const timeParts = request.serviceDetails.timeFrom.split(" ");
    const timeString = timeParts[0];
    const period = timeParts[1] || "";

    let [hours, minutes] = timeString.split(":").map(Number);

    // Convert to 24-hour format if PM
    if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Set the start time on the service date
    serviceDate.setHours(hours, minutes, 0, 0);

    // Calculate time difference in milliseconds
    const timeDiff = serviceDate.getTime() - currentDate.getTime();

    // Convert to minutes
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Service can ONLY be started within 30 minutes before the scheduled time
    if (minutesDiff <= 30 && minutesDiff > 0) {
      // Within the 30-minute window before start time
      return { canStart: true };
    } else if (minutesDiff > 30) {
      // More than 30 minutes before start time
      // Calculate the time when service can be started
      const startTime = new Date(serviceDate);
      startTime.setMinutes(startTime.getMinutes() - 30);

      return {
        canStart: false,
        message: `You can start this service after ${startTime.toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        )}`,
      };
    } else {
      // After the start time
      return { canStart: false };
    }
  };

  // Add this function to handle starting a service
  const handleStartService = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/service-requests/${requestId}/start`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update the service status in UI
        setServiceRequests(
          serviceRequests.map((req) =>
            req._id === requestId ? { ...req, status: "ongoing" } : req
          )
        );
        // If details modal is open and showing this service, update it
        if (selectedRequest && selectedRequest._id === requestId) {
          setSelectedRequest({ ...selectedRequest, status: "ongoing" });
        }
      } else {
        const error = await response.json();
        setError(error.message || "Failed to start service");
      }
    } catch (error) {
      console.error("Error starting service:", error);
      setError("An error occurred when trying to start the service");
    }
  };

  // Combine both regular requests and rejected services
  const allServices = [...serviceRequests, ...rejectedServices];

  const filteredRequests = allServices.filter((req) => {
    const expired = isServiceExpired(req);

    if (activeTab === "all") return true;
    if (activeTab === "active")
      return ["pending", "ongoing"].includes(req.status) && !expired;
    if (activeTab === "accepted") return req.status === "accepted" && !expired;
    if (activeTab === "completed") return req.status === "completed";
    if (activeTab === "cancelled")
      return (
        req.status === "cancelled" ||
        req.status === "rejected" ||
        req.isRejected === true ||
        expired
      );
    return true;
  });

  return (
    <div className="track-service-container">
      <nav className="navbar-2">
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
                  {(() => {
                    const expired = isServiceExpired(request);
                    const displayStatus = expired ? "expired" : request.status;
                    const startServiceInfo = canStartService(request);

                    return (
                      <div className="status-wrapper">
                        <div
                          className={`service-status ${getStatusClass(
                            displayStatus
                          )}`}
                        >
                          {getStatusIcon(displayStatus)}{" "}
                          {expired ? "Expired" : request.status}
                        </div>

                        {request.status === "accepted" &&
                          !isServiceExpired(request) &&
                          (() => {
                            const startInfo = canStartService(request);
                            const currentDate = new Date();
                            const serviceDate = new Date(
                              request.serviceDetails.date
                            );
                            // Parse start time
                            const timeParts =
                              request.serviceDetails.timeFrom.split(" ");
                            const timeString = timeParts[0];
                            const period = timeParts[1] || "";

                            let [hours, minutes] = timeString
                              .split(":")
                              .map(Number);

                            // Convert to 24-hour format if PM
                            if (period.toUpperCase() === "PM" && hours < 12)
                              hours += 12;
                            if (period.toUpperCase() === "AM" && hours === 12)
                              hours = 0;

                            // Set the start time on the service date
                            serviceDate.setHours(hours, minutes, 0, 0);

                            // Calculate time difference in minutes
                            const timeDiff =
                              serviceDate.getTime() - currentDate.getTime();
                            const minutesDiff = Math.floor(
                              timeDiff / (1000 * 60)
                            );

                            // Only show button if we're within 30 minutes of start time or earlier
                            // (don't show button if service should have already started)
                            if (minutesDiff > 0) {
                              return (
                                <div className="start-button-container">
                                  <button
                                    className={`header-start-btn ${
                                      !startInfo.canStart ? "disabled" : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      if (startInfo.canStart) {
                                        handleStartService(request._id);
                                      } else if (startInfo.message) {
                                        // Always toggle tooltip on click, regardless of device type
                                        if (
                                          startButtonMessage &&
                                          startButtonMessage.id === request._id
                                        ) {
                                          setStartButtonMessage(null);
                                        } else {
                                          setStartButtonMessage({
                                            id: request._id,
                                            message: startInfo.message,
                                          });

                                          setTimeout(() => {
                                            setStartButtonMessage((prev) =>
                                              prev && prev.id === request._id
                                                ? null
                                                : prev
                                            );
                                          }, 5000);
                                        }
                                      }
                                    }}
                                    // Add data-tooltip attribute with the message for CSS hover tooltip
                                    data-tooltip={startInfo.message}
                                  >
                                    Start
                                  </button>

                                  {startButtonMessage &&
                                    startButtonMessage.id === request._id && (
                                      <div className="start-button-message-tooltip">
                                        {startButtonMessage.message}
                                      </div>
                                    )}
                                </div>
                              );
                            }

                            return null; // Don't show button if past start time
                          })()}
                      </div>
                    );
                  })()}
                </div>

                <div className="service-details">
                  <div className="detail-item">
                    <FaCalendarCheck className="detail-icon" />
                    <span>
                      <strong>Date:</strong>{" "}
                      {formatDate(request.serviceDetails.date)}
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
                      <strong>Location:</strong>{" "}
                      {request.serviceDetails.location}
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
                    isServiceExpired(selectedRequest)
                      ? "expired"
                      : selectedRequest.status
                  )}`}
                >
                  {selectedRequest.isRejected
                    ? "Rejected"
                    : isServiceExpired(selectedRequest)
                    ? "Expired"
                    : selectedRequest.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span>{formatDate(selectedRequest.serviceDetails.date)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span>
                  {selectedRequest.serviceDetails.timeFrom} -{" "}
                  {selectedRequest.serviceDetails.timeTo}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration:</span>
                <span>{selectedRequest.serviceDetails.totalHours} hours</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Fee:</span>
                <span>
                  LKR {selectedRequest.serviceDetails.totalFee.toFixed(2)}
                </span>
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
