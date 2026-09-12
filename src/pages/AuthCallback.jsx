import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../utils/Store';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        loginAdmin(user, token);
        
        // Redirect to admin if role is admin, otherwise home
        if (user.role === 'admin' || user.role === 'superadmin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error parsing user data", error);
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=missing_credentials');
    }
  }, [location, navigate, loginAdmin]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Sedang memproses otentikasi...</h2>
        <div className="skeleton" style={{ width: '100%', height: '4px', marginTop: '1rem', borderRadius: '4px' }}></div>
      </div>
    </div>
  );
}
