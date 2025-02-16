import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './pages/firstPage';
import UserType from './pages/userType';
import ServiceProviderRegister from './pages/serviceProvider/register';
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import './App.css';
import ProviderRequests from './pages/admin/serviceProviders';
import ServiceProviderLogin from './pages/serviceProvider/login';
import ServiceProviderHomePage from './pages/serviceProvider/homePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/user-type" element={<UserType />} />
        <Route path="/service-provider/register" element={<ServiceProviderRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/service-provider" element={<ProviderRequests />} />
        <Route path="/service-provider/login" element={<ServiceProviderLogin />} />
        <Route path="/service-provider/dashboard" element={<ServiceProviderHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;