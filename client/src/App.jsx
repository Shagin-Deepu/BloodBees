import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layout/DashboardLayout';
import Profile from './pages/Profile';
import Donate from './pages/Donate';
import RequestBlood from './pages/RequestBlood';
import Welcome from './pages/Welcome';
import About from './pages/About';
import GodModePage from './pages/GodModePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="welcome" element={<Welcome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="donate" element={<Donate />} />
            <Route path="request" element={<RequestBlood />} />
            <Route path="about" element={<About />} />
            <Route path="godmode" element={<GodModePage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
