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
  FaUserPlus,
  FaTachometerAlt,
  FaEllipsisV,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import axios from "axios";
import "./dashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Initialize with sidebar closed for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1043);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [metrics, setMetrics] = useState({
    customers: { count: 0, trend: 0 },
    services: { count: 0, trend: 0 },
    appointments: { count: 0, trend: 0 },
    revenue: { amount: 0, trend: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1043);

  // Handle window resize with updated breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1043;
      setIsMobile(mobile);

      // Auto close sidebar when resizing below 1043px
      // Auto open sidebar when resizing above 1043px
      setIsSidebarOpen(!mobile);
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Remove the redundant second resize handler
  // The one above is sufficient

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

  const handleMenuClick = (itemId: string) => {
    setSelectedSection(itemId);
    if (isMobile) {
      setIsSidebarOpen(false); // Close sidebar on menu item click on mobile
    }

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="ad-dashboard-container">
      {/* Overlay for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div
          className="ad-sidebar-overlay active"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <nav className={`ad-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="ad-sidebar-header">
          <FaTools className="ad-logo-icon" />
          <span className="ad-logo-text">Fixify Admin</span>
          {isMobile && (
            <button
              className="ad-sidebar-toggle"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="ad-sidebar-menu">
          <div className="ad-menu-category">
            <span className="ad-category-label">Main</span>
            {menuItems
              .filter((item) => item.category === "main")
              .map((item) => (
                <button
                  key={item.id}
                  className={`ad-menu-item ${
                    selectedSection === item.id ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                  aria-label={item.label}
                >
                  <item.icon /> <span>{item.label}</span>
                </button>
              ))}
          </div>

          <div className="ad-menu-category">
            <span className="ad-category-label">Administration</span>
            {menuItems
              .filter((item) => item.category === "management")
              .map((item) => (
                <button
                  key={item.id}
                  className={`ad-menu-item ${
                    selectedSection === item.id ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                  aria-label={item.label}
                >
                  <item.icon /> <span>{item.label}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="ad-sidebar-footer">
          <div className="ad-user-profile-sidebar">
            <FaUserCircle className="ad-avatar" />
            <div className="ad-user-info">
              <span className="ad-user-name">Administrator</span>
              <span className="ad-user-role">System Admin</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="ad-main-content">
        <header className="ad-top-bar">
          <div className="ad-header-left">
            {/* Always show hamburger menu on mobile */}
            {isMobile && (
              <button
                className="ad-mobile-menu-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
              >
                <FaBars />
              </button>
            )}
            <h1 className="ad-page-title">
              {selectedSection === "overview"
                ? "Dashboard Overview"
                : selectedSection.charAt(0).toUpperCase() +
                  selectedSection.slice(1)}
            </h1>
          </div>

          <div className="ad-header-right">
            <div className="ad-user-profile">
              <FaUserCircle className="ad-avatar" />
              <div className="ad-user-info">
                <span className="ad-user-name">Administrator</span>
                <span className="ad-user-role">System Admin</span>
              </div>
            </div>
            <button
              className="ad-logout-btn"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </header>
        <div className="ad-dashboard-content">
          <div className="ad-welcome-banner">
            <div className="ad-welcome-text">
              <h2>Welcome back, Administrator</h2>
              <p>Here's what's happening with your platform today.</p>
            </div>
            <div className="ad-date-display">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="ad-stats-grid">
            <div className="ad-stat-card">
              <div className="ad-stat-icon">
                <FaUsers />
              </div>
              <div className="ad-stat-info">
                <h3>Total Customers</h3>
                <p className="ad-stat-number">
                  {loading ? "..." : formatNumber(metrics.customers.count)}
                </p>
                <span
                  className={`ad-stat-trend ${
                    metrics.customers.trend >= 0 ? "positive" : "negative"
                  }`}
                >
                  {metrics.customers.trend >= 0 ? "+" : ""}
                  {metrics.customers.trend}%
                </span>
              </div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon">
                <FaTools />
              </div>
              <div className="ad-stat-info">
                <h3>Active Services</h3>
                <p className="ad-stat-number">
                  {loading ? "..." : formatNumber(metrics.services.count)}
                </p>
                <span
                  className={`ad-stat-trend ${
                    metrics.services.trend >= 0 ? "positive" : "negative"
                  }`}
                >
                  {metrics.services.trend >= 0 ? "+" : ""}
                  {metrics.services.trend}%
                </span>
              </div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon">
                <FaCalendarAlt />
              </div>
              <div className="ad-stat-info">
                <h3>Appointments</h3>
                <p className="ad-stat-number">
                  {loading ? "..." : formatNumber(metrics.appointments.count)}
                </p>
                <span
                  className={`ad-stat-trend ${
                    metrics.appointments.trend >= 0 ? "positive" : "negative"
                  }`}
                >
                  {metrics.appointments.trend >= 0 ? "+" : ""}
                  {metrics.appointments.trend}%
                </span>
              </div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon">
                <FaFileInvoiceDollar />
              </div>
              <div className="ad-stat-info">
                <h3>Revenue</h3>
                <p className="ad-stat-number">
                  {loading ? "..." : `$${formatNumber(metrics.revenue.amount)}`}
                </p>
                <span
                  className={`ad-stat-trend ${
                    metrics.revenue.trend >= 0 ? "positive" : "negative"
                  }`}
                >
                  {metrics.revenue.trend >= 0 ? "+" : ""}
                  {metrics.revenue.trend}%
                </span>
              </div>
            </div>
          </div>

          <div className="ad-dashboard-grid">
            <div className="ad-content-section ad-recent-activity">
              <div className="ad-section-header">
                <h2>Recent Activity</h2>
                <button className="ad-more-btn" aria-label="More options">
                  <FaEllipsisV />
                </button>
              </div>

              <div className="ad-activity-list">
                {loading ? (
                  <div className="ad-loading-spinner-small"></div>
                ) : error ? (
                  <div className="ad-error-message-small">
                    <FaExclamationCircle /> {error}
                  </div>
                ) : (
                  <>
                    <div className="ad-activity-item">
                      <div className="ad-activity-icon success">
                        <FaCheckCircle />
                      </div>
                      <div className="ad-activity-details">
                        <p className="ad-activity-text">
                          New service provider approved
                        </p>
                        <p className="ad-activity-time">2 hours ago</p>
                      </div>
                    </div>
                    <div className="ad-activity-item">
                      <div className="ad-activity-icon warning">
                        <FaExclamationCircle />
                      </div>
                      <div className="ad-activity-details">
                        <p className="ad-activity-text">
                          Service request pending review
                        </p>
                        <p className="ad-activity-time">4 hours ago</p>
                      </div>
                    </div>
                    <div className="ad-activity-item">
                      <div className="ad-activity-icon success">
                        <FaCheckCircle />
                      </div>
                      <div className="ad-activity-details">
                        <p className="ad-activity-text">
                          New customer registered
                        </p>
                        <p className="ad-activity-time">Yesterday</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="ad-content-section ad-quick-actions">
              <div className="ad-section-header">
                <h2>Quick Actions</h2>
              </div>

              <div className="ad-action-buttons-grid">
                <button
                  className="ad-action-button"
                  onClick={() => navigate("/admin/service-provider")}
                >
                  <FaUserPlus />
                  <span>Manage Providers</span>
                </button>
                <button
                  className="ad-action-button"
                  onClick={() => navigate("/admin/customers")}
                >
                  <FaUsers />
                  <span>View Customers</span>
                </button>
                <button
                  className="ad-action-button"
                  onClick={() => navigate("/admin/services")}
                >
                  <FaTools />
                  <span>Review Services</span>
                </button>
                <button className="ad-action-button">
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
