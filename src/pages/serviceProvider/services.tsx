import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./services.css";

interface ServiceDetails {
  serviceType: string;
  location: string;
  address: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  totalHours: number;
  feePerHour: number;
  totalFee: number;
}

interface ServiceNeeder {
  id: string;
  name: string;
  phoneNumber: string;
}

interface AcceptedService {
  _id: string;
  serviceNeeder: ServiceNeeder;
  serviceDetails: ServiceDetails;
  status: string;
  acceptedAt: string;
}

const ServiceProviderServices: React.FC = () => {
  const navigate = useNavigate();
  const [acceptedServices, setAcceptedServices] = useState<AcceptedService[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/service-provider/login");
      return;
    }

    const fetchAcceptedServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/service-requests/provider-accepted-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch accepted services");
        }

        const data = await response.json();
        console.log("Fetched services:", data); // Add this for debugging
        setAcceptedServices(data);
      } catch (error) {
        console.error("Error fetching accepted services:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedServices();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleBackToHome = () => {
    navigate("/service-provider/dashboard"); // Update this to match your home route
  };

  // Check if current time is within 30 minutes of the service start time
  const isWithinStartTimeWindow = (date: string, timeFrom: string): boolean => {
    // Create date object for the service start time
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = timeFrom.split(":").map(Number);

    const serviceStartTime = new Date();
    serviceStartTime.setFullYear(year, month - 1, day);
    serviceStartTime.setHours(hours, minutes, 0, 0);

    // Get current time
    const currentTime = new Date();

    // Calculate time difference in minutes
    const timeDiff =
      (serviceStartTime.getTime() - currentTime.getTime()) / (1000 * 60);

    // Return true if time difference is between 0 and 30 minutes
    return timeDiff >= 0 && timeDiff <= 30;
  };

  const handleStartServiceClick = (service: AcceptedService) => {
    const { date, timeFrom } = service.serviceDetails;
    if (isWithinStartTimeWindow(date, timeFrom)) {
      // Handle starting the service (you can replace this with actual implementation)
      setNotification(`Service started: ${service.serviceDetails.serviceType}`);

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } else {
      // Get the 30-minute window start time
      const [year, month, day] = service.serviceDetails.date
        .split("-")
        .map(Number);
      const [hours, minutes] = service.serviceDetails.timeFrom
        .split(":")
        .map(Number);

      const serviceStartTime = new Date();
      serviceStartTime.setFullYear(year, month - 1, day);
      serviceStartTime.setHours(hours, minutes, 0, 0);

      const windowStartTime = new Date(
        serviceStartTime.getTime() - 30 * 60 * 1000
      );

      setNotification(
        `You can only start this service between ${windowStartTime.toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        )} and ${serviceStartTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="sp-loading-container">
        <div className="sp-loading-spinner"></div>
        <p>Loading your services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sp-error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="sp-retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="sp-services-container">
      {notification && <div className="sp-notification">{notification}</div>}

      <div className="sp-services-header">
        <h1>My Accepted Services</h1>
        <button onClick={handleBackToHome} className="sp-back-button">
          Back to Home
        </button>
      </div>

      {acceptedServices.length === 0 ? (
        <div className="sp-no-services">
          <p>You haven't accepted any services yet.</p>
        </div>
      ) : (
        <div className="sp-services-grid">
          {acceptedServices.map((service) => (
            <div key={service._id} className="sp-service-card">
              <div className="sp-service-header">
                <h3>{service.serviceDetails.serviceType}</h3>
                <div className="sp-service-header-actions">
                  <button
                    className={`sp-start-service-button ${
                      isWithinStartTimeWindow(
                        service.serviceDetails.date,
                        service.serviceDetails.timeFrom
                      )
                        ? "active"
                        : "disabled"
                    }`}
                    onClick={() => handleStartServiceClick(service)}
                  >
                    Start Service
                  </button>
                  <span
                    className={`sp-status-badge ${service.status.toLowerCase()}`}
                  >
                    {service.status}
                  </span>
                </div>
              </div>

              <div className="sp-service-info">
                <div className="sp-info-group">
                  <h4>Client Information</h4>
                  <p>
                    <strong>Name:</strong> {service.serviceNeeder.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {service.serviceNeeder.phoneNumber}
                  </p>
                </div>

                <div className="sp-info-group">
                  <h4>Service Details</h4>
                  <p>
                    <strong>Location:</strong> {service.serviceDetails.location}
                  </p>
                  <p>
                    <strong>Address:</strong> {service.serviceDetails.address}
                  </p>
                  <p>
                    <strong>Date:</strong> {service.serviceDetails.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {service.serviceDetails.timeFrom} -{" "}
                    {service.serviceDetails.timeTo}
                  </p>
                </div>

                <div className="sp-info-group">
                  <h4>Payment Details</h4>
                  <p>
                    <strong>Hours:</strong> {service.serviceDetails.totalHours}
                  </p>
                  <p>
                    <strong>Rate:</strong> LKR{" "}
                    {service.serviceDetails.feePerHour}/hr
                  </p>
                  <p>
                    <strong>Total:</strong> LKR{" "}
                    {service.serviceDetails.totalFee}
                  </p>
                </div>
              </div>

              <div className="sp-service-footer">
                <p>Accepted on: {formatDate(service.acceptedAt)}</p>
                {service.status === "accepted" && (
                  <button className="sp-complete-button">
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderServices;
