const { getDBConnection } = require('../config/db');

const recordVisit = async (req, res) => {
  try {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    // If it's localhost, we can use a mock IP based on user agent or something, but 'unknown' or '::1' is fine for local testing.
    
    const db = await getDBConnection();
    await db.execute('INSERT INTO site_visits (ip_address) VALUES (?)', [ip]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error recording visit:', err);
    res.status(500).json({ success: false });
  }
};

const getStats = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    // Pengunjung Live (5 menit terakhir)
    const [live] = await db.query(`SELECT COUNT(DISTINCT ip_address) as count FROM site_visits WHERE visited_at >= NOW() - INTERVAL 5 MINUTE`);
    
    // Hari ini
    const [today] = await db.query(`SELECT COUNT(DISTINCT ip_address) as count FROM site_visits WHERE DATE(visited_at) = CURDATE()`);
    
    // Minggu ini (7 hari terakhir)
    const [week] = await db.query(`SELECT COUNT(DISTINCT ip_address) as count FROM site_visits WHERE visited_at >= DATE(NOW()) - INTERVAL 7 DAY`);
    
    // Bulan ini
    const [month] = await db.query(`SELECT COUNT(DISTINCT ip_address) as count FROM site_visits WHERE YEAR(visited_at) = YEAR(CURDATE()) AND MONTH(visited_at) = MONTH(CURDATE())`);
    
    // Total Video
    const [videos] = await db.query(`SELECT COUNT(id) as count FROM materials WHERE type = 'video'`);
    
    // Total Pembelajar (Unique IP total)
    const [totalVisitors] = await db.query(`SELECT COUNT(DISTINCT ip_address) as count FROM site_visits`);

    res.json({
      success: true,
      data: {
        live: live[0].count,
        today: today[0].count,
        week: week[0].count,
        month: month[0].count,
        totalVideos: videos[0].count,
        totalLearners: totalVisitors[0].count
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false });
  }
};

const getChartData = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    // Growth Chart (Visits for last 7 days)
    const [growth] = await db.query(`
      SELECT DATE(visited_at) as date, COUNT(DISTINCT ip_address) as visits
      FROM site_visits 
      WHERE visited_at >= DATE(NOW()) - INTERVAL 7 DAY
      GROUP BY DATE(visited_at)
      ORDER BY date ASC
    `);

    // Category Chart (Materials per category)
    const [categories] = await db.query(`
      SELECT category_slug as name, COUNT(id) as value
      FROM materials
      GROUP BY category_slug
    `);

    res.json({
      success: true,
      data: {
        growth: growth.map(g => ({ name: new Date(g.date).toLocaleDateString('id-ID', { weekday: 'short' }), visits: g.visits })),
        categories
      }
    });
  } catch (err) {
    console.error('Error fetching chart data:', err);
    res.status(500).json({ success: false });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    // Ambil 3 review tertinggi yang tidak disembunyikan (is_hidden = FALSE)
    const [testimonials] = await db.query(`
      SELECT user_name, rating, comment 
      FROM reviews 
      WHERE rating >= 4 AND is_hidden = FALSE 
      ORDER BY rating DESC, created_at DESC 
      LIMIT 3
    `);

    res.json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil testimonial.' });
  }
};

const getFacultyStats = async (req, res) => {
  try {
    const db = await getDBConnection();
    const [materials] = await db.query(`SELECT category_slug FROM materials`);
    
    // Mapping slug ke ID fakultas berdasarkan yang ada di frontend ContentManager/VideoHub
    const facultyMap = {
      1: ['pai', 'pba', 'tbi', 'tips', 'tmat', 'tbiologi', 'pgmi', 'piaud', 'mpi', 'tbind', 'tkimia', 'pjj-pai', 'ppg', 'pai-s1', 'pba-s1'],
      2: ['hk', 'hes', 'htn', 'ilf'], // FS (Syariah)
      3: ['spi', 'afi', 'iat', 'ilh', 'bsa', 'tp'], // FUA
      4: ['ps', 'es', 'as', 'pars'], // FEBI
      5: ['kpi', 'pmi', 'bki', 'sa'], // FDKI
      6: ['mpi-s2', 'pai-s2', 'hk-s2', 'es-s2', 'pmi-s2', 'pjj-pai-s2', 'pai-s3', 'hki-s3'] // Pascasarjana
    };

    const counts = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    };

    materials.forEach(mat => {
      const slug = mat.category_slug;
      // Temukan fakultas yang memiliki slug ini
      for (const [facultyId, slugs] of Object.entries(facultyMap)) {
        if (slugs.includes(slug)) {
          counts[facultyId]++;
          break;
        }
      }
    });

    res.json({
      success: true,
      data: counts
    });
  } catch (err) {
    console.error('Error fetching faculty stats:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik fakultas.' });
  }
};

module.exports = { recordVisit, getStats, getChartData, getTestimonials, getFacultyStats };
