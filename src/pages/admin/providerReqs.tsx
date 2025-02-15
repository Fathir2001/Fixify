import React, { useState } from "react";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import "./providerReqs.css";

interface ProviderRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  experience: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

const ProviderRequests: React.FC = () => {
  const [requests, setRequests] = useState<ProviderRequest[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 234-567-8900",
      services: ["Plumbing", "Electrical"],
      experience: "5 years",
      status: "pending",
      date: "2025-02-15",
    },
    // Add more sample data as needed
  ]);

  const [filter, setFilter] = useState("all");

  const handleStatusChange = (
    requestId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const filteredRequests = requests.filter((req) => req.status === filter);

  return (
    <div className="provider-reqs-container">
      <div className="controls-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="requests-grid">
        {filteredRequests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h3>{request.name}</h3>
              <span className={`status-badge ${request.status}`}>
                {request.status === "pending" && (
                  <FaSpinner className="spinning" />
                )}
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </span>
            </div>
            <div className="request-details">
              <p>
                <strong>Email:</strong> {request.email}
              </p>
              <p>
                <strong>Phone:</strong> {request.phone}
              </p>
              <p>
                <strong>Services:</strong> {request.services.join(", ")}
              </p>
              <p>
                <strong>Experience:</strong> {request.experience}
              </p>
              <p>
                <strong>Date:</strong> {request.date}
              </p>
            </div>
            {request.status === "pending" && (
              <div className="action-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleStatusChange(request.id, "approved")}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleStatusChange(request.id, "rejected")}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderRequests;
