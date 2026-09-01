import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 2rem' }}>
      <Helmet>
        <title>Hubungi Kami | OIER UIN Siber</title>
        <meta name="description" content="Hubungi dukungan teknis OIER UIN Siber Syekh Nurjati." />
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface-color)', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ color: 'var(--primary-dark)', textAlign: 'center', marginBottom: '2rem' }}>Hubungi Kami</h1>
        
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '3rem', textAlign: 'center' }}>
          Kami siap membantu! Jika Anda mengalami kendala teknis atau memiliki pertanyaan seputar materi akademik, silakan hubungi tim dukungan kami.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Alamat Kampus</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Jl. Perjuangan By Pass Sunyaragi<br/>
                Kesambi, Kota Cirebon<br/>
                Jawa Barat 45132
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Email Dukungan</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                support@oier.uinsiber.ac.id<br/>
                info@uinsiber.ac.id
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Telepon / WhatsApp</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                +62 231 481264 (Office)<br/>
                +62 812 3456 7890 (WA Support)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Jam Operasional</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Senin - Jumat: 08:00 - 16:00 WIB<br/>
                Sabtu - Minggu: Tutup
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
