import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css";

interface ServiceProvider {
  fullName: string;
  email: string;
  serviceType: string[];
  phoneNumber: string;
  serviceArea: string;
  availableDays: string[];
  timeFrom: string;
  timeTo: string;
  experience: string;
  approvedAt: string;
  serviceFee: number;
}

interface EditableData extends ServiceProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const ServiceProviderHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<EditableData | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const availableServices = [
    "Electrician Services",
    "Plumbing Services",
    "Carpentry Services",
    "Vehicle Breakdown Assistance",
    "Home Appliance Repair",
    "House Cleaning Services",
    "Painting Services",
    "Gardening & Landscaping",
    "Roof Repair & Waterproofing",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/service-provider/login");
      return;
    }

    const fetchProviderData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/service-providers/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProvider(data);
        } else {
          throw new Error("Failed to fetch provider data");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/service-provider/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showNotifications &&
        !(event.target as Element).closest(".notification-wrapper")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/service-provider/login");
  };

  const handleEdit = () => {
    setEditableData(provider);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditableData(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditableData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      };
    });
  };

  const handleArrayChange = (name: string, value: string[]) => {
    setEditableData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!editableData) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/service-providers/profile/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editableData),
        }
      );

      if (response.ok) {
        setProvider(editableData);
        setIsEditing(false);
        setEditableData(null);
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    setNotificationCount(0);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="logo">Fixify</h1>
        <div className="nav-buttons">
          <div className="notification-wrapper">
            <div className="notification-icon-1" onClick={toggleNotifications}>
              <i className="fas fa-bell"></i>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
            {showNotifications && (
              <div className="notification-popup">
                <div className="notification-header">
                  <span>Notifications</span>
                  {notifications.some((n) => !n.read) && (
                    <button className="mark-all-read" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <ul className="notification-list">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`notification-item ${
                          !notification.read ? "unread" : ""
                        }`}
                      >
                        <div className="notification-content">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-notifications">No notifications</div>
                )}
              </div>
            )}
          </div>
          {!isEditing && (
            <button onClick={handleEdit} className="edit-button">
              Edit Profile
            </button>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <div className="welcome-section">
          <h1>Welcome, {provider?.fullName}</h1>
          <p>Manage your service provider account</p>
        </div>

        <div className="info-cards">
          <div className="card">
            <h3>Profile Information</h3>
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group-2">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editableData?.fullName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-2">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editableData?.phoneNumber || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-2">
                  <label>Service Area:</label>
                  <input
                    type="text"
                    name="serviceArea"
                    value={editableData?.serviceArea || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-2">
                  <label>Experience:</label>
                  <input
                    type="text"
                    name="experience"
                    value={editableData?.experience || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-2">
                  <label>Service Fee per Hour (LKR):</label>
                  <input
                    type="number"
                    name="serviceFee"
                    value={editableData?.serviceFee || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {provider?.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {provider?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {provider?.phoneNumber}
                </p>
                <p>
                  <strong>Service Area:</strong> {provider?.serviceArea}
                </p>
                <p>
                  <strong>Experience:</strong> {provider?.experience}
                </p>
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {provider?.approvedAt &&
                    new Date(provider.approvedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Service Fee:</strong> LKR {provider?.serviceFee}/hr
                </p>
              </>
            )}
          </div>

          <div className="card">
            <h3>Services</h3>
            {isEditing ? (
              <div className="form-group-2">
                <label>Select Services:</label>
                <div className="checkbox-group">
                  {availableServices.map((service) => (
                    <div key={service} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`service-${service}`}
                        // Check if the service exists in editableData.serviceType array
                        checked={
                          editableData?.serviceType?.includes(service) || false
                        }
                        onChange={(e) => {
                          const currentServices = [
                            ...(editableData?.serviceType || []),
                          ];
                          const updatedServices = e.target.checked
                            ? [...currentServices, service]
                            : currentServices.filter((s) => s !== service);
                          handleArrayChange("serviceType", updatedServices);
                        }}
                      />
                      <label htmlFor={`service-${service}`}>{service}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="services-list">
                {provider?.serviceType.map((service, index) => (
                  <span key={index} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3>Availability</h3>
            {isEditing ? (
              <>
                <div className="form-group-2">
                  <label>Available Days:</label>
                  <div className="checkbox-group">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={editableData?.availableDays.includes(day)}
                          onChange={(e) => {
                            const currentDays =
                              editableData?.availableDays || [];
                            const updatedDays = e.target.checked
                              ? [...currentDays, day]
                              : currentDays.filter((d) => d !== day);
                            handleArrayChange("availableDays", updatedDays);
                          }}
                        />
                        <label htmlFor={`day-${day}`}>{day}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group-2">
                  <label>Time From:</label>
                  <input
                    type="time"
                    name="timeFrom"
                    value={editableData?.timeFrom || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-2">
                  <label>Time To:</label>
                  <input
                    type="time"
                    name="timeTo"
                    value={editableData?.timeTo || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Available Days:</strong>
                </p>
                <div className="services-list">
                  {provider?.availableDays.map((day, index) => (
                    <span key={index} className="service-tag">
                      {day}
                    </span>
                  ))}
                </div>
                <p>
                  <strong>Working Hours:</strong> {provider?.timeFrom} -{" "}
                  {provider?.timeTo}
                </p>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="edit-buttons">
            <button onClick={handleSave} className="save-button">
              Save Changes
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderHomePage;
