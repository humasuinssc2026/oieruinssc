import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Share2, BookmarkPlus, ArrowLeft, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../utils/Store';

export default function MaterialDetail() {
  const { id } = useParams();
  const { documents } = useAppContext();
  
  const doc = documents.find(d => d.id.toString() === id) || {
    title: "Dokumen Tidak Ditemukan",
    author: "Unknown",
    category: "Unknown",
    time: "-"
  };

  const [activePartId, setActivePartId] = useState(null);

  const playingUrl = activePartId && doc.parts
    ? doc.parts.find(p => p.id === activePartId)?.url
    : doc.file_url;

  const handleDownload = () => {
    alert("Ini adalah simulasi fitur unduh. Dokumen sebenarnya tidak tersedia di penyimpanan lokal.");
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Back button */}
        <Link to="/general-studies" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Kembali ke Daftar Materi
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Main Viewer Area */}
          <div style={{ background: 'white', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E9ECEF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="var(--primary)" size={20} /> Preview Dokumen
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><ChevronLeft /></button>
                <span>Halaman 1 / 45</span>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><ChevronRight /></button>
              </div>
            </div>
            
            {/* Mockup PDF Viewer */}
            <div style={{ width: '100%', height: '700px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ width: '80%', height: '90%', background: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.1)', padding: '3rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'black' }}>
                  {activePartId && doc.parts ? doc.parts.find(p => p.id === activePartId)?.title.toUpperCase() : doc.title.toUpperCase()}
                </h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '4rem' }}>Oleh: {doc.author}</p>
                <div style={{ height: '20px', background: '#f1f3f5', marginBottom: '1rem', width: '100%' }}></div>
                <div style={{ height: '20px', background: '#f1f3f5', marginBottom: '1rem', width: '90%' }}></div>
                <div style={{ height: '20px', background: '#f1f3f5', marginBottom: '1rem', width: '95%' }}></div>
                <div style={{ height: '20px', background: '#f1f3f5', marginBottom: '1rem', width: '85%' }}></div>
                <div style={{ height: '20px', background: '#f1f3f5', marginBottom: '1rem', width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div style={{ background: 'white', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', padding: '2rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(25,135,84,0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
              {doc.category.toUpperCase()}
            </span>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', lineHeight: 1.3 }}>{doc.title}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Dokumen materi bacaan untuk mendukung proses pembelajaran mandiri mahasiswa.</p>

            {doc.parts && doc.parts.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid #e9ecef', paddingBottom: '0.5rem' }}>Daftar Modul</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div 
                    onClick={() => setActivePartId(null)}
                    style={{ padding: '0.75rem', background: activePartId === null ? '#e8f5e9' : '#f8f9fa', borderRadius: '6px', border: activePartId === null ? '1px solid var(--primary)' : '1px solid #e9ecef', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activePartId === null ? '600' : '500', color: activePartId === null ? 'var(--primary)' : 'inherit' }}
                  >
                    Bagian 1: Utama
                  </div>
                  {doc.parts.map((part, idx) => (
                    <div 
                      key={part.id}
                      onClick={() => setActivePartId(part.id)}
                      style={{ padding: '0.75rem', background: activePartId === part.id ? '#e8f5e9' : '#f8f9fa', borderRadius: '6px', border: activePartId === part.id ? '1px solid var(--primary)' : '1px solid #e9ecef', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activePartId === part.id ? '600' : '500', color: activePartId === part.id ? 'var(--primary)' : 'inherit' }}
                    >
                      Bagian {idx + 2}: {part.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Penulis / Dosen</span>
                <strong>{doc.author}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tanggal Unggah</span>
                <strong>{doc.time}</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lisensi</span>
                <strong>Creative Commons (CC BY-NC)</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ukuran File</span>
                <strong>2.4 MB (PDF)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href={playingUrl ? `${import.meta.env.VITE_API_URL}${playingUrl}` : '#'} download className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={(e) => { if(!playingUrl) { e.preventDefault(); handleDownload(); } }}>
                <Download size={18} /> Unduh Modul
              </a>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }}>
                  <BookmarkPlus size={18} /> Simpan
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }}>
                  <Share2 size={18} /> Bagikan
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
