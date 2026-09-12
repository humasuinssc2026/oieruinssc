import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Video, Save, X, PlusCircle } from 'lucide-react';
import { useAppContext } from '../utils/Store';
import { toast } from 'sonner';

export default function UploadMaterial() {
  const { user, token } = useAppContext();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'document',
    category_slug: '',
    author: user ? `${user.first_name} ${user.last_name}` : '',
    url: '',
    module_url: '',
    mata_kuliah: '',
    kode_mata_kuliah: ''
  });
  
  const [documentFile, setDocumentFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const data = await res.json();
        if (data.success) {
          // Flatten fakultas and prodi into one array for easier selection
          const allCategories = [
            ...data.data.fakultasList.map(f => ({ name: f.name, slug: f.slug, type: 'Fakultas' })),
            ...data.data.prodiList.map(p => ({ name: p.name, slug: p.slug, type: 'Prodi' }))
          ];
          setCategories(allCategories);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    
    fetchCategories();
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'document') setDocumentFile(file);
    if (type === 'thumbnail') setThumbnailFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });
      
      if (documentFile) data.append('document_file', documentFile);
      if (thumbnailFile) data.append('thumbnail_file', thumbnailFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: data
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Materi berhasil diunggah! Menunggu review admin (jika berlaku).");
        navigate('/profile');
      } else {
        toast.error(result.message || "Gagal mengunggah materi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 2rem' }}>
      <Helmet>
        <title>Unggah Materi | OIER UIN Siber</title>
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'var(--surface-color)', padding: '2.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ background: 'rgba(25,135,84,0.1)', color: 'var(--primary)', padding: '0.8rem', borderRadius: '50%' }}>
              <Upload size={28} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Unggah Materi Baru</h1>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>Bagikan pengetahuan Anda kepada komunitas OIER.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Tipe Materi */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Tipe Materi *</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ flex: 1, border: formData.type === 'document' ? '2px solid var(--primary)' : '1px solid var(--border)', background: formData.type === 'document' ? 'rgba(25,135,84,0.05)' : 'transparent', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="radio" name="type" value="document" checked={formData.type === 'document'} onChange={handleChange} style={{ display: 'none' }} />
                  <FileText size={24} color={formData.type === 'document' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 600, color: formData.type === 'document' ? 'var(--primary)' : 'var(--text-main)' }}>Dokumen / PDF</span>
                </label>
                <label style={{ flex: 1, border: formData.type === 'video' ? '2px solid var(--primary)' : '1px solid var(--border)', background: formData.type === 'video' ? 'rgba(25,135,84,0.05)' : 'transparent', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input type="radio" name="type" value="video" checked={formData.type === 'video'} onChange={handleChange} style={{ display: 'none' }} />
                  <Video size={24} color={formData.type === 'video' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 600, color: formData.type === 'video' ? 'var(--primary)' : 'var(--text-main)' }}>Video Pembelajaran</span>
                </label>
              </div>
            </div>

            {/* Judul & Kategori */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Judul Materi *</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  placeholder="Contoh: Pengantar Ilmu Hukum"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Kategori (Program Studi/Fakultas) *</label>
                <select 
                  name="category_slug" value={formData.category_slug} onChange={handleChange} required
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none', background: 'transparent' }}
                >
                  <option value="">-- Pilih Kategori --</option>
                  <option value="kategori-umum">Umum</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.slug}>{cat.name} ({cat.type})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mata Kuliah & Kode */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Mata Kuliah (Opsional)</label>
                <input 
                  type="text" name="mata_kuliah" value={formData.mata_kuliah} onChange={handleChange}
                  placeholder="Nama Mata Kuliah"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Kode MK</label>
                <input 
                  type="text" name="kode_mata_kuliah" value={formData.kode_mata_kuliah} onChange={handleChange}
                  placeholder="Contoh: MK101"
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Penulis/Dosen */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Nama Dosen/Pembuat *</label>
              <input 
                type="text" name="author" value={formData.author} onChange={handleChange} required
                style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            {/* File Uploads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed var(--border)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {formData.type === 'video' ? 'File Video (MP4) Opsional' : 'File Dokumen (PDF, DOC) *'}
                </label>
                <input 
                  type="file" accept={formData.type === 'video' ? 'video/mp4' : '.pdf,.doc,.docx,.ppt,.pptx'} 
                  onChange={(e) => handleFileChange(e, 'document')} 
                  required={formData.type === 'document' && !formData.url}
                  style={{ width: '100%', fontSize: '0.9rem' }}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Maks 50MB</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Thumbnail / Cover (Opsional)</label>
                <input 
                  type="file" accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'thumbnail')} 
                  style={{ width: '100%', fontSize: '0.9rem' }}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Gambar format JPG/PNG, Maks 5MB</small>
              </div>
            </div>

            {/* External URLs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>URL Eksternal (YouTube/Drive) Opsional</label>
                <input 
                  type="url" name="url" value={formData.url} onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>URL Modul Tambahan (Opsional)</label>
                <input 
                  type="url" name="module_url" value={formData.module_url} onChange={handleChange}
                  placeholder="Tautan referensi luar..."
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => navigate(-1)} style={{ padding: '0.8rem 2rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.8rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isSubmitting ? 'Mengunggah...' : <><Save size={18} /> Simpan Materi</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
