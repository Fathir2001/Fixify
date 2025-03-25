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
  FaUserPlus,
  FaTachometerAlt,
  FaRegBell,
  FaEllipsisV,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import "./dashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [metrics, setMetrics] = useState({
    customers: { count: 0, trend: 0 },
    services: { count: 0, trend: 0 },
    appointments: { count: 0, trend: 0 },
    revenue: { amount: 0, trend: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Menu structure
  const menuItems = [
    {
      id: "overview",
      icon: FaTachometerAlt,
      label: "Dashboard",
      category: "main",
    },
    {
      id: "analytics",
      icon: FaChartLine,
      label: "Analytics",
      category: "main",
    },
    { id: "customers", icon: FaUsers, label: "Customers", category: "main" },
    { id: "services", icon: FaTools, label: "Services", category: "main" },
    {
      id: "ServiceProviders",
      icon: FaUserPlus,
      label: "Service Providers",
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real application, this would fetch data from your API
        // For now, we'll simulate with static data
        setTimeout(() => {
          setMetrics({
            customers: { count: 1234, trend: 12.5 },
            services: { count: 56, trend: 5.3 },
            appointments: { count: 23, trend: -2.1 },
            revenue: { amount: 45200, trend: 8.4 },
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (itemId: string) => {
    setSelectedSection(itemId);
    if (itemId === "ServiceProviders") {
      navigate("/admin/service-provider");
    } else if (itemId === "services") {
      navigate("/admin/services");
    } else if (itemId === "customers") {
      navigate("/admin/customers");
    }
  };

  const formatNumber = (num: number): string => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num.toString();
  };
  
  return (
    <div className="dashboard-container">
      <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <FaTools className="logo-icon" />
          <span className="logo-text">Fixify Admin</span>
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
                  onClick={() => handleMenuClick(item.id)}
                >
                  <item.icon /> <span>{item.label}</span>
                </button>
              ))}
          </div>

          <div className="menu-category">
            <span className="category-label">Administration</span>
            {menuItems
              .filter((item) => item.category === "management")
              .map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${
                    selectedSection === item.id ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <item.icon /> <span>{item.label}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-sidebar">
            <FaUserCircle className="avatar" />
            <div className="user-info">
              <span className="user-name">Administrator</span>
              <span className="user-role">System Admin</span>
            </div>
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
              {selectedSection === "overview" ? "Dashboard Overview" : 
               selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </h1>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <FaRegBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <FaUserCircle className="avatar" />
              <div className="user-info">
                <span className="user-name">Administrator</span>
                <span className="user-role">System Admin</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-banner">
            <div className="welcome-text">
              <h2>Welcome back, Administrator</h2>
              <p>Here's what's happening with your platform today.</p>
            </div>
            <div className="date-display">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-info">
                <h3>Total Customers</h3>
                <p className="stat-number">
                  {loading ? '...' : formatNumber(metrics.customers.count)}
                </p>
                <span className={`stat-trend ${metrics.customers.trend >= 0 ? "positive" : "negative"}`}>
                  {metrics.customers.trend >= 0 ? "+" : ""}{metrics.customers.trend}%
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaTools />
              </div>
              <div className="stat-info">
                <h3>Active Services</h3>
                <p className="stat-number">
                  {loading ? '...' : formatNumber(metrics.services.count)}
                </p>
                <span className={`stat-trend ${metrics.services.trend >= 0 ? "positive" : "negative"}`}>
                  {metrics.services.trend >= 0 ? "+" : ""}{metrics.services.trend}%
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaCalendarAlt />
              </div>
              <div className="stat-info">
                <h3>Appointments</h3>
                <p className="stat-number">
                  {loading ? '...' : formatNumber(metrics.appointments.count)}
                </p>
                <span className={`stat-trend ${metrics.appointments.trend >= 0 ? "positive" : "negative"}`}>
                  {metrics.appointments.trend >= 0 ? "+" : ""}{metrics.appointments.trend}%
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaFileInvoiceDollar />
              </div>
              <div className="stat-info">
                <h3>Revenue</h3>
                <p className="stat-number">
                  {loading ? '...' : `$${formatNumber(metrics.revenue.amount)}`}
                </p>
                <span className={`stat-trend ${metrics.revenue.trend >= 0 ? "positive" : "negative"}`}>
                  {metrics.revenue.trend >= 0 ? "+" : ""}{metrics.revenue.trend}%
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="content-section recent-activity">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <button className="more-btn">
                  <FaEllipsisV />
                </button>
              </div>
              
              <div className="activity-list">
                {loading ? (
                  <div className="loading-spinner-small"></div>
                ) : error ? (
                  <div className="error-message-small">
                    <FaExclamationCircle /> {error}
                  </div>
                ) : (
                  <>
                    <div className="activity-item">
                      <div className="activity-icon success">
                        <FaCheckCircle />
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">New service provider approved</p>
                        <p className="activity-time">2 hours ago</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon warning">
                        <FaExclamationCircle />
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">Service request pending review</p>
                        <p className="activity-time">4 hours ago</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon success">
                        <FaCheckCircle />
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">New customer registered</p>
                        <p className="activity-time">Yesterday</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="content-section quick-actions">
              <div className="section-header">
                <h2>Quick Actions</h2>
              </div>
              
              <div className="action-buttons-grid">
                <button className="action-button" onClick={() => navigate('/admin/service-provider')}>
                  <FaUserPlus />
                  <span>Manage Providers</span>
                </button>
                <button className="action-button" onClick={() => navigate('/admin/customers')}>
                  <FaUsers />
                  <span>View Customers</span>
                </button>
                <button className="action-button" onClick={() => navigate('/admin/services')}>
                  <FaTools />
                  <span>Review Services</span>
                </button>
                <button className="action-button">
                  <FaChartBar />
                  <span>Generate Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;