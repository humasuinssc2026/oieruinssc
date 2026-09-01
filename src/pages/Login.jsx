import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../utils/Store';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
            <input 
              type="password" 
              placeholder="admin" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>Masuk</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
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
