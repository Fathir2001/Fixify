import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './pages/firstPage';
import UserType from './pages/userType';
import ServiceProviderRegister from './pages/serviceProvider/register';
import AdminLogin from './pages/admin/login';
import AdminDashboard from './pages/admin/dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/user-type" element={<UserType />} />
        <Route path="/service-provider/register" element={<ServiceProviderRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;