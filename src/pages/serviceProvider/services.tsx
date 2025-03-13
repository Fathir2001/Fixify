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
  const [acceptedServices, setAcceptedServices] = useState<AcceptedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/service-provider/login");
      return;
    }

    const fetchAcceptedServices = async () => {
      try {
        // Update this URL to match your backend route
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>My Accepted Services</h1>
        <button onClick={handleBackToHome} className="back-button">
          Back to Home
        </button>
      </div>

      {acceptedServices.length === 0 ? (
        <div className="no-services">
          <p>You haven't accepted any services yet.</p>
        </div>
      ) : (
        <div className="services-grid">
          {acceptedServices.map((service) => (
            <div key={service._id} className="service-card">
              <div className="service-header">
                <h3>{service.serviceDetails.serviceType}</h3>
                <span className={`status-badge ${service.status.toLowerCase()}`}>
                  {service.status}
                </span>
              </div>
              
              <div className="service-info">
                <div className="info-group">
                  <h4>Client Information</h4>
                  <p><strong>Name:</strong> {service.serviceNeeder.name}</p>
                  <p><strong>Phone:</strong> {service.serviceNeeder.phoneNumber}</p>
                </div>
                
                <div className="info-group">
                  <h4>Service Details</h4>
                  <p><strong>Location:</strong> {service.serviceDetails.location}</p>
                  <p><strong>Address:</strong> {service.serviceDetails.address}</p>
                  <p><strong>Date:</strong> {service.serviceDetails.date}</p>
                  <p><strong>Time:</strong> {service.serviceDetails.timeFrom} - {service.serviceDetails.timeTo}</p>
                </div>
                
                <div className="info-group">
                  <h4>Payment Details</h4>
                  <p><strong>Hours:</strong> {service.serviceDetails.totalHours}</p>
                  <p><strong>Rate:</strong> LKR {service.serviceDetails.feePerHour}/hr</p>
                  <p><strong>Total:</strong> LKR {service.serviceDetails.totalFee}</p>
                </div>
              </div>
              
              <div className="service-footer">
                <p>Accepted on: {formatDate(service.acceptedAt)}</p>
                {service.status === "accepted" && (
                  <button className="complete-button">
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