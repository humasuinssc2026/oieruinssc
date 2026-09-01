import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 2rem' }}>
      <Helmet>
        <title>Kebijakan Privasi | OIER UIN Siber</title>
        <meta name="description" content="Kebijakan Privasi OIER UIN Siber Syekh Nurjati." />
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface-color)', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ color: 'var(--primary-dark)', textAlign: 'center', marginBottom: '2rem' }}>Kebijakan Privasi</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Pembaruan Terakhir: 27 Agustus 2026</p>

        <div style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p>
            Universitas Islam Negeri (UIN) Siber Syekh Nurjati Cirebon menghargai privasi pengunjung dan pengguna platform <strong>Open Islamic Education Resources (OIER)</strong>. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi Anda.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>1. Informasi yang Kami Kumpulkan</h3>
          <p>Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar atau berinteraksi dengan layanan kami, termasuk namun tidak terbatas pada:</p>
          <ul>
            <li>Nama lengkap</li>
            <li>Alamat email</li>
            <li>NIM/NIP (Jika berlaku)</li>
            <li>Riwayat akses materi dan diskusi (komentar)</li>
          </ul>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>2. Penggunaan Informasi</h3>
          <p>Informasi yang kami kumpulkan digunakan untuk keperluan:</p>
          <ul>
            <li>Menyediakan, memelihara, dan meningkatkan kualitas layanan platform OIER.</li>
            <li>Personalisasi pengalaman belajar Anda (misalnya: riwayat materi terakhir yang dilihat).</li>
            <li>Berkomunikasi dengan Anda terkait pemberitahuan penting, pembaruan keamanan, atau layanan teknis.</li>
          </ul>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>3. Keamanan Data</h3>
          <p>
            Kami menerapkan standar keamanan industri (termasuk enkripsi kata sandi menggunakan standar Bcrypt dan perlindungan token JWT) untuk melindungi data Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Namun, tidak ada metode transmisi di internet yang 100% aman; oleh karena itu, Anda juga diwajibkan untuk menjaga kerahasiaan kata sandi Anda.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>4. Berbagi Informasi Pihak Ketiga</h3>
          <p>
            OIER UIN Siber tidak pernah menjual, menyewakan, atau memperdagangkan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan data jika diwajibkan oleh hukum atau instruksi resmi dari instansi penegak hukum Republik Indonesia.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>5. Hak Akses dan Kendali Anda</h3>
          <p>
            Sebagai pengguna terdaftar, Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi profil Anda kapan saja melalui halaman pengaturan akun (Profile).
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>6. Hubungi Kami</h3>
          <p>
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <a href="/contact" style={{ color: 'var(--primary)' }}>Kontak Kami</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
