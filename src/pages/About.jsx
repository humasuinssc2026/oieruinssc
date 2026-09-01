import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Users, Globe, Target } from 'lucide-react';

export default function About() {
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 2rem' }}>
      <Helmet>
        <title>Tentang Kami | OIER UIN Siber</title>
        <meta name="description" content="Pelajari lebih lanjut tentang Open Islamic Education Resources (OIER) UIN Siber Syekh Nurjati." />
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface-color)', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ color: 'var(--primary-dark)', textAlign: 'center', marginBottom: '2rem' }}>Tentang OIER UIN Siber</h1>
        
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '2rem' }}>
          <strong>Open Islamic Education Resources (OIER)</strong> adalah platform pembelajaran digital terbuka yang dikembangkan oleh Universitas Islam Negeri (UIN) Siber Syekh Nurjati Cirebon. Kami berdedikasi untuk menyediakan akses pendidikan Islam dan materi kuliah berkualitas tinggi kepada seluruh lapisan masyarakat, kapan saja dan di mana saja.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <Globe size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-main)' }}>Akses Terbuka</h3>
            <p style={{ color: 'var(--text-muted)' }}>Materi pendidikan yang dapat diakses secara gratis oleh siapa saja.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <BookOpen size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-main)' }}>Kualitas Unggul</h3>
            <p style={{ color: 'var(--text-muted)' }}>Kurikulum dan materi disusun oleh para ahli dan dosen berpengalaman.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <Target size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-main)' }}>Visi Digital</h3>
            <p style={{ color: 'var(--text-muted)' }}>Mendukung transformasi pendidikan Islam menuju era digital cerdas.</p>
          </div>
        </div>

        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Visi & Misi</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          Menjadi pusat rujukan utama pendidikan jarak jauh berbasis teknologi siber yang berlandaskan pada nilai-nilai keislaman, keindonesiaan, dan kemanusiaan. Kami berkomitmen untuk terus berinovasi dalam menyajikan konten pembelajaran yang interaktif dan mudah dipahami.
        </p>
      </div>
    </div>
  );
}
