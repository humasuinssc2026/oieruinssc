import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, Moon, Sun, Bell, Check, Languages, ChevronDown, Phone, Mail, MapPin, Search, TrendingUp, Settings } from 'lucide-react';
import { useAppContext } from '../utils/Store';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const { videos, user, theme, toggleTheme, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLang, setCurrentLang] = useState('ID');
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = notifications ? notifications.filter(n => !n.is_read).length : 0;

  React.useEffect(() => {
    const match = document.cookie.match(/googtrans=\/id\/([a-z]{2})/);
    if (match && match[1]) {
      const lang = match[1].toUpperCase();
      if (lang === 'EN') setCurrentLang('EN');
      else if (lang === 'AR') setCurrentLang('AR');
    }
  }, []);

  const changeLanguage = (langCode, langName) => {
    setCurrentLang(langName);
    setShowLangMenu(false);
    
    if (langCode === 'id') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
      window.location.reload();
      return;
    }

    document.cookie = `googtrans=/id/${langCode}; path=/;`;
    document.cookie = `googtrans=/id/${langCode}; domain=${window.location.hostname}; path=/;`;
    
    const gtSelect = document.querySelector('.goog-te-combo');
    if (gtSelect) {
      gtSelect.value = langCode;
      gtSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      window.location.reload();
    }
  };

  const trendingVideos = [...(videos || [])]
    .filter(v => v.type === 'video')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <header style={{
      width: '100%',
      position: 'relative',
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* 1. TOP BAR */}
      <div style={{ 
        background: '#1d4d33', /* Hijau tua */
        color: '#ffffff', 
        padding: '0.4rem 4%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '0.75rem', 
        flexWrap: 'wrap', 
        gap: '0.5rem' 
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={14} color="#eab308" /> oier@uinssc.ac.id
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <MapPin size={14} color="#eab308" /> Jl. Perjuangan ByPass Sunyaragi, Kec. Kesambi, Kota Cirebon, Jawa Barat 45132
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{ 
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
                cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem'
              }}
            >
              <img src={`https://flagcdn.com/w20/${currentLang === 'EN' ? 'gb' : currentLang === 'AR' ? 'sa' : 'id'}.png`} width="16" alt={currentLang} /> 
              {currentLang} <ChevronDown size={12} />
            </button>
            {showLangMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '5px',
                  width: '120px', background: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                  borderRadius: '4px', overflow: 'hidden', zIndex: 100
                }}>
                  <button onClick={() => changeLanguage('id', 'ID')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', borderBottom: '1px solid #eee', cursor: 'pointer', color: '#333', width: '100%', textAlign: 'left' }}>
                    <img src="https://flagcdn.com/w20/id.png" width="16" alt="ID" /> ID
                  </button>
                  <button onClick={() => changeLanguage('en', 'EN')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', borderBottom: '1px solid #eee', cursor: 'pointer', color: '#333', width: '100%', textAlign: 'left' }}>
                    <img src="https://flagcdn.com/w20/gb.png" width="16" alt="EN" /> EN
                  </button>
                  <button onClick={() => changeLanguage('ar', 'AR')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#333', width: '100%', textAlign: 'left' }}>
                    <img src="https://flagcdn.com/w20/sa.png" width="16" alt="AR" /> AR
                  </button>
                </div>
              )}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ background: '#fff', border: 'none', cursor: 'pointer', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', borderRadius: '50%', width: '24px', height: '24px' }}
            title="Toggle Tema"
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Notifications */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: '#fff', border: 'none', cursor: 'pointer', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', borderRadius: '50%', width: '24px', height: '24px', position: 'relative' }}
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'red', color: 'white', fontSize: '10px', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '-80px', marginTop: '8px', width: '300px', background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 100, overflow: 'hidden', textAlign: 'left' }}>
                  <div style={{ padding: '10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>Notifikasi</span>
                    {unreadCount > 0 && (
                      <button onClick={() => { markAllNotificationsAsRead(); setShowNotifications(false); }} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer' }}>Tandai semua dibaca</button>
                    )}
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications && notifications.length > 0 ? (
                      notifications.slice(0, 5).map(notif => (
                        <div key={notif.id} onClick={() => markNotificationAsRead(notif.id)} style={{ padding: '10px', borderBottom: '1px solid var(--border)', background: notif.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.05)', cursor: 'pointer' }}>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: notif.is_read ? 'normal' : 'bold' }}>{notif.message}</p>
                          <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{new Date(notif.created_at).toLocaleDateString()}</small>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Belum ada notifikasi.</div>
                    )}
                  </div>
                  <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <Link to="/notifications" onClick={() => setShowNotifications(false)} style={{ color: '#eab308', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 'bold' }}>Lihat Semua Notifikasi</Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Panel Link */}
          {user && user.role === 'admin' && (
             <Link to="/admin" style={{ background: '#3b82f6', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
               <Settings size={14} /> ADMIN
             </Link>
          )}

          {/* Login / Register */}
          {user ? (
            <Link to="/profile" style={{ background: '#eab308', color: '#fff', padding: '0.3rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} /> ACCOUNT
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <Link to="/login" style={{ background: '#eab308', color: '#fff', padding: '0.3rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                 LOGIN / REGISTER
               </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. MIDDLE BAR */}
      <div style={{ 
        background: 'var(--bg)', 
        padding: '0.8rem 4%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
          <img src="/logouinssc.png" alt="Logo UINSSC" style={{ height: '40px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4d33', lineHeight: 1.1, textTransform: 'uppercase' }}>OPEN ISLAMIC EDUCATION RESOURCES</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>UIN SIBER SYEKH NURJATI CIREBON</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" className="top-nav-link">BERANDA</Link>
          <Link to="/faculties" className="top-nav-link">FAKULTAS <ChevronDown size={14}/></Link>
          <Link to="/videos" className="top-nav-link">VIDEOS</Link>
          <Link to="/faq" className="top-nav-link">FAQS</Link>
        </nav>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="desktop-search">
            <GlobalSearch />
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* 3. BOTTOM BAR (TRENDING) */}
      <div style={{ 
        background: '#143621', 
        color: '#fff', 
        padding: '0.4rem 4%', 
        fontSize: '0.8rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        overflow: 'hidden'
      }}>
        <div style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', whiteSpace: 'nowrap', zIndex: 2, background: '#143621', paddingRight: '1rem' }}>
          <TrendingUp size={14} /> TRENDING
        </div>
        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', display: 'flex', alignItems: 'center' }}>
           <div className="marquee-text" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
             {trendingVideos.length > 0 ? (
               trendingVideos.map((v, i) => (
                 <span key={i}>
                   <span style={{ color: '#ef4444', marginRight: '0.3rem', marginLeft: '2rem' }}>&#9654;</span> 
                   <Link to={`/videos?v=${v.id}`} style={{ color: '#fff', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.textDecoration='underline'} onMouseOut={(e) => e.target.style.textDecoration='none'}>
                     {v.title}
                   </Link>
                 </span>
               ))
             ) : (
               <span style={{ marginLeft: '2rem' }}>Memuat video trending...</span>
             )}
           </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" style={{ background: 'var(--bg)' }}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 600, padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>BERANDA</Link>
          <Link to="/faculties" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 600, padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>FAKULTAS</Link>
          <Link to="/videos" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 600, padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>VIDEOS</Link>
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 600, padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>FAQS</Link>
        </div>
      )}
    </header>
  );
}

