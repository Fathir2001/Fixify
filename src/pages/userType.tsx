import React from "react";
import { useNavigate } from "react-router-dom";
import "./userType.css";
import { FaUser, FaTools, FaUserShield } from "react-icons/fa";

const UserType: React.FC = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = (type: string) => {
    if (type === "service-provider") {
      navigate("/service-provider/register");
    } else {
      navigate(`/${type}`);
    }
  };

  return (
    <div className="userType-container">
      <div className="userType-grid">
        <div
          className="userType-card"
          onClick={() => handleUserTypeSelection("service-needer")}
        >
          <img
            src="/images/customer-service.jpg"
            alt="Service Needer Background"
            className="card-background"
          />
          <div className="card-content">
            <FaUser className="userType-icon" />
            <h2 className="userType-title">Service Needer</h2>
            <p className="userType-description">
              Looking for professional services? Find qualified service
              providers here.
            </p>
          </div>
        </div>

        <div
          className="userType-card"
          onClick={() => handleUserTypeSelection("service-provider")}
        >
          <img
            src="/serviceProvider.webp"
            alt="Service Provider Background"
            className="card-background"
          />
          <div className="card-content">
            <FaTools className="userType-icon" />
            <h2 className="userType-title">Service Provider</h2>
            <p className="userType-description">
              Offer your professional services and connect with clients.
            </p>
          </div>
        </div>

        <div
          className="userType-card"
          onClick={() => handleUserTypeSelection("admin")}
        >
          <img
            src="/admin.webp"
            alt="Admin Background"
            className="card-background"
          />
          <div className="card-content">
            <FaUserShield className="userType-icon" />
            <h2 className="userType-title">Admin</h2>
            <p className="userType-description">
              Manage the platform and oversee service operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserType;