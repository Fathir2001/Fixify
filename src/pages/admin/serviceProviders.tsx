import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import "./serviceProviders.css";

interface ProviderRequest {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string[];
  experience: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  serviceArea: string;
  availableDays: string[];
  timeFrom: string;
  timeTo: string;
}

const ServiceProviders: React.FC = () => {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/service-providers/all"
        );
        // Add type for the response data
        const providers = response.data.map(
          (provider: Omit<ProviderRequest, "status">) => ({
            ...provider,
            status: "pending" as const,
          })
        );
        setRequests(providers);
        setLoading(false);
      } catch (err: unknown) {
        // Type guard for error handling
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch service providers";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, []);

  const handleStatusChange = (
    requestId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setRequests(
      requests.map((req) =>
        req._id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const filteredRequests = requests.filter((req) => req.status === filter);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

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
          <div key={request._id} className="request-card">
            <div className="request-header">
              <h3>{request.fullName}</h3>
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
                <strong>Phone:</strong> {request.phoneNumber}
              </p>
              <p>
                <strong>Services:</strong> {request.serviceType.join(", ")}
              </p>
              <p>
                <strong>Experience:</strong> {request.experience}
              </p>
              <p>
                <strong>Service Area:</strong> {request.serviceArea}
              </p>
              <p>
                <strong>Available Days:</strong>{" "}
                {request.availableDays.join(", ")}
              </p>
              <p>
                <strong>Hours:</strong> {request.timeFrom} - {request.timeTo}
              </p>
              <p>
                <strong>Date Applied:</strong>{" "}
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            {request.status === "pending" && (
              <div className="action-buttons">
                <button
                  className="approve-btn"
                  onClick={() => handleStatusChange(request._id, "approved")}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleStatusChange(request._id, "rejected")}
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

export default ServiceProviders;
