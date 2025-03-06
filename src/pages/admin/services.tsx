import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaTimes, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./services.css";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  status: "requested" | "approved" | "rejected";
  createdAt: string;
  providerName: string;
}

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"requested" | "approved" | "rejected">("requested");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data - replace with actual API calls in production
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockServices: Service[] = [
        {
          id: "1",
          name: "Plumbing Repair",
          category: "Plumbing",
          description: "Fix leaky faucets and pipes",
          price: 75,
          status: "requested",
          createdAt: "2025-03-01",
          providerName: "John Smith"
        },
        {
          id: "2",
          name: "Electrical Wiring",
          category: "Electrical",
          description: "Install or repair electrical wiring",
          price: 120,
          status: "approved",
          createdAt: "2025-02-28",
          providerName: "Jane Doe"
        },
        {
          id: "3",
          name: "Lawn Mowing",
          category: "Garden",
          description: "Lawn mowing and trimming",
          price: 45,
          status: "rejected",
          createdAt: "2025-03-02",
          providerName: "Mike Johnson"
        },
        {
          id: "4",
          name: "HVAC Maintenance",
          category: "HVAC",
          description: "Regular maintenance for HVAC systems",
          price: 150,
          status: "requested",
          createdAt: "2025-03-05",
          providerName: "Sarah Williams"
        },
        {
          id: "5",
          name: "Painting Service",
          category: "Interior",
          description: "Interior wall painting",
          price: 200,
          status: "approved",
          createdAt: "2025-03-01",
          providerName: "Tom Brown"
        }
      ];
      
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (serviceId: string) => {
    // In a real app, make an API call here
    setServices(services.map(service => 
      service.id === serviceId ? {...service, status: "approved"} : service
    ));
  };

  const handleReject = (serviceId: string) => {
    // In a real app, make an API call here
    setServices(services.map(service => 
      service.id === serviceId ? {...service, status: "rejected"} : service
    ));
  };

  const filteredServices = services.filter(service => service.status === activeTab);

  return (
    <div className="services-container-1">
      <header className="services-header-1">
        <div className="header-left-1">
          <button className="back-button-1" onClick={() => navigate("/admin/dashboard")}>
            <FaArrowLeft />
          </button>
          <h1>Service Management</h1>
        </div>
        <button className="add-service-btn-1">
          <FaPlusCircle /> Add New Service
        </button>
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
        ) : filteredServices.length === 0 ? (
          <div className="no-services-1">No {activeTab} services found.</div>
        ) : (
          <table className="services-table-1">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.providerName}</td>
                  <td>${service.price}</td>
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