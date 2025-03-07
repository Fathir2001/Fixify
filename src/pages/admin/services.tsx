import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaTimes, FaEye, FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./services.css";

// Interface to match backend data structure
interface Service {
  _id: string;
  serviceDetails: {
    serviceType: string;
    totalFee: number;
    location?: string;
    date?: string;
  };
  serviceProvider: {
    name: string;
    id: string;
  };
  serviceNeeder?: {
    name: string;
    id: string;
  };
  status: string;
  createdAt: string;
  acceptedAt?: string;
}

// Interface for frontend display
interface FormattedService {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "requested" | "approved" | "rejected";
  createdAt: string;
  providerName: string;
  neederName?: string;
  location?: string;
  date?: string;
}

const API_BASE_URL = "http://localhost:5000/api"; // Update with your actual API URL

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"requested" | "approved" | "rejected">("requested");
  const [services, setServices] = useState<FormattedService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = "";
        
        // Select the appropriate endpoint based on active tab
        switch(activeTab) {
          case "requested":
            endpoint = `${API_BASE_URL}/service-requests`;
            break;
          case "approved":
            endpoint = `${API_BASE_URL}/service-requests/approved`;
            break;
          case "rejected":
            endpoint = `${API_BASE_URL}/service-requests/rejected`;
            break;
        }
        
        console.log(`Fetching data from: ${endpoint}`);
        const response = await axios.get(endpoint);
        console.log("API Response:", response.data);
        
        const formattedServices = formatServicesData(response.data, activeTab);
        setServices(formattedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [activeTab]);

  // Format the data from backend to match our frontend requirements
  const formatServicesData = (
    data: Service[], 
    status: "requested" | "approved" | "rejected"
  ): FormattedService[] => {
    if (!Array.isArray(data)) {
      console.error("Expected array but received:", data);
      return [];
    }
    
    return data.map((service) => ({
      id: service._id,
      name: service.serviceDetails.serviceType,
      category: service.serviceDetails.serviceType.split(" ")[0], // Using first word as category
      price: service.serviceDetails.totalFee,
      status: status,
      createdAt: service.createdAt ? new Date(service.createdAt).toISOString().split("T")[0] : 
                (service.acceptedAt ? new Date(service.acceptedAt).toISOString().split("T")[0] : "N/A"),
      providerName: service.serviceProvider.name,
      neederName: service.serviceNeeder?.name,
      location: service.serviceDetails.location,
      date: service.serviceDetails.date
    }));
  };

  const handleApprove = async (serviceId: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/service-requests/${serviceId}/accept`);
      
      // Refresh data after approving
      const response = await axios.get(`${API_BASE_URL}/service-requests`);
      const formattedServices = formatServicesData(response.data, "requested");
      setServices(formattedServices);
      
      // Show success message
      alert("Service has been approved successfully!");
    } catch (error) {
      console.error("Error approving service:", error);
      alert("Failed to approve service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (serviceId: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/service-requests/reject-service/${serviceId}`);
      
      // Refresh data after rejecting
      const response = await axios.get(`${API_BASE_URL}/service-requests`);
      const formattedServices = formatServicesData(response.data, "requested");
      setServices(formattedServices);
      
      // Show success message
      alert("Service has been rejected successfully!");
    } catch (error) {
      console.error("Error rejecting service:", error);
      alert("Failed to reject service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-container-1">
      <header className="services-header-1">
        <div className="header-left-1">
          <button className="back-button-1" onClick={() => navigate("/admin/dashboard")}>
            <FaArrowLeft />
          </button>
          <h1>Service Management</h1>
        </div>
      </header>

      <div className="controls-section">
        <div className="tabs-1">
          <button 
            className={`tab-1 ${activeTab === "requested" ? "active" : ""}`} 
            onClick={() => setActiveTab("requested")}
          >
            Requested
          </button>
          <button 
            className={`tab-1 ${activeTab === "approved" ? "active" : ""}`} 
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>
          <button 
            className={`tab-1 ${activeTab === "rejected" ? "active" : ""}`} 
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-1">Loading services...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : services.length === 0 ? (
        <div className="no-services-1">No {activeTab} services found.</div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className="service-category">{service.category}</span>
              </div>
              
              <div className="service-details">
                <p>
                  <span className="label">Provider</span>
                  <span className="value">{service.providerName}</span>
                </p>
                {activeTab !== "requested" && service.neederName && (
                  <p>
                    <span className="label">Customer</span>
                    <span className="value">{service.neederName}</span>
                  </p>
                )}
                <p>
                  <span className="label">Price</span>
                  <span className="value price-tag">${service.price.toFixed(2)}</span>
                </p>
                {service.location && (
                  <p>
                    <span className="label"><FaMapMarkerAlt /> Location</span>
                    <span className="value">{service.location}</span>
                  </p>
                )}
                {service.date && (
                  <p>
                    <span className="label"><FaRegCalendarAlt /> Date</span>
                    <span className="value">{service.date}</span>
                  </p>
                )}
                <p>
                  <span className="label">Created</span>
                  <span className="value">{new Date(service.createdAt).toLocaleDateString()}</span>
                </p>
                <p>
                  <span className="label">Status</span>
                  <span className={`status-badge ${service.status}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </p>
              </div>
              
              <div className="action-buttons">
                {activeTab === "requested" && (
                  <>
                    <button 
                      className="approve-btn" 
                      onClick={() => handleApprove(service.id)}
                    >
                      <FaCheck /> Approve
                    </button>
                    <button 
                      className="reject-btn" 
                      onClick={() => handleReject(service.id)}
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                )}
                <button className="view-btn">
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;