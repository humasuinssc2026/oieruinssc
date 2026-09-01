import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, PlayCircle, Clock, User, MessageCircle, Filter, Star, FileText, Eye, Check, X } from 'lucide-react';
import { useAppContext } from '../utils/Store';
import StarRating from '../components/StarRating';
import CommentsSection from '../components/CommentsSection';

// Helper for Google Drive ID
const getGDrivePreviewUrl = (url) => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  return url;
};

export default function VideoHub() {
  const { videos, user, token, hasMoreMaterials, loadMoreMaterials, isLoadingMaterials } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [watchedVideos, setWatchedVideos] = useState([]);
  const videoRef = useRef(null);

  // Load watched history on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const history = JSON.parse(localStorage.getItem('watched_videos')) || [];
    setWatchedVideos(history);
  }, []);

  // States for Review Form & Captcha
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
    setUserCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // States for Discussion Forum
  const [showForum, setShowForum] = useState(false);
  const [forumInput, setForumInput] = useState("");
  const [discussions, setDiscussions] = useState([]);

  // Filter video based on category and search query
  const filteredVideos = videos.filter(v => {
    const matchCategory = activeCategory === "" || v.category === activeCategory;
    const matchSearch = (v.title || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                        (v.author || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    return matchCategory && matchSearch;
  });

  const mainVideo = selectedVideoId 
    ? videos.find(v => v.id === selectedVideoId) 
    : null;

  const [activePartId, setActivePartId] = useState(null);
  
  useEffect(() => {
    setActivePartId(null);
  }, [selectedVideoId, mainVideo?.id]);

  const otherVideos = filteredVideos.filter(v => mainVideo ? v.id !== mainVideo.id : true);

  const activePart = activePartId && mainVideo && mainVideo.parts 
    ? mainVideo.parts.find(p => p.id === activePartId)
    : null;

  const currentModuleUrl = activePart && activePart.module_url 
    ? activePart.module_url 
    : (mainVideo ? mainVideo.module_url : null);

  const playingUrl = activePart
    ? activePart.url
    : (mainVideo ? mainVideo.file_url || mainVideo.url : null);

  let playingGdriveUrl = playingUrl ? getGDrivePreviewUrl(playingUrl) : null;
  // If playingUrl is a local file upload (starts with /uploads/documents/), use the stream API
  if (playingUrl && playingUrl.startsWith('/uploads/documents/')) {
    const filename = playingUrl.split('/').pop();
    playingGdriveUrl = `${import.meta.env.VITE_API_URL}/api/materials/stream/${filename}`;
  }

  const finalModuleUrl = currentModuleUrl 
    ? (currentModuleUrl.startsWith('http') ? getGDrivePreviewUrl(currentModuleUrl) : currentModuleUrl)
    : null;

  useEffect(() => {
    if (mainVideo) {
      // Check if we've already viewed this video in this session to prevent spam
      const viewedKey = `viewed_${mainVideo.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        fetch(`${import.meta.env.VITE_API_URL}/api/materials/${mainVideo.id}/view`, { method: 'POST' })
          .then(res => res.json())
          .then(data => {
             if(data.success) {
               sessionStorage.setItem(viewedKey, 'true');
               
               // Gamification: Add to localStorage history
               const history = JSON.parse(localStorage.getItem('watched_videos')) || [];
               if (!history.includes(mainVideo.id)) {
                 const newHistory = [...history, mainVideo.id];
                 localStorage.setItem('watched_videos', JSON.stringify(newHistory));
                 setWatchedVideos(newHistory);
               }
             }
          })
          .catch(console.error);
      }

      // Fetch reviews
      fetch(`${import.meta.env.VITE_API_URL}/api/materials/${mainVideo.id}/reviews`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setReviews(data.data);
        })
        .catch(console.error);

      // Fetch discussions
      fetch(`${import.meta.env.VITE_API_URL}/api/materials/${mainVideo.id}/discussions`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setDiscussions(data.data);
        })
        .catch(console.error);

      // Record History if logged in
      if (user && token) {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/history`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ material_id: mainVideo.id })
        }).catch(console.error);
      }
    }
  }, [mainVideo, user, token]);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', padding: '2rem' }}>
      {/* Video Modal */}
      {showVideoModal && playingGdriveUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '1100px', 
            background: 'white', 
            borderRadius: '8px', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
            border: '4px solid #f1c40f'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: '#194d33', // Dark green
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid #143d29'
            }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>
                {activePart ? activePart.title : (mainVideo ? mainVideo.title : 'Video Pembelajaran')}
              </h3>
              <button 
                onClick={() => setShowVideoModal(false)} 
                style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  border: '1px solid rgba(255,255,255,0.4)', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Video Content */}
            <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: 'black' }}>
              {playingGdriveUrl.includes('drive.google.com') ? (
                <>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={playingGdriveUrl}
                    title="Video Player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                  {/* Overlay untuk menutupi tombol Pop-out Google Drive */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: '#000', zIndex: 10 }}></div>
                </>
              ) : (
                <video 
                  src={`${playingGdriveUrl}#t=10`} 
                  controls 
                  controlsList="nodownload" 
                  onContextMenu={(e) => e.preventDefault()} 
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', outline: 'none' }}
                >
                  Maaf, browser Anda tidak mendukung pemutar video.
                </video>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Module PDF Modal */}
      {showModuleModal && finalModuleUrl && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '90%', maxWidth: '1200px', height: '90vh', background: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{finalModuleUrl.includes('drive.google.com') ? 'Pratinjau Modul Pendukung' : 'Pratinjau Modul PDF'}</h3>
              <button onClick={() => setShowModuleModal(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                X Tutup
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', flex: 1, background: '#f5f5f5' }}>
              <iframe 
                src={finalModuleUrl.includes('drive.google.com') ? finalModuleUrl : `/pdf-viewer.html?file=${encodeURIComponent(finalModuleUrl)}&user=${encodeURIComponent(user ? `${user.first_name} ${user.last_name}` : 'Pengguna OIER')}`} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="Modul PDF"
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <Helmet>
        <title>{mainVideo ? `${mainVideo.title} | Video OIER` : 'Pusat Video Pembelajaran | OIER UIN Siber'}</title>
        <meta name="description" content="Tonton dan pelajari video materi perkuliahan dari dosen UIN Siber Syekh Nurjati Cirebon." />
        {mainVideo && <meta property="og:title" content={mainVideo.title} />}
        {mainVideo && <meta property="og:description" content={`Video pembelajaran oleh ${mainVideo.author} - ${mainVideo.mata_kuliah || 'Umum'}`} />}
        {mainVideo && <meta property="og:image" content={mainVideo.thumbnail_url ? `${import.meta.env.VITE_API_URL}${mainVideo.thumbnail_url}` : ''} />}
        {mainVideo && <meta property="og:type" content="video.other" />}
      </Helmet>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header & Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Pusat Video Pembelajaran</h1>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Cari video..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', outline: 'none' }} 
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
              <Filter size={18} color="var(--text-muted)" />
              <select 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">Semua Kategori</option>
                <option value="kategori-umum">Kategori Umum</option>
                <optgroup label="Fakultas Ilmu Tarbiyah dan Keguruan">
                  <option value="pai">Pendidikan Agama Islam (S1)</option>
                  <option value="pba">Pendidikan Bahasa Arab (S1)</option>
                  <option value="tbi">Tadris Bahasa Inggris (S1)</option>
                  <option value="tips">Tadris Ilmu Pengetahuan Sosial (S1)</option>
                  <option value="tmat">Tadris Matematika (S1)</option>
                  <option value="tbiologi">Tadris Biologi (S1)</option>
                  <option value="pgmi">Pendidikan Guru Madrasah Ibtidaiyah (S1)</option>
                  <option value="piaud">Pendidikan Islam Anak Usia Dini (S1)</option>
                  <option value="mpi">Manajemen Pendidikan Islam (S1)</option>
                  <option value="tbind">Tadris Bahasa Indonesia (S1)</option>
                  <option value="tkimia">Tadris Kimia (S1)</option>
                  <option value="pjj-pai">PJJ Pendidikan Agama Islam (S1)</option>
                  <option value="ppg">Pendidikan Profesi Guru Keagamaan (PPG)</option>
                </optgroup>
                <optgroup label="Fakultas Ekonomi dan Bisnis Islam">
                  <option value="ps">Perbankan Syariah (S1)</option>
                  <option value="es">Ekonomi Syariah (S1)</option>
                  <option value="as">Akuntansi Syariah (S1)</option>
                  <option value="pars">Pariwisata Syariah (S1)</option>
                </optgroup>
                <optgroup label="Fakultas Syariah">
                  <option value="hk">Hukum Keluarga (Akhwalul Syaksiyah) (S1)</option>
                  <option value="hes">Hukum Ekonomi Syari'ah (Muamalah) (S1)</option>
                  <option value="htn">Hukum Tatanegara Islam (S1)</option>
                  <option value="ilf">Ilmu Falak (S1)</option>
                </optgroup>
                <optgroup label="Fakultas Dakwah dan Komunikasi Islam">
                  <option value="kpi">Komunikasi dan Penyiaran Islam (S1)</option>
                  <option value="pmi">Pengembangan Masyarakat Islam (S1)</option>
                  <option value="bki">Bimbingan dan Konseling Islam (S1)</option>
                  <option value="sa">Sosiologi Agama (S1)</option>
                </optgroup>
                <optgroup label="Fakultas Ushuluddin dan Adab">
                  <option value="spi">Sejarah Peradaban Islam (S1)</option>
                  <option value="afi">Aqidah dan Filsafat Islam (S1)</option>
                  <option value="iat">Ilmu Al-Qur'an dan Tafsir (S1)</option>
                  <option value="ilh">Ilmu Hadis (S1)</option>
                  <option value="bsa">Bahasa dan Sastra Arab (S1)</option>
                  <option value="tp">Tasawuf dan Psikoterapi (S1)</option>
                </optgroup>
                <optgroup label="Fakultas Pascasarjana">
                  <option value="mpi-s2">Manajemen Pendidikan Islam (S2)</option>
                  <option value="pai-s2">Pendidikan Agama Islam (S2)</option>
                  <option value="hk-s2">Hukum Keluarga (Akhwalul Syaksiyah) (S2)</option>
                  <option value="es-s2">Ekonomi Syariah (S2)</option>
                  <option value="pmi-s2">Pengembangan Masyarakat Islam (S2)</option>
                  <option value="pjj-pai-s2">PJJ Pendidikan Agama Islam (S2)</option>
                  <option value="pai-s3">Pendidikan Agama Islam (S3)</option>
                  <option value="hki-s3">Hukum Keluarga Islam (Ahwal Syakhshiyyah) (S3)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Video Player */}
        {mainVideo ? (
          <div ref={videoRef} style={{ background: 'white', borderRadius: 'var(--border-radius)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '3rem' }}>
            <div 
              style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
            >
              {mainVideo.thumbnail_url ? (
                <img src={`${import.meta.env.VITE_API_URL}${mainVideo.thumbnail_url}`} alt={mainVideo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                </div>
              )}
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                <span style={{ background: 'rgba(25,135,84,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{(mainVideo.category || 'Umum').toUpperCase()}</span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={16} /> Diunggah {mainVideo.time}</span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 'auto' }}><Eye size={16} /> {mainVideo.views || 0} Kali Ditonton</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{mainVideo.title}</h2>
                <StarRating materialId={mainVideo.id} reviews={reviews} />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, color: 'var(--text-dark)' }}>
                  <FileText size={16} color="var(--primary)" /> Mata Kuliah: {mainVideo.mata_kuliah || 'Mata Kuliah Umum'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, color: 'var(--text-dark)' }}>
                  <span style={{ background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Kode</span> 
                  {mainVideo.kode_mata_kuliah || '-'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={16} /> Pengampu: {mainVideo.author}
                </span>
              </div>
              

              {/* TABS NAVIGATION */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E9ECEF', marginTop: '2rem', marginBottom: '2rem', overflowX: 'auto' }}>
                {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                      color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                      padding: '0.5rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: activeTab === tab ? '600' : '400',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab === 'overview' ? 'Ringkasan' : tab === 'curriculum' ? 'Kurikulum dan Modul' : tab === 'instructor' ? 'Instruktur' : 'Ulasan'}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              {activeTab === 'overview' && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)', fontSize: '1.3rem' }}>Ringkasan Materi (Course Overview)</h3>
                  
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2rem' }}>
                    Kelas ini merupakan materi pembelajaran digital yang dirancang khusus untuk membahas topik <strong>{mainVideo.title}</strong>. 
                    Diharapkan mahasiswa dapat memahami konsep-konsep esensial yang disampaikan oleh pengampu materi dalam pembelajaran ini.
                  </p>

                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)', fontSize: '1.3rem' }}>Informasi Materi (Course Information)</h3>
                  <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', paddingLeft: '1.5rem', fontSize: '1rem' }}>
                    <li><strong>Instruktur:</strong> {mainVideo.author}</li>
                    <li><strong>Kategori:</strong> {(mainVideo.category || 'Umum').toUpperCase()}</li>
                    <li><strong>Total Video:</strong> {mainVideo.parts ? mainVideo.parts.length + 1 : 1} Video</li>
                    <li><strong>Modul Pendukung:</strong> {
                      (mainVideo.module_url || (mainVideo.parts && mainVideo.parts.some(p => p.module_url))) 
                        ? 'Tersedia' 
                        : 'Tidak Ada'
                    }</li>
                    <li><strong>Total Dilihat:</strong> {mainVideo.views || 0} Kali</li>
                  </ul>

                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)', fontSize: '1.3rem' }}>Topik Pembahasan (Topics)</h3>
                  <div style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2.5rem', fontSize: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div 
                      onClick={() => {
                        setActivePartId(null);
                        setShowVideoModal(true);
                      }}
                      style={{ cursor: 'pointer', color: activePartId === null ? 'var(--primary)' : 'var(--text-dark)', fontWeight: activePartId === null ? '600' : '400', transition: 'color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseOut={(e) => e.currentTarget.style.color = activePartId === null ? 'var(--primary)' : 'var(--text-dark)'}
                    >
                      1. {mainVideo.title} (Materi Utama)
                    </div>
                    {mainVideo.parts && mainVideo.parts.map((part, idx) => (
                      <div 
                        key={part.id}
                        onClick={() => {
                          setActivePartId(part.id);
                          setShowVideoModal(true);
                        }}
                        style={{ cursor: 'pointer', color: activePartId === part.id ? 'var(--primary)' : 'var(--text-dark)', fontWeight: activePartId === part.id ? '600' : '400', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseOut={(e) => e.currentTarget.style.color = activePartId === part.id ? 'var(--primary)' : 'var(--text-dark)'}
                      >
                        {idx + 2}. {part.title}
                      </div>
                    ))}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}><em>Open Islamic Education Resources (OIER) UIN Siber</em></p>

                  <hr style={{ borderTop: '1px solid #e9ecef', margin: '2rem 0' }} />

                  <button 
                    className="btn btn-outline" 
                    onClick={() => setShowForum(!showForum)}
                    style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', marginBottom: showForum ? '1.5rem' : '0' }}
                  >
                    <MessageCircle size={18} /> {showForum ? "Tutup Forum Diskusi" : "Buka Forum Diskusi"}
                  </button>

                  {showForum && (
                    <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e9ecef', animation: 'fadeIn 0.3s' }}>
                      <h4 style={{ margin: '0 0 1rem 0' }}>Forum Diskusi Kelas</h4>
                      
                      {/* Discussion List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        {discussions.map(d => (
                          <div key={d.id} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: d.isInstructor ? 'var(--primary)' : '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                              {d.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #dee2e6', flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong>{d.name} {d.isInstructor && <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem' }}>Pengajar</span>}</strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.time}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.95rem', color: '#333', lineHeight: '1.5' }}>{d.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                          {user ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <textarea 
                            value={forumInput}
                            onChange={(e) => setForumInput(e.target.value)}
                            placeholder="Tuliskan pertanyaan atau tanggapan Anda..."
                            rows="2"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none', resize: 'vertical' }}
                          ></textarea>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                              onClick={async () => {
                                if (!user) {
                                  import('sonner').then(m => m.toast.error("Silakan login untuk mengirim diskusi"));
                                  return;
                                }
                                if (forumInput.trim()) {
                                  try {
                                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${mainVideo.id}/discussions`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ text: forumInput, user_id: user.id, user_name: user.name })
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                      setDiscussions([...discussions, data.data]);
                                      setForumInput("");
                                      import('sonner').then(m => m.toast.success("Diskusi terkirim!"));
                                    } else {
                                      import('sonner').then(m => m.toast.error(data.message));
                                    }
                                  } catch(err) {
                                    console.error(err);
                                    import('sonner').then(m => m.toast.error("Gagal mengirim diskusi"));
                                  }
                                }
                              }}
                            >
                              Kirim
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}



              {activeTab === 'curriculum' && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Daftar Materi</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div 
                      onClick={() => {
                        setActivePartId(null);
                        setShowVideoModal(true);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: activePartId === null ? '#e8f5e9' : '#f8f9fa', borderRadius: '8px', border: activePartId === null ? '1px solid var(--primary)' : '1px solid #e9ecef', cursor: 'pointer' }}
                    >
                      <PlayCircle size={20} color={activePartId === null ? "var(--primary)" : "var(--text-muted)"} />
                      <div style={{ flex: 1, fontWeight: activePartId === null ? '600' : '500', color: activePartId === null ? 'var(--primary)' : 'inherit' }}>Bagian 1: {mainVideo.title} (Utama)</div>
                    </div>

                    {mainVideo.parts && mainVideo.parts.map((part, idx) => (
                      <div 
                        key={part.id}
                        onClick={() => {
                          setActivePartId(part.id);
                          setShowVideoModal(true);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: activePartId === part.id ? '#e8f5e9' : '#f8f9fa', borderRadius: '8px', border: activePartId === part.id ? '1px solid var(--primary)' : '1px solid #e9ecef', cursor: 'pointer' }}
                      >
                        <PlayCircle size={20} color={activePartId === part.id ? "var(--primary)" : "var(--text-muted)"} />
                        <div style={{ flex: 1, fontWeight: activePartId === part.id ? '600' : '500', color: activePartId === part.id ? 'var(--primary)' : 'inherit' }}>Bagian {idx + 2}: {part.title}</div>
                      </div>
                    ))}

                    {currentModuleUrl && (
                      <div 
                        onClick={() => setShowModuleModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef', cursor: 'pointer', transition: 'all 0.2s' }} 
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }} 
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: '60px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {currentModuleUrl.includes('drive.google.com') ? (
                            <>
                              <FileText size={28} color="#0F9D58" style={{ marginBottom: '0.3rem' }} />
                              <span style={{ color: '#0F9D58', fontSize: '0.6rem', fontWeight: 'bold' }}>DRIVE</span>
                            </>
                          ) : (
                            <>
                              <FileText size={28} color="#e74c3c" style={{ marginBottom: '0.3rem' }} />
                              <span style={{ color: '#e74c3c', fontSize: '0.6rem', fontWeight: 'bold' }}>PDF</span>
                            </>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                            {currentModuleUrl.includes('drive.google.com') ? 'Modul Pendukung (Google Drive)' : 'Modul Pendukung (PDF)'}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {currentModuleUrl.includes('drive.google.com') ? 'Klik kotak ini untuk membuka modul secara langsung.' : 'Klik kotak ini untuk membuka dan membaca modul secara langsung.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {activeTab === 'instructor' && (
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', animation: 'fadeIn 0.3s' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <User size={36} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{mainVideo.author}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: '500', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Pengampu Mata Kuliah</p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                      {mainVideo.author} adalah tenaga pengajar di lingkungan Universitas yang ahli di bidang ini. Beliau aktif mengembangkan bahan ajar digital interaktif untuk mahasiswa UIN Sunan Kalijaga.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Ulasan Mahasiswa</h3>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center', background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '3rem', margin: 0, color: '#f59e0b' }}>4.8</h2>
                      <div style={{ display: 'flex', color: '#f59e0b', justifyContent: 'center', gap: '0.2rem', marginBottom: '0.5rem' }}>
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>24 Ulasan</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5,4,3,2,1].map(star => (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <span style={{ width: '60px' }}>{star} Bintang</span>
                          <div style={{ flex: 1, height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: star === 5 ? '75%' : star === 4 ? '20%' : '5%', height: '100%', background: '#f59e0b' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Tambah Ulasan */}
                  <div style={{ background: 'white', border: '1px solid #e9ecef', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0' }}>Berikan Ulasan Anda</h4>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Alamat Email</label>
                      <input 
                        type="email" 
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        placeholder="Contoh: budi@students.uin-suka.ac.id"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Rating Bintang</label>
                      <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                        {[1,2,3,4,5].map(star => (
                          <Star 
                            key={star} 
                            size={28} 
                            fill={star <= reviewRating ? '#f59e0b' : 'none'} 
                            color={star <= reviewRating ? '#f59e0b' : '#ced4da'}
                            onClick={() => setReviewRating(star)}
                            style={{ transition: 'all 0.2s' }}
                          />
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Komentar Ulasan</label>
                      <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tuliskan pengalaman belajar Anda menggunakan materi ini..."
                        rows="3"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none', resize: 'vertical' }}
                      ></textarea>
                    </div>
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #ced4da' }}>
                      <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Verifikasi Keamanan (Anti-Spam)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', background: '#e9ecef', padding: '0.5rem 1rem', borderRadius: '4px', letterSpacing: '2px' }}>{captchaQuestion}</span>
                        <input 
                          type="number" 
                          value={userCaptcha}
                          onChange={(e) => setUserCaptcha(e.target.value)}
                          placeholder="Hasil..."
                          style={{ width: '100px', padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px', outline: 'none', fontSize: '1.1rem', textAlign: 'center' }}
                        />
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      onClick={async () => {
                        if (parseInt(userCaptcha) !== captchaAnswer) {
                          import('sonner').then(m => m.toast.error("Verifikasi keamanan salah! Silakan hitung dengan benar."));
                          generateCaptcha();
                          return;
                        }
                        if (reviewName.trim() && reviewEmail.trim() && reviewText.trim()) {
                          try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${mainVideo.id}/reviews`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ user_name: reviewName, rating: reviewRating, comment: reviewText })
                            });
                            const data = await res.json();
                            if (data.success) {
                              setReviews([data.data, ...reviews]);
                              setReviewName("");
                              setReviewEmail("");
                              setReviewText("");
                              setReviewRating(5);
                              generateCaptcha();
                              import('sonner').then(m => m.toast.success("Ulasan berhasil dikirim!"));
                            } else {
                              import('sonner').then(m => m.toast.error(data.message));
                            }
                          } catch (err) {
                            console.error(err);
                            import('sonner').then(m => m.toast.error("Gagal mengirim ulasan"));
                          }
                        } else {
                          import('sonner').then(m => m.toast.error("Mohon lengkapi nama, email, dan ulasan Anda!"));
                        }
                      }}
                      style={{ padding: '0.6rem 1.5rem' }}
                    >
                      Kirim Ulasan
                    </button>
                  </div>

                  {/* Daftar Ulasan */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reviews.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada ulasan.</p>
                    ) : (
                      reviews.map(r => (
                        <div key={r.id} style={{ borderBottom: '1px solid #e9ecef', paddingBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                                {r.user_name ? r.user_name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <strong style={{ fontSize: '1rem' }}>{r.user_name || r.name}</strong>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {r.date ? new Date(r.date).toLocaleDateString() : 'Baru saja'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.75rem', gap: '0.2rem' }}>
                            {[1,2,3,4,5].map(star => (
                              <Star 
                                key={star} 
                                size={16} 
                                fill={star <= r.rating ? "currentColor" : "none"} 
                                color={star <= r.rating ? "currentColor" : "#e9ecef"} 
                              />
                            ))}
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{r.comment || r.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  
                  <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>Muat Lebih Banyak Ulasan</button>
                </div>
              )}
            </div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '8px', marginBottom: '3rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Belum ada video yang ditemukan.</h3>
          </div>
        ) : null}

        {/* Related/Latest Videos Grid */}
        {(otherVideos.length > 0 || isLoadingMaterials) && (
          <>
            <h3 style={{ marginBottom: '1.5rem' }}>{mainVideo ? 'Video Lainnya' : 'Semua Koleksi Video'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {isLoadingMaterials && videos.length === 0 ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="skeleton" style={{ aspectRatio: '16/9' }}></div>
                    <div style={{ padding: '1rem' }}>
                      <div className="skeleton" style={{ height: '1.2rem', width: '90%', marginBottom: '0.75rem', borderRadius: '4px' }}></div>
                      <div className="skeleton" style={{ height: '0.8rem', width: '60%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                otherVideos.map((video) => {
                  const isWatched = watchedVideos.includes(video.id);
                  return (
                    <div 
                      key={video.id} 
                      onClick={() => {
                        setSelectedVideoId(video.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'var(--transition)', position: 'relative' }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ aspectRatio: '16/9', background: '#ddd', position: 'relative' }}>
                        {video.thumbnail_url ? (
                          <img src={`${import.meta.env.VITE_API_URL}${video.thumbnail_url}`} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white' }}>
                            <PlayCircle size={40} />
                          </div>
                        )}
                        <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          Video
                        </span>
                        {isWatched && (
                          <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(25, 135, 84, 0.9)', color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
                            <Check size={14} /> Ditonton
                          </span>
                        )}
                      </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, lineHeight: 1.4, fontSize: '1rem', flex: 1 }}>{video.title}</h4>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Eye size={12} /> {video.views || 0}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                        {video.mata_kuliah || 'Mata Kuliah Umum'}
                      </p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{video.author} • {video.time}</p>
                    </div>
                  </div>
                );
              })
            )}
            </div>
            {hasMoreMaterials && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  onClick={loadMoreMaterials} 
                  disabled={isLoadingMaterials}
                  className="btn btn-outline" 
                  style={{ padding: '0.75rem 2rem' }}
                >
                  {isLoadingMaterials ? 'Memuat...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
