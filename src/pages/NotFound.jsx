import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-color)',
      padding: '2rem'
    }}>
      <Helmet>
        <title>404 Halaman Tidak Ditemukan | OIER UIN Siber</title>
      </Helmet>

      <div style={{ 
        textAlign: 'center', 
        maxWidth: '500px', 
        background: 'var(--surface-color)', 
        padding: '3rem', 
        borderRadius: '16px', 
        boxShadow: 'var(--shadow-md)' 
      }}>
        <AlertCircle size={80} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.9 }} />
        <h1 style={{ color: 'var(--text-main)', fontSize: '4rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>404</h1>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Halaman Tidak Ditemukan</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.5rem', 
            textDecoration: 'none' 
          }}
        >
          <ArrowLeft size={20} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
