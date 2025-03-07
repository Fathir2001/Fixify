import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
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

      <div className="tabs-container-1">
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

      <div className="services-content-1">
        {loading ? (
          <div className="loading-1">Loading services...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : services.length === 0 ? (
          <div className="no-services-1">No {activeTab} services found.</div>
        ) : (
          <table className="services-table-1">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Provider</th>
                {activeTab !== "requested" && <th>Customer</th>}
                <th>Price</th>
                <th>Location</th>
                <th>Date</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.providerName}</td>
                  {activeTab !== "requested" && <td>{service.neederName || "N/A"}</td>}
                  <td>${service.price}</td>
                  <td>{service.location || "N/A"}</td>
                  <td>{service.date || "N/A"}</td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell-1">
                    {activeTab === "requested" && (
                      <>
                        <button 
                          className="action-btn-1 approve-1" 
                          onClick={() => handleApprove(service.id)}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="action-btn-1 reject-1" 
                          onClick={() => handleReject(service.id)}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button className="action-btn-1 view-1" title="View Details">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;