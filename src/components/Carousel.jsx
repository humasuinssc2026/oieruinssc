import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, Video, BookOpen, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function Carousel({ title, items, showRank = false }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="carousel-container" style={{ margin: '3rem 0', position: 'relative' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', paddingLeft: '4%', color: 'var(--text-h)', fontWeight: 600 }}>{title}</h2>
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Left Scroll Button */}
        <button 
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            height: '100%',
            width: '4%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s'
          }}
          className="carousel-btn left"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            padding: '1rem 4%',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none',  // IE and Edge
          }}
          className="carousel-scroll"
        >
          {items.map((mat, idx) => {
            const isVideo = mat.type === 'video';
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            return (
              <Link to={isVideo ? "/videos" : "/general-studies"} key={idx} style={{ textDecoration: 'none', color: 'inherit', flex: '0 0 auto', width: 'calc((100vw - 8vw - 60px) / 6)' }}>
                <div 
                  className="carousel-item"
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    transition: 'transform 0.3s ease', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ aspectRatio: '16/9', position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isVideo && mat.thumbnail_url ? (
                      <img src={`${apiUrl}${mat.thumbnail_url}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {isVideo ? <PlayCircle size={48} opacity={0.5} /> : <BookOpen size={48} opacity={0.5} color="var(--primary)" />}
                      </div>
                    )}

                    {/* Rank Number (Top Left) */}
                    {showRank && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '0px',
                        fontSize: '6rem',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 1)',
                        textShadow: '0px 0px 10px rgba(0,0,0,0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                        lineHeight: 1,
                        zIndex: 2,
                        fontFamily: 'Impact, Arial Black, sans-serif'
                      }}>
                        {idx + 1}
                      </div>
                    )}
                    
                    
                    {/* Badge */}
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {isVideo ? <Video size={12} color="var(--accent)" /> : <BookOpen size={12} color="var(--accent)" />}
                      {isVideo ? 'Video' : 'Modul'}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>{mat.category || mat.category_slug}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <Eye size={12} /> {mat.views || 0}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.3, color: 'var(--text-h)', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {mat.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button 
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            height: '100%',
            width: '4%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s'
          }}
          className="carousel-btn right"
        >
          <ChevronRight size={40} />
        </button>
      </div>
      
      {/* CSS for hover effects */}
      <style>{`
        .carousel-scroll::-webkit-scrollbar {
          display: none;
        }
        .carousel-container:hover .carousel-btn {
          opacity: 1 !important;
        }
        .carousel-btn:hover {
          background: rgba(0,0,0,0.8) !important;
        }
        .carousel-item:hover {
          transform: scale(1.05) !important;
          z-index: 5;
        }
      `}</style>
    </div>
  );
}
