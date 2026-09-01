import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './utils/Store';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import GeneralStudies from './pages/GeneralStudies';
import Faculties from './pages/Faculties';
import VideoHub from './pages/VideoHub';
import MaterialDetail from './pages/MaterialDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import NotFound from './pages/NotFound';

// Admin
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ContentManager from './admin/ContentManager';
import CategoryManager from './admin/CategoryManager';
import UserManager from './admin/UserManager';
import ReviewManager from './admin/ReviewManager';
import ProtectedRoute from './components/ProtectedRoute';
import TopProgressBar from './components/TopProgressBar';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTop from './components/ScrollToTop';

import './styles/index.css';
import './styles/admin.css';

// Public Layout Component
const PublicLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <ScrollToTop />
        <TopProgressBar />
        <Routes>
          {/* Public Routes with Header & Footer */}
          <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/general-studies" element={<GeneralStudies />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/videos" element={<VideoHub />} />
          <Route path="/material/:id" element={<MaterialDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          
          {/* Catch all route for 404 Not Found within Layout */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes with Sidebar Layout */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/admin/users" element={<UserManager />} />
            <Route path="/admin/reviews" element={<ReviewManager />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </AppProvider>
  );
}
