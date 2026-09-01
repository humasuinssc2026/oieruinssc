import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// Konfigurasi NProgress
nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function TopProgressBar() {
  const location = useLocation();

  useEffect(() => {
    // Mulai progress bar setiap kali rute URL berubah
    nprogress.start();
    
    // Beri sedikit jeda agar tidak langsung selesai, memberi efek transisi
    const timer = setTimeout(() => {
      nprogress.done();
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location.pathname]); // Dipicu ulang setiap kali pathname berubah

  return null; // Komponen ini tidak merender UI React, hanya mengontrol DOM NProgress
}
