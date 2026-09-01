const { getDBConnection } = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const db = await getDBConnection();
    const userId = req.user.id;

    const [users] = await db.query(
      'SELECT id, first_name, last_name, email, role, created_at, profile_pic FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil profil' });
  }
};

const getHistory = async (req, res) => {
  try {
    const db = await getDBConnection();
    const userId = req.user.id;

    const [history] = await db.query(
      `SELECT h.last_accessed, m.id, m.title, m.type, m.category_slug 
       FROM user_history h
       JOIN materials m ON h.material_id = m.id
       WHERE h.user_id = ?
       ORDER BY h.last_accessed DESC`,
      [userId]
    );

    const [totalMaterials] = await db.query('SELECT COUNT(id) as total FROM materials');
    const total = totalMaterials[0].total || 0;
    const completed = history.length;
    const progress_percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ 
      success: true, 
      data: history,
      progress: {
        total,
        completed,
        percentage: progress_percentage
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat belajar' });
  }
};

const recordHistory = async (req, res) => {
  try {
    const db = await getDBConnection();
    const userId = req.user.id;
    const { material_id } = req.body;

    if (!material_id) {
      return res.status(400).json({ success: false, message: 'Material ID dibutuhkan' });
    }

    await db.query(
      `INSERT INTO user_history (user_id, material_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE last_accessed = CURRENT_TIMESTAMP`,
      [userId, material_id]
    );

    res.json({ success: true, message: 'Riwayat berhasil dicatat' });
  } catch (error) {
    console.error('Error recording history:', error);
    res.status(500).json({ success: false, message: 'Gagal mencatat riwayat' });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
    }

    const db = await getDBConnection();
    const userId = req.user.id;
    const fileUrl = `/uploads/profiles/${req.file.filename}`;

    await db.query(
      'UPDATE users SET profile_pic = ? WHERE id = ?',
      [fileUrl, userId]
    );

    res.json({ success: true, message: 'Foto profil berhasil diperbarui', profile_pic: fileUrl });
  } catch (error) {
    console.error('Error uploading profile pic:', error);
    res.status(500).json({ success: false, message: 'Gagal mengunggah foto profil' });
  }
};

module.exports = {
  getProfile,
  getHistory,
  recordHistory,
  uploadProfilePic
};
