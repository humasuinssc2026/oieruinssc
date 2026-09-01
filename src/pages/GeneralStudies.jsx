import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, FileText, Download, Clock, Eye } from 'lucide-react';

import { useAppContext } from '../utils/Store';

export default function GeneralStudies() {
  const { documents } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ['Semua', 'kategori-umum'];

  // Map slugs to readable names for tabs
  const categoryNames = {
    "Semua": "Semua",
    "kategori-umum": "Kategori Umum"
  };

  const filteredMaterials = activeCategory === "Semua" 
    ? documents 
    : documents.filter(mat => mat.category === activeCategory);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', padding: '2rem' }}>
      <Helmet>
        <title>Materi Teks & Jurnal | OIER UIN Siber</title>
        <meta name="description" content="Baca dan unduh materi kuliah, dokumen, dan jurnal secara gratis dari OIER UIN Siber Syekh Nurjati Cirebon." />
      </Helmet>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header & Search */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Materi Umum Keislaman</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Akses ribuan materi dasar kajian Islam secara terbuka.</p>
          
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', padding: '0.5rem 1.5rem', borderRadius: '50px', boxShadow: 'var(--shadow-sm)' }}>
              <Search color="var(--text-muted)" size={20} />
              <input type="text" placeholder="Cari judul materi atau penulis..." style={{ border: 'none', outline: 'none', padding: '0.5rem 1rem', width: '100%', fontSize: '1rem' }} />
            </div>
            <button className="btn btn-outline" style={{ background: 'white' }}><Filter size={20} /> Filter</button>
          </div>
        </div>

        {/* Categories Tab */}
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat;
            return (
              <button 
                key={i} 
                onClick={() => setActiveCategory(cat)}
                className={`btn ${isActive ? 'btn-primary' : ''}`} 
                style={{ 
                  background: isActive ? 'var(--primary)' : 'white',
                  color: isActive ? 'white' : 'var(--text-main)',
                  border: isActive ? 'none' : '1px solid #E9ECEF',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}>
                {categoryNames[cat] || cat}
              </button>
            )
          })}
        </div>

        {/* Material Grid */}
        {filteredMaterials.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {filteredMaterials.map((mat) => (
              <div key={mat.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)', display: 'flex', flexDirection: 'column' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ background: 'var(--primary-dark)', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
                  <FileText size={80} />
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{mat.category}</span>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', lineHeight: 1.4 }}>{mat.title}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {mat.mata_kuliah || 'Mata Kuliah Umum'} {mat.kode_mata_kuliah ? `(${mat.kode_mata_kuliah})` : ''}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>Dosen: {mat.author}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E9ECEF', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Eye size={14} /> {mat.views || 0}
                    </div>
                    {mat.file_url ? (
                      <button 
                        onClick={() => {
                          fetch(`${import.meta.env.VITE_API_URL}/api/materials/${mat.id}/view`, { method: 'POST' }).catch(console.error);
                          window.open(`${import.meta.env.VITE_API_URL}${mat.file_url}`, '_blank');
                        }}
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      >
                        Baca PDF
                      </button>
                    ) : (
                      <Link to={`/material/${mat.id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Baca PDF</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Belum ada materi di kategori ini.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
