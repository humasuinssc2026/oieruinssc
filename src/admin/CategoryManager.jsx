import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryManager() {
  const [fakultasList, setFakultasList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const [selectedFakultasId, setSelectedFakultasId] = useState(1);

  // Modal state
  const [modal, setModal] = useState({ isOpen: false, type: '', payload: null });
  const [inputValue, setInputValue] = useState('');

  const openModal = (type, payload = null, initialValue = '') => {
    setModal({ isOpen: true, type, payload });
    setInputValue(initialValue);
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', payload: null });
    setInputValue('');
  };

  const handleModalSubmit = async () => {
    const { type, payload } = modal;
    
    try {
      if (type === 'addFakultas') {
        if (inputValue.trim()) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: inputValue.trim(), type: 'faculty' })
          });
          const data = await res.json();
          if(data.success) {
            setFakultasList([...fakultasList, data.data]);
            toast.success('Fakultas berhasil ditambahkan');
          }
        }
      } else if (type === 'editFakultas') {
        if (inputValue.trim()) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${payload.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: inputValue.trim() })
          });
          setFakultasList(fakultasList.map(f => f.id === payload.id ? { ...f, name: inputValue.trim() } : f));
          toast.success('Fakultas berhasil diubah');
        }
      } else if (type === 'deleteFakultas') {
        await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${payload.id}`, { method: 'DELETE' });
        setFakultasList(fakultasList.filter(f => f.id !== payload.id));
        setProdiList(prodiList.filter(p => p.fakultasId !== payload.id));
        if (selectedFakultasId === payload.id) setSelectedFakultasId(null);
        toast.success('Fakultas berhasil dihapus');
      } else if (type === 'addProdi') {
        if (inputValue.trim() && selectedFakultasId) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: inputValue.trim(), type: 'prodi', parent_id: selectedFakultasId })
          });
          const data = await res.json();
          if(data.success) {
            setProdiList([...prodiList, data.data]);
            toast.success('Program studi berhasil ditambahkan');
          }
        }
      } else if (type === 'editProdi') {
        if (inputValue.trim()) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${payload.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: inputValue.trim() })
          });
          setProdiList(prodiList.map(p => p.id === payload.id ? { ...p, name: inputValue.trim() } : p));
          toast.success('Program studi berhasil diubah');
        }
      } else if (type === 'deleteProdi') {
        await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${payload.id}`, { method: 'DELETE' });
        setProdiList(prodiList.filter(p => p.id !== payload.id));
        toast.success('Program studi berhasil dihapus');
      }
    } catch (error) {
      console.error("API error", error);
      toast.error("Gagal melakukan aksi. Pastikan backend server menyala.");
    }

    closeModal();
  };

  const activeFakultas = fakultasList.find(f => f.id === selectedFakultasId);
  const activeProdis = prodiList.filter(p => p.fakultasId === selectedFakultasId);

  return (
    <div className="admin-content" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Struktur Kategori & Fakultas</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Kelola Fakultas, Program Studi, dan Kategori Materi Umum.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('addFakultas')}>
          <Plus size={18} /> Tambah Fakultas
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Fakultas Section */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ borderBottom: '1px solid #E9ECEF', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--primary)" /> Daftar Fakultas Induk
          </h3>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {fakultasList.map((fak) => (
              <li 
                key={fak.id} 
                onClick={() => setSelectedFakultasId(fak.id)}
                style={{ 
                  padding: '1rem', 
                  border: selectedFakultasId === fak.id ? '2px solid var(--primary)' : '1px solid #E9ECEF', 
                  borderRadius: '6px', 
                  marginBottom: '0.8rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: selectedFakultasId === fak.id ? 'rgba(15, 81, 50, 0.05)' : 'white'
                }}>
                <span style={{ fontWeight: selectedFakultasId === fak.id ? 'bold' : 500 }}>{fak.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('editFakultas', { id: fak.id }, fak.name);
                    }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#495057' }}>
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('deleteFakultas', { id: fak.id });
                    }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ff4757' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
            {fakultasList.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada fakultas.</p>
            )}
          </ul>
        </div>

        {/* Program Studi Section */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E9ECEF', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Kategori Tersubordinasi</h3>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                if (!selectedFakultasId) alert("Silakan pilih Fakultas di sebelah kiri terlebih dahulu!");
                else openModal('addProdi');
              }} 
              disabled={!selectedFakultasId} 
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
              + Tambah Prodi
            </button>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {activeFakultas ? `Menampilkan prodi untuk: ${activeFakultas.name}` : 'Pilih fakultas di sebelah kiri untuk melihat program studi.'}
          </p>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {activeProdis.map((prodi) => (
              <li key={prodi.id} style={{ padding: '0.8rem 1rem', background: '#F8F9FA', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{prodi.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal('editProdi', { id: prodi.id }, prodi.name)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#495057' }}>
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => openModal('deleteProdi', { id: prodi.id })}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ff4757' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
            {selectedFakultasId && activeProdis.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada prodi di fakultas ini.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Custom Modal */}
      {modal.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>
                {modal.type === 'addFakultas' && 'Tambah Fakultas Baru'}
                {modal.type === 'editFakultas' && 'Ubah Nama Fakultas'}
                {modal.type === 'deleteFakultas' && 'Konfirmasi Hapus'}
                {modal.type === 'addProdi' && 'Tambah Program Studi Baru'}
                {modal.type === 'editProdi' && 'Ubah Nama Program Studi'}
                {modal.type === 'deleteProdi' && 'Konfirmasi Hapus'}
              </h3>
              <button onClick={closeModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            
            {modal.type.includes('delete') ? (
              <p style={{ marginBottom: '1.5rem' }}>
                {modal.type === 'deleteFakultas' 
                  ? 'Yakin ingin menghapus Fakultas ini beserta seluruh Program Studi di dalamnya? Tindakan ini tidak dapat dibatalkan.' 
                  : 'Yakin ingin menghapus Program Studi ini?'}
              </p>
            ) : (
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Masukkan nama..."
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1.5rem' }}
                autoFocus
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={closeModal}>Batal</button>
              <button 
                className={`btn ${modal.type.includes('delete') ? 'btn-danger' : 'btn-primary'}`} 
                style={modal.type.includes('delete') ? { background: '#ff4757', color: 'white', border: 'none' } : {}}
                onClick={handleModalSubmit}>
                {modal.type.includes('delete') ? 'Hapus' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
