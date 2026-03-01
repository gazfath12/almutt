import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import CustomCursor from './components/ui/CustomCursor';
import ParticleBackground from './components/ui/ParticleBackground';
import BackgroundMusic from './components/ui/BackgroundMusic';

// Pages
import Home from './pages/public/Home';
import Gallery from './pages/public/Gallery';
import Members from './pages/public/Members';
import Stories from './pages/public/Stories';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/views/AdminMembers';
import AdminGallery from './pages/admin/views/AdminGallery';
import AdminStories from './pages/admin/views/AdminStories';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/member" element={<Members />} />
        <Route path="/kisah" element={<Stories />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />}>
            <Route path="members" element={<AdminMembers />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="stories" element={<AdminStories />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <CustomCursor />
        <ParticleBackground />
        <BackgroundMusic />
        <Navbar />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
