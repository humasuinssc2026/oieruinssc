import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../utils/Store';
import { toast } from 'sonner';

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, token } = useAppContext();

  // If not logged in, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If admin only is true, check roles
  if (adminOnly) {
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      // Small timeout to allow render to complete before toast fires
      setTimeout(() => {
        toast.error("Akses Ditolak: Anda bukan administrator.");
      }, 100);
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
