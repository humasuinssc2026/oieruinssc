import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Users, 
  LogOut, 
  Bell, 
  Search,
  Check
} from 'lucide-react';
import { useAppContext } from '../utils/Store';

export default function AdminLayout() {
  const location = useLocation();
  const { user, isAdminAuthenticated, logoutAdmin, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications ? notifications.filter(n => !n.is_read).length : 0;

  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    logoutAdmin();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div style={{ background: 'linear-gradient(135deg, #4ade80 0%, #10b981 100%)', color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontWeight: '900', letterSpacing: '1px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)' }}>OIER</div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'white', fontWeight: '600' }}>Admin Panel</h2>
        </div>
        
        <nav className="admin-sidebar-nav">
          <Link to="/admin" className={`admin-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/content" className={`admin-nav-item ${location.pathname.includes('content') ? 'active' : ''}`}>
            <FileText size={20} /> Manajemen Konten
          </Link>
          <Link to="/admin/categories" className={`admin-nav-item ${location.pathname.includes('categories') ? 'active' : ''}`}>
            <Layers size={20} /> Kategori & Fakultas
          </Link>
          <Link to="/admin/users" className={`admin-nav-item ${location.pathname.includes('users') ? 'active' : ''}`}>
            <Users size={20} /> Manajemen Pengguna
          </Link>
          <Link to="/admin/reviews" className={`admin-nav-item ${location.pathname.includes('reviews') ? 'active' : ''}`}>
            <FileText size={20} /> Kelola Ulasan
          </Link>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="#" onClick={handleLogout} className="admin-nav-item" style={{ padding: '0.75rem 0' }}>
            <LogOut size={20} /> Logout
          </a>
          <Link to="/" className="admin-nav-item" style={{ padding: '0.75rem 0', marginTop: '0.5rem' }}>
            Kembali ke Publik
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', padding: '0.6rem 1.2rem', borderRadius: '12px', width: '350px', border: '1px solid #E5E7EB', transition: 'all 0.3s ease' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Cari sesuatu..." 
              style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', outline: 'none', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ cursor: 'pointer' }} onClick={() => setShowNotifMenu(!showNotifMenu)}>
                <Bell size={22} color="var(--text-muted)" />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: -5, right: -5, background: '#ff4757', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              
              {showNotifMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                    width: '320px', background: 'var(--surface-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                    borderRadius: '12px', overflow: 'hidden', zIndex: 100, border: '1px solid var(--surface-hover)'
                  }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Notifikasi</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsAsRead} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Check size={14} /> Tandai dibaca
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications && notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => { markNotificationAsRead(n.id); if (n.link) window.location.href = n.link; }}
                            style={{ padding: '1rem', borderBottom: '1px solid var(--surface-hover)', background: n.is_read ? 'transparent' : 'rgba(25,135,84,0.05)', cursor: 'pointer' }}
                          >
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: n.is_read ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: n.is_read ? 400 : 500 }}>{n.message}</p>
                            <small style={{ color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString('id-ID')}</small>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada notifikasi</div>
                      )}
                    </div>
                  </div>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', cursor: 'pointer' }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                {user && user.profile_pic ? (
                  <img src={`${import.meta.env.VITE_API_URL}${user.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user ? user.name.charAt(0).toUpperCase() : 'A'
                )}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user ? user.name : 'Admin OIER'}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user ? user.role : 'Super Admin'}</p>
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '50px', right: 0, background: 'white', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', 
                  overflow: 'hidden', minWidth: '150px', zIndex: 10
                }}>
                  <Link to="/profile" style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee' }}>Profil Saya</Link>
                  <a href="#" onClick={handleLogout} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: '#ff4757' }}>Keluar</a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Route */}
        <Outlet />
      </div>
    </div>
  );
}
