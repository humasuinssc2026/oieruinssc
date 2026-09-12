import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, FileText, Video, PlayCircle } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 2rem' }}>
      <Helmet>
        <title>Hasil Pencarian: {query} | OIER UIN Siber</title>
      </Helmet>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>
          Hasil Pencarian untuk: <span style={{ color: 'var(--primary)' }}>"{query}"</span>
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>Memuat hasil...</div>
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: 'var(--surface-color)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <Search size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-muted)' }}>Tidak Ada Hasil Ditemukan</h3>
            <p style={{ color: 'var(--text-muted)' }}>Coba gunakan kata kunci lain yang lebih umum.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {results.map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/material/${item.id}`)} 
                style={{ 
                  cursor: 'pointer', background: 'var(--surface-color)', borderRadius: '12px', 
                  overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s, box-shadow 0.2s' 
                }} 
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }} 
                onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)'; }}
              >
                <div style={{ aspectRatio: '16/9', background: '#e2e8f0', position: 'relative' }}>
                  {item.thumbnail_url ? (
                    <img src={`${import.meta.env.VITE_API_URL}${item.thumbnail_url}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white' }}>
                      {item.type === 'video' ? <PlayCircle size={40} /> : <FileText size={40} />}
                    </div>
                  )}
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {item.type === 'video' ? <Video size={12} /> : <FileText size={12} />}
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(25,135,84,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {item.category_slug}
                  </span>
                  <h4 style={{ margin: '0.75rem 0 0.5rem 0', fontSize: '1rem', lineHeight: 1.4, color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Oleh {item.author || 'Admin'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
