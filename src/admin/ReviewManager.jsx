import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Trash2, Search, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/reviews`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Gagal memuat data ulasan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/reviews/${id}/hide`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setReviews(reviews.map(r => r.id === id ? { ...r, is_hidden: data.is_hidden } : r));
      } else {
        toast.error(data.message || 'Gagal mengubah status ulasan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
    }
  };

  const deleteReview = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Ulasan berhasil dihapus');
        setReviews(reviews.filter(r => r.id !== id));
      } else {
        toast.error(data.message || 'Gagal menghapus ulasan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
    }
  };

  const filteredReviews = reviews.filter(r => 
    (r.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.comment || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.material_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content">
      <Helmet>
        <title>Kelola Ulasan | Admin OIER</title>
      </Helmet>
      
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--text-dark)' }}>Kelola Ulasan</h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Pantau dan moderasi komentar/ulasan dari pengguna.</p>
        </div>
      </div>

      <div className="admin-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari ulasan, pengguna, atau materi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data ulasan...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Pengguna</th>
                  <th style={{ padding: '1rem' }}>Materi</th>
                  <th style={{ padding: '1rem' }}>Ulasan</th>
                  <th style={{ padding: '1rem' }}>Rating</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Belum ada ulasan yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map(review => (
                    <tr key={review.id} style={{ borderBottom: '1px solid #e2e8f0', background: review.is_hidden ? '#fef2f2' : 'transparent' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{review.user_name}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{review.material_title || '-'}</td>
                      <td style={{ padding: '1rem', maxWidth: '300px' }}>
                        <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }} title={review.comment}>
                          {review.comment}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
                          <Star size={14} fill="currentColor" />
                          <span style={{ marginLeft: '0.3rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>{review.rating}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {review.is_hidden ? (
                          <span style={{ background: '#fee2e2', color: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Disembunyikan</span>
                        ) : (
                          <span style={{ background: '#dcfce7', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Terlihat</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button 
                            onClick={() => toggleVisibility(review.id, review.is_hidden)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: review.is_hidden ? '#22c55e' : '#f59e0b' }}
                            title={review.is_hidden ? 'Tampilkan' : 'Sembunyikan'}
                          >
                            {review.is_hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button 
                            onClick={() => deleteReview(review.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                            title="Hapus Permanen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
