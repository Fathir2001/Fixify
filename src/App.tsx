import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './pages/firstPage';
import UserType from './pages/userType';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/user-type" element={<UserType />} />

      </Routes>
    </Router>
  );
}

export default App;