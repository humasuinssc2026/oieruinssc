import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Shield, UserCheck, UserX, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua Peran");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'dosen'
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsers([data.data, ...users]);
        setShowAddModal(false);
        setFormData({ first_name: '', last_name: '', email: '', password: '', role: 'dosen' });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menambahkan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengubah peran');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/users/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsers(users.map(u => u.id === editFormData.id ? { ...u, first_name: editFormData.first_name, last_name: editFormData.last_name, email: editFormData.email } : u));
        setShowEditModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user) => {
    setEditFormData({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      email: user.email,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id, role) => {
    if (role === 'superadmin') {
      toast.error("Tidak dapat menghapus Super Admin");
      return;
    }
    
    // Gunakan window.confirm atau custom modal (kali ini pakai standar alert)
    if (!window.confirm("Yakin ingin menghapus pengguna ini secara permanen?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/users/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsers(users.filter(u => u.id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus pengguna");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.first_name + " " + (u.last_name||'')).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Semua Peran' || 
                        (roleFilter === 'Admin' && u.role === 'admin') ||
                        (roleFilter === 'Dosen' && u.role === 'dosen') ||
                        (roleFilter === 'Mahasiswa' && u.role === 'mahasiswa') ||
                        (roleFilter === 'Super Admin' && u.role === 'superadmin');
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Manajemen Pengguna</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Atur hak akses admin, dosen pembicara, dan mahasiswa.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} /> Tambah Pengguna
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#F8F9FA', padding: '0.5rem 1rem', borderRadius: '6px', width: '350px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Cari nama atau email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', outline: 'none', width: '100%' }} 
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #E9ECEF', outline: 'none' }}
        >
          <option>Semua Peran</option>
          <option>Super Admin</option>
          <option>Admin</option>
          <option>Dosen</option>
          <option>Mahasiswa</option>
        </select>
      </div>

      {/* User Table */}
      <div className="admin-table-container" style={{ marginTop: 0 }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat daftar pengguna...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Pengguna</th>
                <th>Email</th>
                <th>Peran (Role)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada pengguna ditemukan.</td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.role === 'superadmin' ? 'var(--primary)' : (user.role === 'admin' ? '#4a5568' : (user.role === 'dosen' ? '#F9A826' : '#6c757d')), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user.first_name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{user.first_name} {user.last_name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === 'superadmin' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#856404', background: '#fff3cd', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Shield size={14} /> Super Admin
                      </span>
                    ) : (
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{ padding: '0.2rem', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                      >
                        <option value="admin">Admin</option>
                        <option value="dosen">Dosen</option>
                        <option value="mahasiswa">Mahasiswa</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 'active' ? 'status-published' : 'status-pending'}`}>
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => openEditModal(user)}
                        style={{ border: 'none', background: '#e3f2fd', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#0d6efd' }}
                        title="Edit Pengguna"
                      >
                        <Edit2 size={16} />
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(user.id, user.role)}
                        style={{ border: 'none', background: '#ffe3e3', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#ff4757' }}
                        title="Hapus Pengguna"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0' }}>Tambah Pengguna Baru</h2>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Depan</label>
                  <input type="text" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Belakang</label>
                  <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kata Sandi (Otomatis Aktif)</label>
                <input type="password" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Peran Hak Akses</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da', background: 'white' }}>
                  <option value="dosen">Dosen / Pemateri Video</option>
                  <option value="admin">Admin Konten Tambahan</option>
                  <option value="mahasiswa">Mahasiswa Biasa</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.8rem 1.5rem', background: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '6px', cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0' }}>Edit Data Pengguna</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Depan</label>
                  <input type="text" required value={editFormData.first_name} onChange={e => setEditFormData({...editFormData, first_name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Belakang</label>
                  <input type="text" value={editFormData.last_name} onChange={e => setEditFormData({...editFormData, last_name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                <input type="email" required value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kata Sandi Baru (Opsional)</label>
                <input type="password" minLength="6" placeholder="Kosongkan jika tidak ingin mengubah sandi" value={editFormData.password} onChange={e => setEditFormData({...editFormData, password: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ced4da' }} />
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Isi kolom ini HANYA jika Anda ingin mengganti kata sandi akun ini.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '0.8rem 1.5rem', background: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '6px', cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
