import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import UserDashboard from '@/pages/UserDashboard';
import DonationForm from '@/pages/DonationForm';
import AdminOverview from '@/pages/AdminOverview';
import CampaignManagement from '@/pages/CampaignManagement';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import ExploreCampaigns from '@/pages/ExploreCampaigns';
import AdminLayout from '@/layouts/AdminLayout';
import ContactUs from '@/pages/ContactUs';
import Reviews from '@/pages/Reviews';
import { useAuth } from '@/context/AuthContext';

function App() {
  const { token, user, loading } = useAuth();

  if (loading) {
    return null; // Or a global loader
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {token && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/campaigns" element={<ExploreCampaigns />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="campaigns" element={<CampaignManagement />} />
          </Route>
        </Route>

        {/* Default Redirects */}
        <Route path="/" element={
          token ? (
            user?.role === 'admin'
              ? <Navigate to="/admin/dashboard" replace />
              : <Navigate to="/dashboard" replace />
          ) : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;