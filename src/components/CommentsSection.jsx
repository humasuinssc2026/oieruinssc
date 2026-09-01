import React, { useState, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { useAppContext } from '../utils/Store';
import { toast } from 'sonner';

export default function CommentsSection({ materialId }) {
  const { user, token } = useAppContext();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${materialId}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (materialId) fetchComments();
  }, [materialId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('Anda harus masuk (login) untuk berkomentar');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${materialId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Komentar ditambahkan!');
        setNewComment('');
        // Append new comment to the top
        setComments([data.data, ...comments]);
      } else {
        toast.error(data.message || 'Gagal menambahkan komentar');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Terjadi kesalahan pada server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Diskusi & Komentar ({comments.length})</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          {user && user.profile_pic ? (
            <img src={`${import.meta.env.VITE_API_URL}${user.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={20} />
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Tambahkan komentar Anda..." : "Masuk (login) untuk menambahkan komentar..."}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-hover)', background: 'var(--bg-color)', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
            disabled={!user || submitting}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!user || !newComment.trim() || submitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              {submitting ? 'Mengirim...' : <><Send size={16} /> Kirim Komentar</>}
            </button>
          </div>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Memuat komentar...</p>
        ) : comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada diskusi. Jadilah yang pertama berkomentar!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {comment.profile_pic ? (
                  <img src={`${import.meta.env.VITE_API_URL}${comment.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>{comment.first_name} {comment.last_name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
