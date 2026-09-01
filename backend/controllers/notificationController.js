const { getDBConnection } = require('../config/db');

// Create a new notification (internal use mostly, but can be an endpoint)
const createNotification = async (userId, message, link) => {
  try {
    const db = await getDBConnection();
    await db.query(
      'INSERT INTO notifications (user_id, message, link) VALUES (?, ?, ?)',
      [userId, message, link || null]
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Fetch notifications for the logged-in user
const getUserNotifications = async (req, res) => {
  try {
    const db = await getDBConnection();
    const userId = req.user.id;

    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi' });
  }
};

// Mark a single notification as read
const markAsRead = async (req, res) => {
  try {
    const db = await getDBConnection();
    const { id } = req.params;
    const userId = req.user.id;

    await db.query(
      'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ success: true, message: 'Notifikasi ditandai sudah dibaca' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status notifikasi' });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    const db = await getDBConnection();
    const userId = req.user.id;

    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = ?',
      [userId]
    );

    res.json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status notifikasi' });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};
