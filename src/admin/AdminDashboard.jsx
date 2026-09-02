import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Eye,
  CheckCircle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';

import { useAppContext } from '../utils/Store';

const visitorData = [
  { name: 'Senin', pengunjung: 1200 },
  { name: 'Selasa', pengunjung: 1900 },
  { name: 'Rabu', pengunjung: 1500 },
  { name: 'Kamis', pengunjung: 2200 },
  { name: 'Jumat', pengunjung: 1800 },
  { name: 'Sabtu', pengunjung: 3100 },
  { name: 'Minggu', pengunjung: 2800 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ visitors: 0, totalMaterials: 0, pendingApprovals: 0 });
  const [chartData, setChartData] = useState({ growth: [], categories: [] });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAppContext();

  const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, { headers });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        const chartRes = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/chart-data`, { headers });
        if (chartRes.ok) {
          const chartData = await chartRes.json();
          if (chartData.success) {
            setChartData(chartData.data);
          }
        }

        const recentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/recent`, { headers });
        const recentData = await recentRes.json();
        if (recentData.success) {
          setRecentActivities(recentData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus aktivitas ini?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchDashboardData(); // Refresh data
        } else {
          alert('Gagal menghapus: ' + data.message);
        }
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const openEditModal = (activity) => {
    setEditingMaterial(activity);
    setFormTitle(activity.title);
    setFormCategory(activity.category_slug);
    setFormAuthor(activity.author);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formCategory || !formAuthor) {
      alert("Harap isi semua field teks!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${editingMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          author: formAuthor
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditModalOpen(false);
        fetchDashboardData(); // Refresh data
      } else {
        alert('Gagal mengubah: ' + data.message);
      }
    } catch (err) {
      console.error('Edit error', err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Dashboard Ringkasan</h1>
        <Link to="/admin/content" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none' }}>
          + Unggah Baru
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(25, 135, 84, 0.1)', color: 'var(--primary-light)' }}>
            <Eye />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>
              {loading ? '...' : (stats.visitors / 1000).toFixed(1) + 'K'}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Pengunjung (Bulan Ini)</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(249, 168, 38, 0.1)', color: 'var(--accent)' }}>
            <FileText />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>
              {loading ? '...' : stats.totalMaterials}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Modul & Video</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757' }}>
            <CheckCircle />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>
              {loading ? '...' : stats.pendingApprovals}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Menunggu Approval</p>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem', marginTop: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Pertumbuhan Pengunjung (7 Hari)</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <AreaChart data={chartData.growth.length > 0 ? chartData.growth : visitorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ fontWeight: 'bold', color: 'var(--text-dark)' }}
                />
                <Area type="monotone" dataKey={chartData.growth.length > 0 ? "visits" : "pengunjung"} stroke="var(--primary)" fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Distribusi Materi per Kategori</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={chartData.categories} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Bar dataKey="value" fill="#0984e3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="admin-table-container">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E9ECEF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Aktivitas Unggahan Terbaru</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul Materi</th>
              <th>Kategori</th>
              <th>Pengunggah</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</td></tr>
            ) : recentActivities.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada aktivitas.</td></tr>
            ) : (
              recentActivities.map(activity => (
                <tr key={activity.id}>
                  <td style={{ fontWeight: 500 }}>{activity.title}</td>
                  <td>{(activity.category_slug || activity.category || '').toUpperCase()}</td>
                  <td>{activity.author}</td>
                  <td>{activity.time}</td>
                  <td>
                    <span className={`status-badge ${activity.status === 'published' ? 'status-published' : 'status-pending'}`}>
                      {activity.status === 'published' ? 'Terpublikasi' : 'Review'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEditModal(activity)} className="table-action-btn edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(activity.id)} className="table-action-btn delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Penulis / Pemateri</label>
                <input type="text" className="admin-input" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} placeholder="Nama penulis..." required />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kategori Slug</label>
                <input type="text" className="admin-input" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="Misal: pai, es, kpi..." required />
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
    </div>
  );
}
