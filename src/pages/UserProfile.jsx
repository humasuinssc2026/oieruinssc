import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from '../utils/Store';
import { User, LogOut, BookOpen, Clock, Settings, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, token, logoutAdmin } = useAppContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uploadingPic, setUploadingPic] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch profile
        const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, { headers });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.data);
        }

        // Fetch history
        const historyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/history`, { headers });
        const historyData = await historyRes.json();
        if (historyData.success) {
          setHistory(historyData.data);
          setProgress(historyData.progress);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    setUploadingPic(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile-pic`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, profile_pic: data.profile_pic });
        
        // Update global state and localStorage
        const updatedUser = { ...user, profile_pic: data.profile_pic };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        import('../utils/Store').then(m => {
             // To properly set context, we should expose setUser in Store or just use window reload for simplicity if setUser is not easily imported here since we only get useAppContext.
             // Wait, we do have useAppContext here!
        });
        
        import('sonner').then(m => m.toast.success("Foto profil berhasil diperbarui!"));
        setTimeout(() => window.location.reload(), 1000); // Reload to reflect changes globally
      } else {
        import('sonner').then(m => m.toast.error(data.message));
      }
    } catch (err) {
      console.error(err);
      import('sonner').then(m => m.toast.error("Gagal mengunggah foto profil"));
    } finally {
      setUploadingPic(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat profil...</div>;
  }

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 2rem' }}>
      <Helmet>
        <title>Profil Saya | OIER UIN Siber</title>
      </Helmet>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Sidebar Profil */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '3rem', fontWeight: 'bold', overflow: 'hidden'
              }}>
                {profile && profile.profile_pic ? (
                  <img src={`${import.meta.env.VITE_API_URL}${profile.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile ? profile.first_name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <label style={{ 
                position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', 
                color: 'white', width: '32px', height: '32px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {uploadingPic ? <div style={{ width: '12px', height: '12px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> : <Camera size={16} />}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} disabled={uploadingPic} />
              </label>
            </div>
            
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{profile ? `${profile.first_name} ${profile.last_name}` : 'User'}</h2>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)' }}>{profile ? profile.email : ''}</p>
            
            <span style={{ 
              background: 'rgba(25, 135, 84, 0.1)', color: 'var(--primary)', 
              padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginBottom: '2rem' 
            }}>
              {profile ? profile.role.toUpperCase() : 'MAHASISWA'}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn" onClick={handleLogout} style={{ width: '100%', background: '#ffe3e3', color: '#ff4757', border: '1px solid #ff4757' }}>
                <LogOut size={18} /> Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Konten Utama (Riwayat) */}
        <div style={{ flex: '2 1 600px' }}>
          <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-hover)', paddingBottom: '1rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={24} color="var(--primary)" />
                <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Riwayat Belajar Anda</h2>
              </div>
            </div>

            {progress && progress.total > 0 && (
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Progres Belajar Keseluruhan</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{progress.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '50px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', width: `${progress.percentage}%`, transition: 'width 1s ease-in-out' }}></div>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Anda telah mempelajari {progress.completed} dari total {progress.total} materi yang tersedia.
                </p>
              </div>
            )}
            
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ color: 'var(--text-muted)' }}>Belum Ada Riwayat</h3>
                <p style={{ color: 'var(--text-muted)' }}>Anda belum membuka materi apapun. Mulai jelajahi materi sekarang!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map(item => (
                  <div key={item.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '1rem', border: '1px solid var(--surface-hover)', borderRadius: '8px',
                    transition: 'var(--transition)'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary-dark)' }}>{item.title}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {item.type.toUpperCase()} • {item.category_slug}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Diakses pada</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {new Date(item.last_accessed).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
