import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Play, Info, Video, BookOpen, Volume2, VolumeX, Users, Bookmark, LineChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppContext } from '../utils/Store';
import Carousel from '../components/Carousel';

const categoryStats = [
  { name: 'Fak. Ilmu Tarbiyah', value: 400 },
  { name: 'Fak. Syariah', value: 300 },
  { name: 'Fak. Ushuluddin', value: 300 },
  { name: 'Fak. Dakwah', value: 200 },
  { name: 'Fak. Adab', value: 278 },
];
const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
export default function Home() {
  const { videos, documents, categories } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-slide logic for Hero section
  useEffect(() => {
    if (videos.length === 0) return;
    const maxSlides = Math.min(videos.length, 10);
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % maxSlides);
    }, 30000); // 30 seconds per slide
    return () => clearInterval(timer);
  }, [videos.length]);
  
  const [siteStats, setSiteStats] = useState({ live: 0, today: 0, week: 0, month: 0, totalVideos: 0, totalLearners: 0 });

  useEffect(() => {
    // Record visit
    const recordVisit = async () => {
      if (!sessionStorage.getItem('visited')) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/stats/visit`, { method: 'POST' });
          sessionStorage.setItem('visited', 'true');
        } catch (err) {
          console.error('Error recording visit:', err);
        }
      }
    };
    
    // Fetch stats
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`);
        const data = await res.json();
        if (data.success) {
          setSiteStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    recordVisit().then(() => {
      fetchStats();
    });
    
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/videos');
    }
  };

  // Group data for carousels
  const popularVideos = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  const recentVideos = [...videos].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 10);
  const allDocuments = documents || [];

  // Get a featured item for the Hero Billboard (Carousel)
  const featuredVideo = popularVideos.length > 0 ? popularVideos[currentSlide % popularVideos.length] : null;

  return (
    <div className="home-page" style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '50px' }}>
      <Helmet>
        <title>Beranda | OIER UIN Siber</title>
        <meta property="og:title" content="Beranda | OIER UIN Siber" />
        <meta property="og:description" content="Jelajahi materi pembelajaran dan video edukasi keislaman berkualitas tinggi secara gratis di OIER UIN Siber Syekh Nurjati." />
      </Helmet>
      
      {/* 1. Hero Billboard (Netflix Style with Video Background) */}
      <section style={{ 
        height: '75vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: featuredVideo && featuredVideo.thumbnail_url 
          ? `url(${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${featuredVideo.thumbnail_url}) center/cover no-repeat` 
          : '#000',
        overflow: 'hidden'
      }}>
        
        {/* Autoplaying Background Video / Iframe */}
        {(() => {
          const url = featuredVideo ? (featuredVideo.file_url || featuredVideo.url) : null;
          let videoSrc = url;
          let isIframe = false;

          if (url && url.includes('drive.google.com/file/d/')) {
            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
              // Google Drive blocks direct video streams for large files, so we MUST use an iframe preview.
              // We add autoplay=1 and mute=1, though browsers may still require a click.
              videoSrc = `https://drive.google.com/file/d/${match[1]}/preview?autoplay=1&mute=${isMuted ? '1' : '0'}`;
              isIframe = true;
            }
          } else if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
            isIframe = true;
            const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (ytMatch && ytMatch[1]) {
              videoSrc = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${ytMatch[1]}&modestbranding=1`;
            }
          }
          
          if (videoSrc) {
            if (isIframe) {
              return (
                <iframe 
                  src={videoSrc}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100vw',
                    height: '56.25vw', // 16:9 aspect ratio mapping for width
                    minWidth: '133.33vh', // 16:9 aspect ratio mapping for 75vh height
                    minHeight: '75vh',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                    border: 'none',
                    opacity: 0.95
                  }}
                  allow="autoplay; fullscreen; encrypted-media"
                />
              );
            } else {
              return (
                <video 
                  src={videoSrc}
                  autoPlay 
                  muted={isMuted}
                  loop 
                  playsInline
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    opacity: 0.95 
                  }}
                />
              );
            }
          }
          return null;
        })()}

        {/* Subtle bottom fade to blend with page */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 3, padding: '0 4%', width: '100%', pointerEvents: 'none' }}>
          {/* Floating Glass Box for Text */}
          <div style={{ 
            background: 'var(--bg)', 
            padding: '2rem', 
            borderRadius: '16px', 
            maxWidth: '650px',
            boxShadow: 'var(--shadow)',
            opacity: 0.95,
            pointerEvents: 'auto'
          }}>
            <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'var(--accent-bg)', color: 'var(--accent)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '1px', border: '1px solid var(--accent)' }}>
              N O W &nbsp; T R E N D I N G
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: 'var(--text-h)' }}>
              {featuredVideo ? featuredVideo.title : 'Open Islamic Education Resources'}
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '2rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {featuredVideo && featuredVideo.description 
                ? featuredVideo.description 
                : 'Akses ribuan materi kuliah, video pembelajaran, dan modul interaktif resmi dari pakar akademisi UIN Siber Syekh Nurjati Cirebon secara gratis.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to={featuredVideo ? `/videos?v=${featuredVideo.id}` : "/videos"} style={{ textDecoration: 'none' }}>
                <button style={{ 
                  background: '#e50914', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.background = '#f40612'} onMouseOut={(e) => e.currentTarget.style.background = '#e50914'}>
                  <Play fill="currentColor" size={24} /> Watch Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators (Idlix/Netflix Style) */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 10,
          pointerEvents: 'auto'
        }}>
          {popularVideos.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '35px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: currentSlide === idx ? '#e50914' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
          ))}
        </div>

        {/* Volume Toggle Button */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          style={{
            position: 'absolute',
            bottom: '100px', // Just above the gradient fade
            right: '4%',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'background 0.2s',
            pointerEvents: 'auto'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </section>

      {/* 2. Search & Stats Section (Elegant Design) */}
      <section style={{ 
        padding: 'clamp(2.5rem, 8vw, 4rem) 4%', 
        position: 'relative', 
        zIndex: 10,
        background: 'linear-gradient(to bottom, var(--bg) 0%, rgba(245, 240, 235, 0.4) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        
        {/* Background Ornaments (Floating Orbs) */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '25%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(25, 77, 51, 0.1) 0%, rgba(25, 77, 51, 0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
          animation: 'float 7s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '50%',
          zIndex: -1,
          animation: 'float 5s ease-in-out infinite'
        }}></div>

        {/* Tambahkan style keyframes jika belum ada */}
        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
          `}
        </style>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem', 
          width: '100%', 
          maxWidth: '1200px', 
          alignItems: 'stretch' 
        }}>
          
          {/* Card 1: Platform Stats */}
          <div style={{
            flex: 1,
            minWidth: '280px',
            maxWidth: '350px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            boxShadow: '0 20px 40px rgba(29, 77, 51, 0.15), 0 1px 3px rgba(29, 77, 51, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          <h2 style={{ 
            fontSize: '1.6rem', 
            marginBottom: '0.8rem', 
            color: '#1f2937',
            fontWeight: 800,
            lineHeight: 1.3
          }}>
            Platform Pembelajaran<br/>Terbuka
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem', padding: '0 0.5rem', lineHeight: 1.5 }}>
            Jelajahi ribuan materi video dan bergabung bersama komunitas pembelajar UIN Siber.
          </p>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1.5rem', 
            marginTop: 'auto', 
            flexWrap: 'wrap',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f3f4f6'
          }}>
            <div style={{ textAlign: 'center', flex: '1 1 120px' }}>
              <div style={{ 
                fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>{(siteStats.totalVideos ?? 1200).toLocaleString('id-ID')}+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Materi Video</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(0,0,0,0.05)', display: 'block' }}></div>
            <div style={{ textAlign: 'center', flex: '1 1 120px' }}>
              <div style={{ 
                fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, var(--accent) 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>{(siteStats.totalLearners ?? 15000).toLocaleString('id-ID')}+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Pembelajar Aktif</div>
            </div>
          </div>
          </div>

          {/* Card 2: Statistik Web & Flag Counter */}
          <div style={{ 
            flex: 1,
            minWidth: '280px',
            maxWidth: '350px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(29, 77, 51, 0.15), 0 1px 3px rgba(29, 77, 51, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header Statistik */}
            <div style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '1.2rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                Statistik Pengunjung
              </h3>
              <Bookmark size={20} fill="white" />
            </div>

            {/* Content List */}
            <div style={{ padding: '1.5rem', position: 'relative' }}>
              {/* Optional background pattern */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.05,
                backgroundImage: 'radial-gradient(var(--primary) 2px, transparent 2px)',
                backgroundSize: '20px 20px',
                zIndex: 0,
                pointerEvents: 'none'
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500 }}>Hari ini</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{(siteStats.today || 0).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500 }}>Minggu ini</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{(siteStats.week || 0).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500 }}>Bulan ini</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{(siteStats.month || 0).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', alignItems: 'center' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Sedang Online
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 2s infinite' }}></span>
                  </span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{(siteStats.live || 12).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Animasi Pulse untuk Realtime */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse {
                  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                  70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
              `}} />

              {/* Flag Counter Widget */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {/* 
                  Menggunakan widget gratis dari FlagCounter sebagai pengganti gambar statis.
                  Nantinya Anda bisa mengganti URL src ini dengan kode widget milik website Anda sendiri.
                */}
                <a href="https://info.flagcounter.com/8QG3" target="_blank" rel="noreferrer">
                  <img 
                    src="https://s11.flagcounter.com/count2/8QG3/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_1/pageviews_1/flags_0/percent_0/" 
                    alt="Flag Counter" 
                    border="0" 
                    style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} 
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Donut Chart Fakultas */}
          <div style={{ 
            flex: 1,
            minWidth: '280px',
            maxWidth: '350px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(29, 77, 51, 0.15), 0 1px 3px rgba(29, 77, 51, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '1.2rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                Video per Fakultas
              </h3>
              <LineChart size={20} fill="none" color="white" />
            </div>
            <div style={{ padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, minHeight: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Carousels */}
      <div style={{ marginTop: '10px', position: 'relative', zIndex: 10 }}>
        {/* Trending Now */}
        <Carousel title="Trending Now" items={popularVideos} showRank={true} />

        {/* Dynamic Faculties */}
        {(() => {
          const TARGET_CATEGORIES = [
            "Mata Kuliah Umum",
            "Fakultas Ilmu Tarbiyah dan Keguruan",
            "Fakultas Ekonomi dan Bisnis Islam",
            "Fakultas Syariah",
            "Fakultas Dakwah dan Komunikasi Islam",
            "Fakultas Ushuluddin dan Adab",
            "Program Magister dan Doktor",
            "Pendidikan Jarak Jauh (PJJ)",
            "Program Profesi"
          ];

          const grouped = videos.reduce((acc, video) => {
            // Priority 1: Check database API categories mapping
            let resolvedFakultasName = null;
            const searchTerms = [video.category_slug, video.category, video.fakultas].filter(Boolean).map(t => t.toLowerCase());
            
            if (categories && categories.prodi.length > 0) {
              const matchedProdi = categories.prodi.find(p => {
                const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                // Trim trailing dashes from slugs when comparing
                const cleanSlug = slug.replace(/-+$/, '');
                return searchTerms.some(term => {
                  const cleanTerm = term.replace(/-+$/, '');
                  return cleanTerm === cleanSlug || cleanTerm === p.name.toLowerCase();
                });
              });
              
              if (matchedProdi) {
                const parentFak = categories.fakultas.find(f => f.id === matchedProdi.fakultasId);
                if (parentFak) {
                  resolvedFakultasName = parentFak.name;
                }
              } else {
                // Check if it directly matches a faculty
                const matchedFak = categories.fakultas.find(f => 
                  searchTerms.some(term => term === f.name.toLowerCase())
                );
                if (matchedFak) {
                  resolvedFakultasName = matchedFak.name;
                }
              }
            }

            // Rename Pascasarjana for display
            if (resolvedFakultasName && resolvedFakultasName.includes('Pascasarjana')) {
              resolvedFakultasName = "Program Magister dan Doktor";
            }

            // Fallbacks if not found in db
            let finalTitle = resolvedFakultasName;
            
            if (!finalTitle) {
               // Try to match keywords as a last resort
               const rawStr = searchTerms.join(" ");
               if (rawStr.includes("tarbiyah")) finalTitle = "Fakultas Ilmu Tarbiyah dan Keguruan";
               else if (rawStr.includes("ekonomi") || rawStr.includes("bisnis")) finalTitle = "Fakultas Ekonomi dan Bisnis Islam";
               else if (rawStr.includes("syariah")) finalTitle = "Fakultas Syariah";
               else if (rawStr.includes("dakwah") || rawStr.includes("komunikasi")) finalTitle = "Fakultas Dakwah dan Komunikasi Islam";
               else if (rawStr.includes("ushuluddin") || rawStr.includes("adab")) finalTitle = "Fakultas Ushuluddin dan Adab";
               else if (rawStr.includes("pascasarjana") || rawStr.includes("magister") || rawStr.includes("doktor")) finalTitle = "Program Magister dan Doktor";
               else if (rawStr.includes("pjj")) finalTitle = "Pendidikan Jarak Jauh (PJJ)";
               else if (rawStr.includes("profesi")) finalTitle = "Program Profesi";
               else finalTitle = "Mata Kuliah Umum";
            }

            if (!acc[finalTitle]) acc[finalTitle] = [];
            acc[finalTitle].push(video);
            return acc;
          }, {});

          const renderedGroups = [];
          
          // 1. Add Target Categories in exact order (if they have videos)
          TARGET_CATEGORIES.forEach(catName => {
            if (grouped[catName] && grouped[catName].length > 0) {
              renderedGroups.push({ title: catName, items: grouped[catName] });
              delete grouped[catName];
            }
          });

          // 2. Add remaining categories
          Object.keys(grouped).forEach(catTitle => {
            if (grouped[catTitle] && grouped[catTitle].length > 0) {
              renderedGroups.push({ title: catTitle, items: grouped[catTitle] });
            }
          });

          return renderedGroups.map((group, idx) => {
            const sortedItems = group.items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            return (
              <Carousel key={idx} title={group.title} items={sortedItems} />
            );
          });
        })()}
        
        <Carousel title="Materi Teks & Jurnal" items={allDocuments.slice(0, 10)} />
      </div>

    </div>
  );
}
