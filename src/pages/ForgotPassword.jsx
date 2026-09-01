import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      import('sonner').then(m => m.toast.error("Silakan masukkan email Anda"));
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage(data.message);
        import('sonner').then(m => m.toast.success("Tautan terkirim!"));
        if (data.reset_token) {
          console.log("SIMULASI TOKEN RESET:", data.reset_token);
        }
      } else {
        import('sonner').then(m => m.toast.error(data.message || "Email tidak ditemukan"));
      }
    } catch (error) {
      import('sonner').then(m => m.toast.error("Terjadi kesalahan sistem"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
      <Helmet>
        <title>Lupa Sandi | OIER UIN Siber</title>
      </Helmet>

      <div style={{ width: '100%', maxWidth: '400px', background: 'var(--surface-color)', padding: '2.5rem 2rem', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
        
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Kembali ke Masuk
        </Link>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Lupa Sandi?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>

        {message && (
          <div style={{ padding: '1rem', background: 'rgba(25,135,84,0.1)', color: 'var(--primary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 500 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '8px',
                  border: '1px solid var(--surface-hover)', background: 'var(--bg-color)',
                  color: 'var(--text-main)', outline: 'none'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
          >
            {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
          </button>
        </form>
      </div>
    </div>
  );
}
