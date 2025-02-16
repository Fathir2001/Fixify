import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homePage.css';

interface ServiceProvider {
  fullName: string;
  email: string;
  serviceType: string[];
  phoneNumber: string;
  serviceArea: string;
}

const ServiceProviderHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/service-provider/login');
      return;
    }

    const fetchProviderData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/service-providers/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProvider(data);
        } else {
          throw new Error('Failed to fetch provider data');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/service-provider/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/service-provider/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">Fixify</div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      <div className="content">
        <div className="welcome-section">
          <h1>Welcome, {provider?.fullName}</h1>
          <p>Manage your service provider account</p>
        </div>

        <div className="info-cards">
          <div className="card">
            <h3>Profile Information</h3>
            <p><strong>Name:</strong> {provider?.fullName}</p>
            <p><strong>Email:</strong> {provider?.email}</p>
            <p><strong>Phone:</strong> {provider?.phoneNumber}</p>
            <p><strong>Service Area:</strong> {provider?.serviceArea}</p>
          </div>

          <div className="card">
            <h3>Services</h3>
            <div className="services-list">
              {provider?.serviceType.map((service, index) => (
                <span key={index} className="service-tag">{service}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderHomePage;