import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, FileText, Video, X, UploadCloud, List, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../utils/Store';

export default function ContentManager() {
  const { videos, documents, addVideo, addDocument, loadMoreMaterials, hasMoreMaterials, fetchMaterials } = useAppContext();
  
  const refreshMaterials = () => {
    fetchMaterials(1, false);
  };

  const [activeTab, setActiveTab] = useState('video'); // default to video
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState('video'); // default to video

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formMataKuliah, setFormMataKuliah] = useState('');
  const [formKodeMataKuliah, setFormKodeMataKuliah] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formModuleUrl, setFormModuleUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [fakultasList, setFakultasList] = useState([]);
  const [prodiList, setProdiList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const data = await res.json();
        if (data.success) {
          setFakultasList(data.data.fakultasList);
          setProdiList(data.data.prodiList);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [activePlaylistMaterial, setActivePlaylistMaterial] = useState(null);
  const [newPartTitle, setNewPartTitle] = useState('');
  const [newPartUrl, setNewPartUrl] = useState('');
  const [newPartModuleUrl, setNewPartModuleUrl] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus materi ini?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          toast.success('Materi berhasil dihapus');
          refreshMaterials();
        } else {
          toast.error('Gagal menghapus: ' + data.message);
        }
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const openPlaylistModal = (material) => {
    setActivePlaylistMaterial(material);
    setIsPlaylistModalOpen(true);
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!newPartTitle) return;

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', newPartTitle);
    formData.append('part_number', (activePlaylistMaterial.parts?.length || 0) + 2);

    if (activePlaylistMaterial.type === 'video') {
      if (!newPartUrl) { toast.error('URL wajib diisi'); setIsSubmitting(false); return; }
      formData.append('url', newPartUrl);
      if (newPartModuleUrl) {
        formData.append('module_url', newPartModuleUrl);
      }
    } else {
      if (!newPartUrl) { toast.error('URL File PDF wajib diisi'); setIsSubmitting(false); return; }
      formData.append('url', newPartUrl);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${activePlaylistMaterial.id}/parts`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setNewPartTitle('');
        setNewPartUrl('');
        setNewPartModuleUrl('');
        refreshMaterials();
        setActivePlaylistMaterial(prev => ({
          ...prev,
          parts: [...(prev.parts || []), data.part]
        }));
        toast.success('Bagian berhasil ditambahkan');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm('Hapus bagian ini?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/parts/${partId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        refreshMaterials();
        setActivePlaylistMaterial(prev => ({
          ...prev,
          parts: prev.parts.filter(p => p.id !== partId)
        }));
        toast.success('Bagian berhasil dihapus');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openUploadModal = () => {
    setFormTitle('');
    setFormCategory('');
    setFormAuthor('');
    setFormMataKuliah('');
    setFormKodeMataKuliah('');
    setFormUrl('');
    setFormModuleUrl('');
    setFormThumbnail(null);
    setIsModalOpen(true);
  };

  const openEditModal = (material) => {
    setEditingMaterial(material);
    setFormTitle(material.title);
    setFormCategory(material.category || material.category_slug);
    setFormAuthor(material.author);
    setFormMataKuliah(material.mata_kuliah || '');
    setFormKodeMataKuliah(material.kode_mata_kuliah || '');
    setFormUrl(material.type === 'video' ? material.file_url : '');
    setFormModuleUrl(material.module_url || '');
    setFormThumbnail(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formCategory || !formAuthor) {
      toast.error("Harap isi semua field teks!");
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('category', formCategory);
    formData.append('author', formAuthor);
    formData.append('mata_kuliah', formMataKuliah);
    formData.append('kode_mata_kuliah', formKodeMataKuliah);
    
    if (editingMaterial.type === 'video' && formUrl) {
      formData.append('url', formUrl);
    }
    if (formModuleUrl !== undefined && formModuleUrl !== null) {
      formData.append('module_url', formModuleUrl);
    }
    if (formThumbnail) {
      formData.append('thumbnail_file', formThumbnail);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${editingMaterial.id}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Materi berhasil diubah');
        setIsEditModalOpen(false);
        refreshMaterials();
      } else {
        toast.error('Gagal mengubah: ' + data.message);
      }
    } catch (err) {
      console.error('Edit error', err);
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formCategory || !formAuthor) {
      toast.error("Mohon isi semua bidang yang wajib.");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('category_slug', formCategory);
    formData.append('author', formAuthor);
    formData.append('mata_kuliah', formMataKuliah);
    formData.append('kode_mata_kuliah', formKodeMataKuliah);

    if (uploadType === 'text') {
      if (!formModuleUrl) {
        toast.error("Mohon masukkan tautan modul pendukung.");
        setIsSubmitting(false);
        return;
      }
      formData.append('type', 'document');
      formData.append('module_url', formModuleUrl);
    } else {
      if (!formUrl) {
        toast.error("Mohon masukkan URL Video.");
        setIsSubmitting(false);
        return;
      }
      formData.append('type', 'video');
      formData.append('url', formUrl);
      if (formModuleUrl) {
        formData.append('module_url', formModuleUrl);
      }
      if (formThumbnail) {
        formData.append('thumbnail_file', formThumbnail);
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (uploadType === 'text') {
          addDocument({ title: formTitle, category: formCategory, author: formAuthor, type: 'pdf' });
          toast.success("Dokumen berhasil ditambahkan ke database!");
        } else {
          addVideo({ title: formTitle, category: formCategory, author: formAuthor, url: formUrl, type: 'video' });
          toast.success("Video berhasil ditambahkan ke database!");
        }
        
        setIsModalOpen(false);
        setFormTitle('');
        setFormCategory('');
        setFormAuthor('');
        setFormMataKuliah('');
        setFormKodeMataKuliah('');
        setFormUrl('');
        setFormModuleUrl('');
        setFormThumbnail(null);
      } else {
        toast.error("Gagal menyimpan data: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Terjadi kesalahan jaringan atau server tidak merespons. Pastikan backend berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeContent = (activeTab === 'text' ? documents : videos).filter(item => {
    let matchesSearch = true;
    let matchesCategory = true;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch = (item.title && item.title.toLowerCase().includes(query)) ||
                      (item.author && item.author.toLowerCase().includes(query));
    }
    
    if (filterCategory) {
      matchesCategory = item.category === filterCategory || item.category_slug === filterCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-content" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Manajemen Konten</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Kelola semua materi teks, modul, dan video pembelajaran.</p>
        </div>
        <button className="btn btn-primary" onClick={openUploadModal}>
          <Plus size={18} /> Tambah Konten Baru
        </button>
      </div>



      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#F8F9FA', padding: '0.5rem 1rem', borderRadius: '6px', width: '350px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan judul atau penulis..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', outline: 'none', width: '100%' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none', background: 'white' }}
          >
            <option value="">Semua Kategori</option>
            <option value="kategori-umum">Kategori Umum</option>
            {fakultasList.map(fakultas => (
              <optgroup key={fakultas.id} label={fakultas.name}>
                {prodiList.filter(p => p.fakultasId === fakultas.id).map(prodi => {
                  const slug = prodi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <option key={prodi.id} value={slug}>
                      {prodi.name}
                    </option>
                  )
                })}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="admin-table-container" style={{ marginTop: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul Video</th>
              <th>Kategori / Fakultas</th>
              <th>Mata Kuliah</th>
              <th>Dosen Pengampu</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Views</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {activeContent.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>{item.title}</td>
                <td>{item.category.toUpperCase()}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.mata_kuliah || '-'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.kode_mata_kuliah || '-'}</div>
                </td>
                <td>{item.author}</td>
                <td>{item.time}</td>
                <td><span className="status-badge status-published">Aktif</span></td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f8f9fa', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <Eye size={14} /> {item.views || 0}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openPlaylistModal(item)} style={{ border: 'none', background: '#e3f2fd', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#1976d2' }} title={item.type === 'video' ? "Kelola Playlist Video" : "Kelola Bagian Modul"}><List size={16} /></button>
                    <button onClick={() => openEditModal(item)} style={{ border: 'none', background: '#e9ecef', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#495057' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ border: 'none', background: '#ffe3e3', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#ff4757' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {activeContent.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada konten.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Konten */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            width: '100%', maxWidth: '600px',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E9ECEF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FA' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Unggah Konten Baru</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>


              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Judul Materi</label>
                <input type="text" required placeholder="Masukkan judul materi..." value={formTitle} onChange={e => setFormTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kategori / Fakultas / Prodi</label>
                <select required value={formCategory} onChange={e => setFormCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', outline: 'none', background: 'white' }}>
                  <option value="">Pilih Kategori atau Prodi...</option>
                  <option value="kategori-umum">Kategori Umum</option>
                  {fakultasList.map(fakultas => (
                    <optgroup key={fakultas.id} label={fakultas.name}>
                      {prodiList.filter(p => p.fakultasId === fakultas.id).map(prodi => {
                        const slug = prodi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <option key={prodi.id} value={slug}>
                            {prodi.name}
                          </option>
                        )
                      })}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Mata Kuliah <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Nantinya dari SIAKAD)</span>
                  </label>
                  <input type="text" placeholder="Nama mata kuliah..." value={formMataKuliah} onChange={e => setFormMataKuliah(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Kode MK <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Nantinya dari SIAKAD)</span>
                  </label>
                  <input type="text" placeholder="Kode..." value={formKodeMataKuliah} onChange={e => setFormKodeMataKuliah(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Dosen Pengampu <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Nantinya dari SIAKAD)</span>
                </label>
                <input type="text" required placeholder="Masukkan nama dosen pengampu..." value={formAuthor} onChange={e => setFormAuthor(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', outline: 'none' }} />
              </div>


                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tautan Video Google Drive</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ced4da', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ background: '#F8F9FA', padding: '0.75rem 1rem', borderRight: '1px solid #ced4da' }}>
                        <Video size={20} color="#ff0000" />
                      </div>
                      <input type="text" required placeholder="https://drive.google.com/file/d/..." value={formUrl} onChange={e => setFormUrl(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: 'none', outline: 'none' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Masukkan URL lengkap dari video Google Drive (pastikan setingan share: Anyone with the link).</p>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Unggah Thumbnail Video (Opsional, max 2MB)</label>
                    <input type="file" accept="image/*" className="admin-input" style={{ background: 'white' }} onChange={(e) => setFormThumbnail(e.target.files[0])} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tautan Modul Pendukung (Opsional)</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ced4da', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ background: '#F8F9FA', padding: '0.75rem 1rem', borderRight: '1px solid #ced4da' }}>
                        <FileText size={20} color="var(--primary)" />
                      </div>
                      <input type="text" placeholder="https://drive.google.com/file/d/..." value={formModuleUrl} onChange={e => setFormModuleUrl(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: 'none', outline: 'none' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Masukkan URL lengkap ke dokumen PDF di Google Drive (pastikan bisa diakses publik).</p>
                  </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem' }}>Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Mengunggah...' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Konten */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>Edit Materi</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--text-muted)" /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Judul</label>
                <input type="text" className="admin-input" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Masukkan judul..." required />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kategori / Fakultas / Prodi</label>
                <select required className="admin-input" value={formCategory} onChange={e => setFormCategory(e.target.value)} style={{ background: 'white' }}>
                  <option value="">Pilih Kategori atau Prodi...</option>
                  <option value="kategori-umum">Kategori Umum</option>
                  {fakultasList.map(fakultas => (
                    <optgroup key={fakultas.id} label={fakultas.name}>
                      {prodiList.filter(p => p.fakultasId === fakultas.id).map(prodi => {
                        const slug = prodi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                          <option key={prodi.id} value={slug}>
                            {prodi.name}
                          </option>
                        )
                      })}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Mata Kuliah</label>
                  <input type="text" className="admin-input" value={formMataKuliah} onChange={(e) => setFormMataKuliah(e.target.value)} placeholder="Nama mata kuliah..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kode MK</label>
                  <input type="text" className="admin-input" value={formKodeMataKuliah} onChange={(e) => setFormKodeMataKuliah(e.target.value)} placeholder="Kode..." />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Dosen Pengampu</label>
                <input type="text" className="admin-input" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} placeholder="Nama dosen..." required />
              </div>
              
              {editingMaterial && editingMaterial.type === 'video' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>URL Video Google Drive</label>
                    <input type="url" className="admin-input" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ganti Thumbnail Video (Opsional)</label>
                    <input type="file" accept="image/*" className="admin-input" style={{ background: 'white' }} onChange={(e) => setFormThumbnail(e.target.files[0])} />
                  </div>
                </>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Tautan Modul Pendukung (Google Drive URL) (Opsional)
                </label>
                <input type="text" className="admin-input" placeholder="https://drive.google.com/file/d/..." value={formModuleUrl} onChange={(e) => setFormModuleUrl(e.target.value)} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Biarkan kosong jika tidak ada modul pendukung.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Playlist (Multi-Part Video) */}
      {isPlaylistModalOpen && activePlaylistMaterial && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>{activePlaylistMaterial.type === 'video' ? 'Daftar Putar' : 'Daftar Modul'}: {activePlaylistMaterial.title}</h3>
              <button onClick={() => setIsPlaylistModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--text-muted)" /></button>
            </div>
            
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>Bagian 1 (Utama):</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary)', wordBreak: 'break-all' }}>{activePlaylistMaterial.file_url}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Bagian Tambahan</h4>
              {(!activePlaylistMaterial.parts || activePlaylistMaterial.parts.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada {activePlaylistMaterial.type === 'video' ? 'video' : 'modul'} lanjutan.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activePlaylistMaterial.parts.map((part, idx) => (
                    <div key={part.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Bagian {idx + 2}: {part.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all', maxWidth: '400px' }}>{part.url}</div>
                      </div>
                      <button onClick={() => handleDeletePart(part.id)} style={{ background: '#ffe3e3', border: 'none', padding: '0.4rem', borderRadius: '4px', color: '#ff4757', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #ced4da', margin: '1.5rem 0' }} />

            <form onSubmit={handleAddPart} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Tambah Bagian Baru</h4>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 500 }}>Judul Bagian</label>
                <input type="text" className="admin-input" value={newPartTitle} onChange={e => setNewPartTitle(e.target.value)} placeholder="Misal: Bab 2 atau Praktik Lanjutan" required />
              </div>
              
              {activePlaylistMaterial.type === 'video' ? (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 500 }}>URL Video (Google Drive)</label>
                    <input type="url" className="admin-input" value={newPartUrl} onChange={e => setNewPartUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 500 }}>Tautan Modul Pendukung (Google Drive)</label>
                    <input type="url" className="admin-input" value={newPartModuleUrl} onChange={e => setNewPartModuleUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." />
                  </div>
                </>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 500 }}>Tautan File PDF Bagian Baru (Google Drive)</label>
                  <input type="url" className="admin-input" value={newPartUrl} onChange={e => setNewPartUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." required />
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
                {isSubmitting ? 'Menyimpan...' : 'Tambah Bagian'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
