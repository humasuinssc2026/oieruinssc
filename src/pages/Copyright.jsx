import React from 'react';

export default function Copyright() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 style={{ color: 'var(--text-h)', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Hak Cipta (Copyright)</h1>
      
      <div style={{ color: 'var(--text-main)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.05rem' }}>
        <p>
          Seluruh konten, materi pembelajaran, video, teks, grafik, logo, dan elemen antarmuka yang terdapat dalam platform <strong>Open Islamic Education Resources (OIER)</strong> adalah milik <strong>UIN Siber Syekh Nurjati Cirebon</strong> atau pihak ketiga yang telah memberikan lisensi penggunaannya, kecuali dinyatakan lain secara eksplisit.
        </p>

        <section>
          <h2 style={{ color: 'var(--text-h)', fontSize: '1.4rem', marginBottom: '1rem', marginTop: '1rem' }}>1. Lisensi Terbuka (Open Educational Resources)</h2>
          <p>
            Sebagian besar materi edukasi dan video di dalam platform ini didistribusikan di bawah lisensi terbuka (seperti Creative Commons) yang memungkinkan pengguna untuk menggunakan, membagikan, dan mengadaptasi materi untuk tujuan pendidikan dan non-komersial, dengan syarat memberikan atribusi (kredit) yang sesuai kepada <strong>OIER UIN Siber Syekh Nurjati Cirebon</strong> dan kreator aslinya. Pastikan Anda memeriksa jenis lisensi spesifik yang tertera pada masing-masing materi sebelum menggunakannya ulang.
          </p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-h)', fontSize: '1.4rem', marginBottom: '1rem', marginTop: '1rem' }}>2. Pembatasan Penggunaan</h2>
          <p>
            Sebagai pengguna platform ini, Anda <strong>tidak diperkenankan</strong> untuk:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Menggunakan materi dari platform ini untuk tujuan komersial atau meraup keuntungan finansial tanpa izin tertulis dari pihak kampus.</li>
            <li>Mengklaim kepemilikan, menyalin secara utuh, dan mengakui materi pembelajaran dari OIER sebagai karya pribadi.</li>
            <li>Mengubah makna, memotong, atau menyunting materi sedemikian rupa sehingga merugikan reputasi institusi, dosen pembuat materi, atau keluar dari konteks ajaran Islam yang moderat.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-h)', fontSize: '1.4rem', marginBottom: '1rem', marginTop: '1rem' }}>3. Penggunaan Merek dan Logo</h2>
          <p>
            Logo "OIER" dan logo "UIN Siber Syekh Nurjati Cirebon" adalah identitas visual institusi. Penggunaan logo-logo tersebut untuk keperluan pihak ketiga (seperti dalam poster, website lain, atau materi promosi) tanpa persetujuan resmi dari pihak kampus adalah sangat dilarang, kecuali sekadar merujuk secara faktual (hyperlink) kepada layanan kami.
          </p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-h)', fontSize: '1.4rem', marginBottom: '1rem', marginTop: '1rem' }}>4. Pelaporan Pelanggaran Hak Cipta</h2>
          <p>
            Kami sangat menghormati hak kekayaan intelektual (HAKI) pihak lain. Jika Anda (baik kreator internal maupun eksternal) merasa bahwa karya Anda telah digunakan atau diunggah di platform OIER ini dengan cara yang melanggar hak cipta, silakan hubungi tim administrator kami dengan menyertakan bukti kepemilikan yang sah melalui email: <strong>oier@uinssc.ac.id</strong>. Kami akan segera menindaklanjuti laporan tersebut dan menurunkannya <em>(take down)</em> jika terbukti melanggar.
          </p>
        </section>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
