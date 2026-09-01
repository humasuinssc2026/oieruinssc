import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#212529',
      color: 'white',
      padding: '5rem 2rem 2rem',
      borderTop: '5px solid var(--primary)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '4rem',
        marginBottom: '3rem'
      }}>
        {/* Brand & Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img 
              src="/logouinssc.png" 
              alt="Logo UINSSC" 
              style={{ height: '50px', background: 'white', padding: '0.2rem', borderRadius: '8px' }}
            />
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem' }}>OIER UINSSC</h3>
          </div>
          <p style={{ color: '#adb5bd', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Platform Open Islamic Education Resources untuk mendukung digitalisasi dan keterbukaan akses pendidikan di lingkungan UIN Siber Syekh Nurjati Cirebon.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background='var(--primary)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background='var(--primary)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background='var(--primary)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background='var(--primary)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Hubungi Kami</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <li style={{ display: 'flex', gap: '1rem', color: '#adb5bd', alignItems: 'flex-start' }}>
              <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Jl. Perjuangan Bypass Sunyaragi, <br/>Kesambi, Kota Cirebon, <br/>Jawa Barat 45132</span>
            </li>
            <li style={{ display: 'flex', gap: '1rem', color: '#adb5bd', alignItems: 'center' }}>
              <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.95rem' }}>+62 231 481264</span>
            </li>
            <li style={{ display: 'flex', gap: '1rem', color: '#adb5bd', alignItems: 'center' }}>
              <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.95rem' }}>info@syekhnurjati.ac.id</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Tautan Cepat</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li><Link to="/about" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Tentang Kami</Link></li>
            <li><Link to="/faculties" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Jelajah Fakultas</Link></li>
            <li><Link to="/videos" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Video Edukasi</Link></li>
            <li><Link to="/contact" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Pusat Bantuan (FAQ)</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <li><Link to="/terms" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Syarat & Ketentuan</Link></li>
            <li><Link to="/privacy" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Kebijakan Privasi</Link></li>
            <li><Link to="/copyright" style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#adb5bd'}>Hak Cipta</Link></li>
          </ul>
        </div>
      </div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        color: '#adb5bd',
        fontSize: '0.9rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} OIER UIN Siber Syekh Nurjati Cirebon. Hak Cipta Dilindungi.</p>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Dikembangkan untuk memajukan pendidikan Islam yang terbuka dan inklusif.</p>
      </div>
    </footer>
  );
}
