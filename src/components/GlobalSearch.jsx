import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 2) {
      const fetchResults = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials?search=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data.success) {
            setResults(data.data.slice(0, 5)); // show top 5
            setIsOpen(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        }
      };
      
      const debounceTimer = setTimeout(fetchResults, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (material) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/material/${material.id}`);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: '50px' }}>
        <Search size={18} color=`var(--text-muted)" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari materi, video..." 
          style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', outline: 'none', width: '100%', color: 'var(--text-main)' }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
          background: 'var(--surface-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          borderRadius: '12px', overflow: 'hidden', zIndex: 100
        }}>
          {results.map(item => (
            <div 
              key={item.id} 
              onClick={() => handleSelect(item)}
              style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--surface-hover)' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {item.type === 'video' ? <Video size={16} color="var(--primary)" /> : <FileText size={16} color="var(--primary)" />}
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category_slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
