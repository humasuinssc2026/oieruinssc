import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../utils/Store';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { loginAdmin } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        loginAdmin(data.user, data.token); // Adjust loginAdmin to accept user data and token
        navigate(data.user.role === 'admin' || data.user.role === 'superadmin' ? '/admin' : '/');
      } else {
        setError(data.message || 'Email atau kata sandi salah.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Selamat Datang Kembali</h1>
          <p style={{ color: 'var(--text-muted)' }}>Masuk ke akun OIER UIN Siber Anda.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div style={{ padding: '1rem', background: '#ffe3e3', color: '#ff4757', borderRadius: '8px' }}>
              {error}
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username / Email</label>
            <input 
              type="text" 
              placeholder="admin" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 500 }}>
              <span>Kata Sandi</span>
              <a href="#" style={{ fontSize: '0.85rem' }}>Lupa Kata Sandi?</a>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="admin" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '1rem', paddingRight: '3rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>Masuk</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#ced4da' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Atau masuk dengan</span>
          <div style={{ flex: 1, height: '1px', background: '#ced4da' }}></div>
        </div>
        
        <button 
          type="button" 
          className="btn" 
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
          style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 500, background: 'white', color: '#333', border: '1px solid #ced4da', borderRadius: '8px', cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Masuk dengan Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Belum punya akun? <Link to="/register" style={{ fontWeight: 600 }}>Daftar sekarang</Link>
        </p>
      </div>

      {/* Image/Brand Side */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'white', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 2rem' }}>
            OIER
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Pendidikan Terbuka untuk Semua.</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Akses ribuan materi kuliah, jurnal, dan video pembelajaran dari UIN Siber Syekh Nurjati Cirebon.</p>
        </div>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
      </div>
    </div>
  );
}
