import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, Video, Library, ChevronRight, CheckCircle, Users, Award, PlayCircle, Eye, Activity, Calendar, Clock, ChevronDown, ChevronUp, GraduationCap, BookText, Microscope, Quote, MessageCircle, Star } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../utils/Store';

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

export default function Home() {
  const { videos, documents } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const [siteStats, setSiteStats] = useState({ live: 0, today: 0, week: 0, month: 0, totalVideos: 0, totalLearners: 0 });
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Record visit if not recorded in this session
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

    // Fetch Testimonials
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stats/testimonials`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setTestimonials(data.data);
        } else {
          // Fallback if no reviews yet
          setTestimonials([
            { user_name: 'Admin', rating: 5, comment: 'Belum ada ulasan yang disetujui. Jadilah yang pertama memberikan ulasan!' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };

    recordVisit().then(() => {
      fetchStats();
      fetchTestimonials();
    });
    
    // Refresh live stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    // Animasi Reveal saat Scroll
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(r => observer.observe(r));

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/videos');
    }
  };

  const popularVideos = [...videos].sort((a, b) => {
    return (b.views || 0) - (a.views || 0); 
  }).slice(0, 12);

  const faculties = [
    { name: 'Ilmu Tarbiyah dan Keguruan', icon: <GraduationCap size={32} />, color: '#10b981', desc: 'Fakultas Pendidikan' },
    { name: 'Syariah dan Ekonomi Islam', icon: <BookText size={32} />, color: '#3b82f6', desc: 'Fakultas Hukum & Ekonomi' },
    { name: 'Ushuluddin dan Adab', icon: <Library size={32} />, color: '#8b5cf6', desc: 'Fakultas Pemikiran Islam' },
    { name: 'Dakwah dan Komunikasi', icon: <MessageCircle size={32} />, color: '#f59e0b', desc: 'Fakultas Komunikasi' }
  ];


  const faqs = [
    { q: 'Apakah platform ini gratis untuk umum?', a: 'Ya, OIER UIN Siber memegang prinsip Open Education. Sebagian besar materi dapat diakses secara gratis oleh siapa saja.' },
    { q: 'Bagaimana cara mengunduh materi PDF?', a: 'Anda hanya perlu mendaftar dan login. Setelah itu, buka halaman materi dan tombol unduh akan tersedia.' },
    { q: 'Apakah materi ini diakui secara akademis?', a: 'Tentu saja. Seluruh materi dan video telah diverifikasi dan disusun langsung oleh tenaga ahli akademik UIN Siber Syekh Nurjati.' },
    { q: 'Bisakah saya mengakses dari smartphone?', a: 'Sangat bisa. Tampilan website kami sudah sepenuhnya dioptimalkan (responsif) untuk layar handphone, tablet, hingga desktop.' }
  ];

  return (
    <div className="home-page" style={{ background: '#F4F7F6', overflowX: 'hidden' }}>
      <Helmet>
        <title>Beranda | OIER UIN Siber</title>
        <meta property="og:title" content="Beranda | OIER UIN Siber" />
        <meta property="og:description" content="Jelajahi materi pembelajaran dan video edukasi keislaman berkualitas tinggi secara gratis di OIER UIN Siber Syekh Nurjati." />
        <meta name="description" content="Platform Pembelajaran Terbuka UIN Siber Syekh Nurjati Cirebon. Akses ribuan materi kuliah, jurnal, dan video pembelajaran." />
      </Helmet>
      
      {/* 1. Modern Hero Section */}
      <section style={{ 
        background: 'url("/gedung-uinssc.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative', 
        padding: '8rem 2rem 10rem', 
        overflow: 'hidden' 
      }}>
        {/* Dark Overlay for better contrast */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 0 }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '4rem', position: 'relative', zIndex: 1 }}>
          
          {/* Left Text (Glassmorphism Box) */}
          <div style={{ 
            flex: '1 1 500px', 
            background: 'rgba(255, 255, 255, 0.85)', 
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)',
            padding: '3rem', 
            borderRadius: '24px', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
            <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(25,135,84,0.15)', color: 'var(--primary-dark)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', animation: 'fadeInDown 0.5s' }}>
              🌟 Platform Pembelajaran Terbuka
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              Open Islamic <br/>
              <span style={{ color: 'var(--primary)' }}>Education Resources</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Akses ribuan materi kuliah, video pembelajaran, dan modul interaktif resmi dari pakar akademisi UIN Siber Syekh Nurjati Cirebon.
            </p>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', background: 'white', padding: '0.5rem', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', flex: 1 }}>
                <Search size={20} color="var(--text-muted)" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Materi apa yang ingin dipelajari?" 
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 2rem', fontSize: '1rem' }}>Cari</button>
            </form>
          </div>

          {/* Right Visual/Cards (Glassmorphism) */}
          <div style={{ flex: '1 1 500px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '450px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(16px)', 
              WebkitBackdropFilter: 'blur(16px)',
              padding: '2.5rem', 
              borderRadius: '24px', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              position: 'relative' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Video size={30} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'white' }}>{(siteStats.totalVideos ?? 1200).toLocaleString('id-ID')}+ Video Interaktif</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>Modul multimedia terbaru</p>
                </div>
              </div>
              
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ width: '100%', height: '100%', background: '#4ade80' }}></div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="rgba(255,255,255,0.9)" />
                <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{(siteStats.totalLearners ?? 15000).toLocaleString('id-ID')}+ Pembelajar Aktif</span>
              </div>
              
              {/* Mini Chart di dalam Slide */}
              <div style={{ marginTop: '2rem', width: '100%', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'Live', pengunjung: siteStats.live || 0 },
                      { name: 'Hari', pengunjung: siteStats.today || 0 },
                      { name: 'Minggu', pengunjung: siteStats.week || 0 },
                      { name: 'Bulan', pengunjung: siteStats.month || 0 }
                    ]} 
                    margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                    barSize={35}
                  >
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ fontWeight: 700, color: 'white' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '2px' }}
                    />
                    <Bar dataKey="pengunjung" radius={[6, 6, 0, 0]}>
                      {
                        [
                          { fill: '#ef4444' }, // Merah - Live
                          { fill: '#10b981' }, // Hijau - Hari ini
                          { fill: '#3b82f6' }, // Biru - Minggu ini
                          { fill: '#8b5cf6' }  // Ungu - Bulan ini
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

        </div>
      </section>



      {/* 3. Features Strip */}
      <section className="reveal" style={{ padding: '1rem 2rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between' }}>
          {[
            { icon: <BookOpen size={24} />, title: "Akses Terbuka & Gratis", desc: "Semua materi dapat diakses tanpa biaya tambahan." },
            { icon: <CheckCircle size={24} />, title: "Materi Terverifikasi", desc: "Disusun langsung oleh tenaga ahli akademik." },
            { icon: <PlayCircle size={24} />, title: "Belajar Fleksibel", desc: "Tonton video dan baca modul kapanpun Anda mau." },
          ].map((feat, idx) => (
            <div key={idx} style={{ 
              flex: '1 1 300px', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1.2rem',
              background: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(25,135,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                {feat.icon}
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{feat.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* 4. Latest Courses / Materials */}
      <section className="reveal" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Video Populer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Tonton video pembelajaran yang paling banyak diminati.</p>
          </div>
          <Link to="/videos" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', borderRadius: '50px' }}>
            Jelajah Materi <ChevronRight size={18} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {popularVideos.length > 0 ? popularVideos.map((mat, idx) => {
            const isVideo = mat.type === 'video';
            const previewUrl = isVideo ? getGDrivePreviewUrl(mat.file_url || mat.url) : null;
            return (
              <Link to={isVideo ? "/videos" : "/general-studies"} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                  background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' 
                }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
                  
                  {/* Thumbnail */}
                  <div style={{ aspectRatio: '16/9', position: 'relative', background: isVideo ? '#000' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isVideo ? (
                    mat.thumbnail_url ? (
                      <img src={`${import.meta.env.VITE_API_URL}${mat.thumbnail_url}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <PlayCircle size={48} opacity={0.5} />
                      </div>
                    )
                  ) : (
                      isVideo ? <PlayCircle size={48} color="rgba(255,255,255,0.5)" /> : <BookOpen size={48} color="rgba(255,255,255,0.5)" />
                    )}
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', color: 'var(--text-dark)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      {isVideo ? <Video size={14} color="var(--primary)" /> : <BookOpen size={14} color="var(--primary)" />}
                      {isVideo ? 'Video Pembelajaran' : 'Modul Teks'}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{mat.category || mat.category_slug}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Eye size={14} /> {mat.views || 0}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', lineHeight: 1.4, color: 'var(--text-main)', flex: 1 }}>
                      {mat.title}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #e9ecef', paddingTop: '1rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {mat.author?.charAt(0).toUpperCase() || 'D'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{mat.mata_kuliah || 'Mata Kuliah Umum'}</span> <br/>
                        {mat.author}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }) : (
            // Skeleton / Placeholder if no data
            [1,2,3,4].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ aspectRatio: '16/9', background: '#e9ecef' }}></div>
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ width: '40%', height: '14px', background: '#e9ecef', borderRadius: '4px', marginBottom: '1rem' }}></div>
                  <div style={{ width: '90%', height: '20px', background: '#e9ecef', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                  <div style={{ width: '60%', height: '20px', background: '#e9ecef', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4.5. Testimonials (Social Proof) */}
      <section className="reveal" style={{ padding: '4rem 2rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Apa Kata Mereka?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Pengalaman belajar mahasiswa dengan platform OIER.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((testi, idx) => (
              <div key={idx} style={{ 
                background: '#F8FAFC', padding: '2rem', borderRadius: '24px', position: 'relative',
                border: '1px solid #e2e8f0'
              }}>
                <Quote size={40} color="var(--primary)" style={{ opacity: 0.1, position: 'absolute', top: '1.5rem', right: '2rem' }} />
                
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < (testi.rating || 5) ? 'currentColor' : 'none'} color={i < (testi.rating || 5) ? 'currentColor' : '#cbd5e1'} />
                  ))}
                </div>

                <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '2rem', position: 'relative', zIndex: 1, fontStyle: 'italic' }}>
                  "{testi.comment || testi.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {(testi.user_name || testi.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1rem' }}>{testi.user_name || testi.name}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{testi.role || 'Mahasiswa'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Basic Keyframes for float animation (handled via inline style for simplicity if external CSS isn't possible, but better in CSS) */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-card-modern:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important;
        }
        @media (max-width: 900px) {
          .home-page section > div:nth-child(2) > div { border-left: none !important; padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
