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
  approvedAt?: string;
  rejectedAt?: string;
  serviceFee: number;
}

const ServiceProviders: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<ProviderRequest[]>([]);
  const [approvedProviders, setApprovedProviders] = useState<ProviderRequest[]>(
    []
  );
  const [rejectedProviders, setRejectedProviders] = useState<ProviderRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const [pendingResponse, approvedResponse, rejectedResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/service-providers/all"),
            axios.get("http://localhost:5000/api/service-providers/approved"),
            axios.get("http://localhost:5000/api/service-providers/rejected"),
          ]);

        setPendingRequests(
          pendingResponse.data.map((provider: any) => ({
            ...provider,
            status: "pending" as const,
          }))
        );

        setApprovedProviders(
          approvedResponse.data.map((provider: any) => ({
            ...provider,
            status: "approved" as const,
          }))
        );

        setRejectedProviders(
          rejectedResponse.data.map((provider: any) => ({
            ...provider,
            status: "rejected" as const,
          }))
        );

        setLoading(false);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch service providers";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleStatusChange = async (
    requestId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      if (newStatus === "approved") {
        await axios.put(
          `http://localhost:5000/api/service-providers/approve/${requestId}`
        );

        const approvedProvider = pendingRequests.find(
          (req) => req._id === requestId
        );
        if (approvedProvider) {
          setPendingRequests((requests) =>
            requests.filter((req) => req._id !== requestId)
          );
          setApprovedProviders((providers) => [
            {
              ...approvedProvider,
              status: "approved",
              approvedAt: new Date().toISOString(),
            },
            ...providers,
          ]);
        }

        alert("Service provider approved successfully!");
      } else {
        await axios.put(
          `http://localhost:5000/api/service-providers/reject/${requestId}`
        );

        const rejectedProvider = pendingRequests.find(
          (req) => req._id === requestId
        );
        if (rejectedProvider) {
          setPendingRequests((requests) =>
            requests.filter((req) => req._id !== requestId)
          );
          setRejectedProviders((providers) => [
            {
              ...rejectedProvider,
              status: "rejected",
              rejectedAt: new Date().toISOString(),
            },
            ...providers,
          ]);
        }

        alert("Service provider rejected successfully!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update service provider status"
      );
    }
  };

  const getFilteredRequests = () => {
    switch (filter) {
      case "approved":
        return approvedProviders;
      case "rejected":
        return rejectedProviders;
      case "pending":
      default:
        return pendingRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

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

      {filteredRequests.length > 0 ? (
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
                  <strong>Service Fee:</strong> LKR {request.serviceFee}/hr
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
                {request.approvedAt && (
                  <p>
                    <strong>Date Approved:</strong>{" "}
                    {new Date(request.approvedAt).toLocaleDateString()}
                  </p>
                )}
                {request.rejectedAt && (
                  <p>
                    <strong>Date Rejected:</strong>{" "}
                    {new Date(request.rejectedAt).toLocaleDateString()}
                  </p>
                )}
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
      ) : (
        <div className="no-data-message">
          <p>No {filter} service providers found.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceProviders;
