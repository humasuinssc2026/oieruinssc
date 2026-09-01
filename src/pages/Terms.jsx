import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 2rem' }}>
      <Helmet>
        <title>Syarat dan Ketentuan | OIER UIN Siber</title>
        <meta name="description" content="Syarat dan Ketentuan penggunaan OIER UIN Siber Syekh Nurjati." />
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--surface-color)', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ color: 'var(--primary-dark)', textAlign: 'center', marginBottom: '2rem' }}>Syarat dan Ketentuan</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Pembaruan Terakhir: 27 Agustus 2026</p>

        <div style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
          <p>
            Selamat datang di platform Open Islamic Education Resources (OIER) UIN Siber Syekh Nurjati. Dengan mengakses atau menggunakan platform kami, Anda setuju untuk terikat dengan Syarat dan Ketentuan berikut. Jika Anda tidak setuju, mohon untuk tidak menggunakan platform ini.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>1. Penggunaan Layanan</h3>
          <p>Anda setuju untuk menggunakan layanan ini secara bertanggung jawab. Anda dilarang untuk:</p>
          <ul>
            <li>Menggunakan platform untuk tujuan ilegal atau melanggar hukum yang berlaku.</li>
            <li>Mengunggah atau mendistribusikan virus, *malware*, atau materi berbahaya lainnya.</li>
            <li>Melakukan tindakan *spamming*, ujaran kebencian, atau pelecehan di dalam fitur diskusi/komentar.</li>
          </ul>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>2. Hak Kekayaan Intelektual</h3>
          <p>
            Seluruh konten edukasi (video, dokumen, modul) yang ada di platform ini adalah hak cipta milik kreator atau UIN Siber Syekh Nurjati, kecuali dinyatakan lain di bawah lisensi *Creative Commons*. Anda diperbolehkan menggunakan materi untuk keperluan belajar, namun dilarang keras menjual ulang atau mengakui karya tersebut sebagai milik pribadi.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>3. Akun Pengguna</h3>
          <p>
            Pengguna diwajibkan memberikan informasi yang akurat saat mendaftar. Setiap aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya. Admin OIER berhak menangguhkan (suspend) atau menghapus akun yang terbukti melanggar aturan ini tanpa pemberitahuan sebelumnya.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>4. Pembatasan Tanggung Jawab</h3>
          <p>
            Platform OIER disediakan "sebagaimana adanya" (as is). Kami tidak memberikan jaminan bahwa layanan tidak akan terganggu atau sepenuhnya bebas dari celah teknis. Pengelola dibebaskan dari segala tuntutan kerugian material atau immaterial yang diakibatkan oleh penggunaan aplikasi ini.
          </p>

          <h3 style={{ color: 'var(--primary)', marginTop: '2rem' }}>5. Perubahan Syarat</h3>
          <p>
            UIN Siber Syekh Nurjati berhak untuk memperbarui atau mengubah syarat dan ketentuan ini sewaktu-waktu. Pembaruan akan diberitahukan melalui halaman ini.
          </p>
        </div>
      </div>
    </div>
  );
}
