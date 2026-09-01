import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      toast.error('Harap isi Nama Depan, Email, dan Kata Sandi');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, role })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Pendaftaran berhasil! Silakan masuk.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan saat menghubungi server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      
      {/* Image/Brand Side */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'white', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 2rem' }}>
            OIER
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Bergabung Bersama Kami.</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Jadilah bagian dari komunitas pembelajar UIN Siber Syekh Nurjati Cirebon.</p>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Daftar Akun Baru</h1>
          <p style={{ color: 'var(--text-muted)' }}>Lengkapi data di bawah untuk membuat akun OIER.</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nama Depan</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Budi" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nama Belakang</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Santoso" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Peran Pengguna</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none', background: 'white' }}>
              <option value="guest">Pengunjung Umum (Guest)</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen / Tenaga Pendidik</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contoh@syekhnurjati.ac.id" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kata Sandi</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Buat kata sandi yang kuat" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem', outline: 'none' }} />
          </div>
          
          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Sudah punya akun? <Link to="/login" style={{ fontWeight: 600 }}>Masuk di sini</Link>
        </p>
      </div>

    </div>
  );
}
