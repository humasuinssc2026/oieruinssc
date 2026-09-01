const { getDBConnection } = require('../config/db');
const bcrypt = require('bcrypt');

exports.getStats = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    // Total pengunjung (dummy calculation based on total views)
    const [viewsData] = await db.query(`SELECT SUM(views) as totalViews FROM materials`);
    
    // Total modul & video
    const [matsData] = await db.query(`SELECT COUNT(*) as totalMats FROM materials`);
    
    // Menunggu approval (review)
    const [pendingData] = await db.query(`SELECT COUNT(*) as totalPending FROM materials WHERE status = 'review'`);
    
    res.json({
      success: true,
      data: {
        visitors: (viewsData[0].totalViews || 0) + 45000, // Menambahkan dummy 45k karena belum live
        totalMaterials: matsData[0].totalMats || 0,
        pendingApprovals: pendingData[0].totalPending || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik dashboard.' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    const [recent] = await db.query(`
      SELECT m.id, m.title, m.type, m.category_slug, m.author, m.status, DATE_FORMAT(m.created_at, '%d %b %Y') as time
      FROM materials m
      ORDER BY m.created_at DESC
      LIMIT 5
    `);
    
    res.json({
      success: true,
      data: recent
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil aktivitas terbaru.' });
  }
};
const getAllReviews = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    const [reviews] = await db.query(`
      SELECT r.id, r.user_name, r.rating, r.comment, r.created_at, r.is_hidden, m.title as material_title
      FROM reviews r
      LEFT JOIN materials m ON r.material_id = m.id
      ORDER BY r.created_at DESC
    `);
    
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data ulasan.' });
  }
};

const toggleReviewVisibility = async (req, res) => {
  try {
    const db = await getDBConnection();
    const { id } = req.params;
    
    // Check current status
    const [existing] = await db.query('SELECT is_hidden FROM reviews WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan.' });
    }
    
    const newStatus = !existing[0].is_hidden;
    
    await db.query('UPDATE reviews SET is_hidden = ? WHERE id = ?', [newStatus, id]);
    
    res.json({
      success: true,
      is_hidden: newStatus,
      message: newStatus ? 'Ulasan disembunyikan.' : 'Ulasan ditampilkan kembali.'
    });
  } catch (error) {
    console.error('Error toggling review visibility:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status ulasan.' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const db = await getDBConnection();
    const { id } = req.params;
    
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Ulasan berhasil dihapus.'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus ulasan.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const db = await getDBConnection();
    const [users] = await db.query(`
      SELECT id, first_name, last_name, email, role, status, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Harap lengkapi semua field wajib.' });
    }

    const db = await getDBConnection();
    
    // Check if email exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name || '', email, hashedPassword, role, 'active']
    );

    const [newUser] = await db.query('SELECT id, first_name, last_name, email, role, status, created_at FROM users WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.', data: newUser[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Peran (Role) tidak boleh kosong.' });
    }

    const db = await getDBConnection();
    // Prevent changing superadmin role
    const [userCheck] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (userCheck.length > 0 && userCheck[0].role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Tidak dapat mengubah peran Super Admin.' });
    }

    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true, message: 'Peran berhasil diperbarui.' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui peran.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDBConnection();
    
    // Check if trying to delete a superadmin
    const [userCheck] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (userCheck.length > 0 && userCheck[0].role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Super Admin utama tidak dapat dihapus.' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.' });
  }
};

exports.getAllReviews = getAllReviews;
exports.toggleReviewVisibility = toggleReviewVisibility;
exports.deleteReview = deleteReview;
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
