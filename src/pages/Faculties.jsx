import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Scale, Globe, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Faculties() {
  const [expandedId, setExpandedId] = useState(null);
  const [facultyStats, setFacultyStats] = useState({});
  const [fakultasList, setFakultasList] = useState([]);
  const [prodiList, setProdiList] = useState([]);

  useEffect(() => {
    // Fetch stats
    fetch(`${import.meta.env.VITE_API_URL}/api/stats/faculties`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFacultyStats(data.data);
        }
      })
      .catch(err => console.error('Error fetching faculty stats:', err));

    // Fetch categories dynamically
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFakultasList(data.data.fakultasList);
          setProdiList(data.data.prodiList);
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const getFacultyStyle = (id) => {
    switch(id) {
      case 1: return { icon: <GraduationCap size={48} />, color: "#0F5132" }; // FITK
      case 2: return { icon: <Building2 size={48} />, color: "#F9A826" }; // FEBI
      case 3: return { icon: <Scale size={48} />, color: "#198754" }; // Syariah
      case 4: return { icon: <Globe size={48} />, color: "#ff4757" }; // FDKI
      case 5: return { icon: <BookOpen size={48} />, color: "#20c997" }; // FUA
      case 6: return { icon: <BookOpen size={48} />, color: "#8e44ad" }; // Pascasarjana
      case 7: return { icon: <Globe size={48} />, color: "#0dcaf0" }; // PJJ
      case 8: return { icon: <GraduationCap size={48} />, color: "#6c757d" }; // Profesi
      default: return { icon: <BookOpen size={48} />, color: "#6c757d" };
    }
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Header Halaman */}
      <div style={{ background: 'var(--primary-dark)', padding: '4rem 2rem', color: 'white', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Fakultas & Jurusan</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.9, fontSize: '1.1rem' }}>
          Jelajahi berbagai materi spesifik akademik yang disusun langsung oleh dosen-dosen pakar di masing-masing fakultas UIN Siber Syekh Nurjati Cirebon.
        </p>
      </div>

      {/* Grid Fakultas */}
      <div style={{ maxWidth: '1000px', margin: '-3rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        {fakultasList.map((faculty) => {
          const style = getFacultyStyle(faculty.id);
          const departments = prodiList.filter(p => p.fakultasId === faculty.id);
          const count = facultyStats[faculty.id] || 0;

          return (
            <div 
              key={faculty.id} 
              style={{
                background: 'white',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1.5rem',
                overflow: 'hidden',
                transition: 'var(--transition)'
              }}
            >
              {/* Faculty Header Card */}
              <div 
                style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer' }}
                onClick={() => setExpandedId(expandedId === faculty.id ? null : faculty.id)}
              >
                <div style={{ color: style.color }}>
                  {style.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{faculty.name}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>{count} Modul & Jurnal Tersedia</p>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {expandedId === faculty.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {/* Expanded Content (Departments) */}
              {expandedId === faculty.id && (
                <div style={{ 
                  background: '#F8F9FA', 
                  padding: '1.5rem 2rem 2rem 7.5rem',
                  borderTop: '1px solid #E9ECEF'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Program Studi:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {departments.map((dept) => {
                      const slug = dept.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <Link 
                          key={dept.id} 
                          to={`/videos?category=${slug}`}
                          style={{ 
                            background: 'white', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid #E9ECEF',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            textDecoration: 'none',
                            color: 'var(--text-main)',
                            display: 'block'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = style.color;
                            e.currentTarget.style.color = style.color;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#E9ECEF';
                            e.currentTarget.style.color = 'var(--text-main)';
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>{dept.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
