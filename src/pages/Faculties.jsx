import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Scale, Globe, Building2, ChevronDown, ChevronUp } from 'lucide-react';

export default function Faculties() {
  const [expandedId, setExpandedId] = useState(null);
  const [facultyStats, setFacultyStats] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stats/faculties`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFacultyStats(data.data);
        }
      })
      .catch(err => console.error('Error fetching faculty stats:', err));
  }, []);

  const faculties = [
    {
      id: 1,
      name: "Fakultas Ilmu Tarbiyah dan Keguruan (FITK)",
      icon: <GraduationCap size={48} />,
      color: "#0F5132",
      count: facultyStats[1] || 0,
      departments: [
        "Pendidikan Agama Islam (S1)",
        "Pendidikan Bahasa Arab (S1)",
        "Tadris Bahasa Inggris (S1)",
        "Tadris Ilmu Pengetahuan Sosial (S1)",
        "Tadris Matematika (S1)",
        "Tadris Biologi (S1)",
        "Pendidikan Guru Madrasah Ibtidaiyah (S1)",
        "Pendidikan Islam Anak Usia Dini (S1)",
        "Manajemen Pendidikan Islam (S1)",
        "Tadris Bahasa Indonesia (S1)",
        "Tadris Kimia (S1)",
        "PJJ Pendidikan Agama Islam (S1)",
        "Pendidikan Profesi Guru Keagamaan (PPG)"
      ]
    },
    {
      id: 2,
      name: "Fakultas Syariah (FS)",
      icon: <Scale size={48} />,
      color: "#198754",
      count: facultyStats[2] || 0,
      departments: [
        "Hukum Keluarga (Akhwalul Syaksiyah) (S1)",
        "Hukum Ekonomi Syari'ah (Muamalah) (S1)",
        "Hukum Tatanegara Islam (S1)",
        "Ilmu Falak (S1)"
      ]
    },
    {
      id: 3,
      name: "Fakultas Ushuluddin dan Adab (FUA)",
      icon: <BookOpen size={48} />,
      color: "#20c997",
      count: facultyStats[3] || 0,
      departments: [
        "Sejarah Peradaban Islam (S1)",
        "Aqidah dan Filsafat Islam (S1)",
        "Ilmu Al-Qur'an dan Tafsir (S1)",
        "Ilmu Hadis (S1)",
        "Bahasa dan Sastra Arab (S1)",
        "Tasawuf dan Psikoterapi (S1)"
      ]
    },
    {
      id: 4,
      name: "Fakultas Ekonomi dan Bisnis Islam (FEBI)",
      icon: <Building2 size={48} />,
      color: "#F9A826",
      count: facultyStats[4] || 0,
      departments: [
        "Perbankan Syariah (S1)",
        "Ekonomi Syariah (S1)",
        "Akuntansi Syariah (S1)",
        "Pariwisata Syariah (S1)"
      ]
    },
    {
      id: 5,
      name: "Fakultas Dakwah dan Komunikasi Islam (FDKI)",
      icon: <Globe size={48} />,
      color: "#ff4757",
      count: facultyStats[5] || 0,
      departments: [
        "Komunikasi dan Penyiaran Islam (S1)",
        "Pengembangan Masyarakat Islam (S1)",
        "Bimbingan dan Konseling Islam (S1)",
        "Sosiologi Agama (S1)"
      ]
    },
    {
      id: 6,
      name: "Fakultas Pascasarjana",
      icon: <BookOpen size={48} />,
      color: "#8e44ad",
      count: facultyStats[6] || 0,
      departments: [
        "Manajemen Pendidikan Islam (S2)",
        "Pendidikan Agama Islam (S2)",
        "Hukum Keluarga (Akhwalul Syaksiyah) (S2)",
        "Ekonomi Syariah (S2)",
        "Pengembangan Masyarakat Islam (S2)",
        "PJJ Pendidikan Agama Islam (S2)",
        "Pendidikan Agama Islam (S3)",
        "Hukum Keluarga Islam (Ahwal Syakhshiyyah) (S3)"
      ]
    }
  ];

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
        {faculties.map((faculty) => (
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
              <div style={{ color: faculty.color }}>
                {faculty.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{faculty.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{faculty.count} Modul & Jurnal Tersedia</p>
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
                  {faculty.departments.map((dept, idx) => (
                    <div key={idx} style={{ 
                      background: 'white', 
                      padding: '1rem', 
                      borderRadius: '8px', 
                      border: '1px solid #E9ECEF',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = faculty.color;
                      e.currentTarget.style.color = faculty.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#E9ECEF';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }}>
                      <span style={{ fontWeight: 500 }}>{dept}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
