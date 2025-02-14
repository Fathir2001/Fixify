import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaTools,
  FaCog,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCalendarAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "./dashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("overview");

  // Menu structure
  const menuItems = [
    {
      id: "analytics",
      icon: FaChartLine,
      label: "Analytics",
      category: "main",
    },
    { id: "customers", icon: FaUsers, label: "Customers", category: "main" },
    { id: "services", icon: FaTools, label: "Services", category: "main" },
    {
      id: "appointments",
      icon: FaCalendarAlt,
      label: "Appointments",
      category: "main",
    },
    {
      id: "invoices",
      icon: FaFileInvoiceDollar,
      label: "Invoices",
      category: "main",
    },
    {
      id: "reports",
      icon: FaChartBar,
      label: "Reports",
      category: "management",
    },
    { id: "settings", icon: FaCog, label: "Settings", category: "management" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <FaTools className="logo-icon" />
          <span className="logo-text">~ Fixify ~</span>
        </div>

        <div className="sidebar-menu">
          <div className="menu-category">
            <span className="category-label">Main</span>
            {menuItems
              .filter((item) => item.category === "main")
              .map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${
                    selectedSection === item.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSection(item.id)}
                >
                  <item.icon /> <span>{item.label}</span>
                </button>
              ))}
          </div>

          <div className="menu-category">
            <span className="category-label">Management</span>
            {menuItems
              .filter((item) => item.category === "management")
              .map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${
                    selectedSection === item.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSection(item.id)}
                >
                  <item.icon /> <span>{item.label}</span>
                </button>
              ))}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="top-bar">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h1 className="page-title">
              {selectedSection.charAt(0).toUpperCase() +
                selectedSection.slice(1)}
            </h1>
          </div>

          <div className="header-right">
            
            <div className="user-profile">
              <FaUserCircle className="avatar" />
              <div className="user-info">
                <span className="user-name">Administrator</span>
              </div>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-info">
                <h3>Total Customers</h3>
                <p className="stat-number">1,234</p>
                <span className="stat-trend positive">+12.5%</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaTools />
              </div>
              <div className="stat-info">
                <h3>Active Services</h3>
                <p className="stat-number">56</p>
                <span className="stat-trend positive">+5.3%</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaCalendarAlt />
              </div>
              <div className="stat-info">
                <h3>Appointments</h3>
                <p className="stat-number">23</p>
                <span className="stat-trend negative">-2.1%</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaFileInvoiceDollar />
              </div>
              <div className="stat-info">
                <h3>Revenue</h3>
                <p className="stat-number">$45.2K</p>
                <span className="stat-trend positive">+8.4%</span>
              </div>
            </div>
          </div>

          <div className="content-section">
            {/* Content for each section */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
