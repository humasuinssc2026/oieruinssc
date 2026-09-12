import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAppContext } from '../utils/Store';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { user, token, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle size={20} color="#10b981" />;
      case 'warning': return <AlertTriangle size={20} color="#f59e0b" />;
      case 'error': return <AlertCircle size={20} color="#ef4444" />;
      default: return <Info size={20} color="#3b82f6" />;
    }
  };

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
  };

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 2rem' }}>
      <Helmet>
        <title>Notifikasi Saya | OIER UIN Siber</title>
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <h2 style={{ color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={24} color="var(--primary)" /> Notifikasi
          </h2>
          
          {notifications && notifications.some(n => !n.is_read) && (
            <button onClick={handleMarkAll} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }} onMouseOver={e=> {e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.color='white';}} onMouseOut={e=> {e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--primary)';}}>
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications && notifications.length > 0 ? (
            notifications.map(notif => (
              <div key={notif.id} onClick={() => markNotificationAsRead(notif.id)} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: notif.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.05)', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateX(5px)'} onMouseOut={e=>e.currentTarget.style.transform='translateX(0)'}>
                <div style={{ marginTop: '0.2rem' }}>
                  {getIcon(notif.type || 'info')}
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontWeight: notif.is_read ? 400 : 600, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Bell size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)' }}>Anda tidak memiliki notifikasi saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
