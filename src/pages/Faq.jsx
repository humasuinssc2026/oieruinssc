import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Faq() {
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const faqs = [
    { q: 'Apakah platform ini gratis untuk umum?', a: 'Ya, OIER UIN Siber memegang prinsip Open Education. Sebagian besar materi dapat diakses secara gratis oleh siapa saja.' },
    { q: 'Bagaimana cara mengunduh materi PDF?', a: 'Anda hanya perlu mendaftar dan login. Setelah itu, buka halaman materi dan tombol unduh akan tersedia.' },
    { q: 'Apakah materi ini diakui secara akademis?', a: 'Tentu saja. Seluruh materi dan video telah diverifikasi dan disusun langsung oleh tenaga ahli akademik UIN Siber Syekh Nurjati.' },
    { q: 'Bisakah saya mengakses dari smartphone?', a: 'Sangat bisa. Tampilan website kami sudah sepenuhnya dioptimalkan (responsif) untuk layar handphone, tablet, hingga desktop.' }
  ];

  return (
    <div style={{ background: '#F4F7F6', minHeight: 'calc(100vh - 100px)', padding: '5rem 2rem' }}>
      <Helmet>
        <title>FAQ | OIER UIN Siber</title>
      </Helmet>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Pertanyaan yang Sering Diajukan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: 0 }}>Punya pertanyaan? Kami punya jawabannya.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ 
              background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.3s ease',
              boxShadow: faqOpenIndex === idx ? '0 10px 30px rgba(0,0,0,0.05)' : 'none'
            }}>
              <button 
                onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                style={{ 
                  width: '100%', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: faqOpenIndex === idx ? 'var(--primary)' : 'var(--text-dark)', fontWeight: 600, fontSize: '1.1rem'
                }}
              >
                {faq.q}
                {faqOpenIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div style={{ 
                maxHeight: faqOpenIndex === idx ? '200px' : '0', opacity: faqOpenIndex === idx ? 1 : 0, overflow: 'hidden',
                transition: 'all 0.3s ease-in-out', padding: faqOpenIndex === idx ? '0 2rem 1.5rem' : '0 2rem'
              }}>
                <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
