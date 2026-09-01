import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, Moon, Sun, Bell, Check, Languages, ChevronDown } from 'lucide-react';
import { useAppContext } from '../utils/Store';

export default function Header() {
  const { user, theme, toggleTheme, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('ID');

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
  
  const unreadCount = notifications ? notifications.filter(n => !n.is_read).length : 0;

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      position: 'sticky',
      top: '15px',
      zIndex: 100,
      width: '95%',
      maxWidth: '1400px',
      margin: '0 auto',
      borderRadius: '24px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo Area */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
          <img 
            src="/logouinssc.png" 
            alt="Logo UINSSC" 
            style={{
              height: '45px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ whiteSpace: 'nowrap' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-dark)', lineHeight: 1.2 }}>UIN Siber Syekh Nurjati Cirebon</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Islamic Education Resources</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" className="nav-link">Beranda</Link>

          <Link to="/faculties" className="nav-link">Fakultas</Link>
          <Link to="/videos" className="nav-link">Video</Link>
          <Link to="/faq" className="nav-link">FAQ</Link>
          
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem', alignItems: 'center' }}>
            


            <button 
              onClick={toggleTheme}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
              title="Toggle Tema Gelap/Terang"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Switcher */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                style={{ 
                  background: 'transparent', border: '1px solid var(--surface-hover)', 
                  cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem'
                }}
              >
                <img 
                  src={`https://flagcdn.com/w20/${currentLang === 'EN' ? 'gb' : currentLang === 'AR' ? 'sa' : 'id'}.png`} 
                  width="20" 
                  alt={currentLang} 
                  style={{ borderRadius: '2px' }} 
                /> 
                {currentLang} <ChevronDown size={14} />
              </button>
              
              {showLangMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                  width: '160px', background: 'var(--surface-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                  borderRadius: '12px', overflow: 'hidden', zIndex: 100, border: '1px solid var(--surface-hover)',
                  display: 'flex', flexDirection: 'column'
                }}>
                  <button onClick={() => changeLanguage('id', 'ID')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--surface-hover)', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600, textAlign: 'left' }}>
                    <img src="https://flagcdn.com/w20/id.png" srcSet="https://flagcdn.com/w40/id.png 2x" width="20" alt="Indonesia" style={{ borderRadius: '2px' }} /> INDONESIA
                  </button>
                  <button onClick={() => changeLanguage('en', 'EN')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--surface-hover)', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600, textAlign: 'left' }}>
                    <img src="https://flagcdn.com/w20/gb.png" srcSet="https://flagcdn.com/w40/gb.png 2x" width="20" alt="English" style={{ borderRadius: '2px' }} /> ENGLISH
                  </button>
                  <button onClick={() => changeLanguage('ar', 'AR')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600, textAlign: 'left' }}>
                    <img src="https://flagcdn.com/w20/sa.png" srcSet="https://flagcdn.com/w40/sa.png 2x" width="20" alt="Arabic" style={{ borderRadius: '2px' }} /> ARABIC
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <Link to="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', whiteSpace: 'nowrap' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                  {user.profile_pic ? (
                    <img src={`${import.meta.env.VITE_API_URL}${user.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <span style={{ fontWeight: 500 }}>Profil Saya</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>Masuk</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Daftar</Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 500, borderBottom: '1px solid var(--surface-hover)', paddingBottom: '0.5rem' }}>Beranda</Link>

          <Link to="/faculties" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 500, borderBottom: '1px solid var(--surface-hover)', paddingBottom: '0.5rem' }}>Fakultas</Link>
          <Link to="/videos" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 500, borderBottom: '1px solid var(--surface-hover)', paddingBottom: '0.5rem' }}>Video</Link>
          <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-main)', fontWeight: 500, borderBottom: '1px solid var(--surface-hover)', paddingBottom: '0.5rem' }}>FAQ</Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tema Gelap</span>
            <button 
              onClick={toggleTheme}
              style={{ background: 'var(--surface-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '50%' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {user ? (
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <User size={18} /> Profil Saya
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-outline" style={{ textAlign: 'center' }}>Masuk</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
