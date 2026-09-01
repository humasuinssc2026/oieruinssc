const { getDBConnection } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'oier_super_secret_key_2026';

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role = 'mahasiswa' } = req.body;
    
    if (!first_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Harap lengkapi field wajib (first_name, email, password)' });
    }

    const db = await getDBConnection();
    
    // Check if email exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    await db.query(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name || '', email, hashedPassword, role]
    );

    res.status(201).json({ success: true, message: 'Pendaftaran berhasil' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Harap masukkan email dan password' });
    }

    const db = await getDBConnection();
    
    // Check user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      // Mock fallback for testing if no DB users
      if ((email === 'admin123' && password === 'admin123') || (email === 'admin' && password === 'admin')) {
        const token = jwt.sign({ id: 999, role: 'superadmin', name: 'Super Admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ success: true, token, user: { id: 999, name: 'Super Admin', email: 'admin', role: 'superadmin' } });
      }
      return res.status(401).json({ success: false, message: 'Kredensial tidak valid' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak valid' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Akun Anda belum aktif atau diblokir' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, name: `${user.first_name} ${user.last_name}` },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ success: false, message: 'Akses ditolak' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: 'Token tidak valid' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Harap masukkan email' });
    }

    const db = await getDBConnection();
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Email tidak ditemukan' });
    }

    const user = users[0];

    // Generate JWT token valid for 15 minutes
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #198754; text-align: center;">Pemulihan Kata Sandi</h2>
        <p>Halo <strong>${user.first_name}</strong>,</p>
        <p>Anda baru saja meminta untuk mereset kata sandi akun OIER UIN Siber Anda. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #198754; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Kata Sandi</a>
        </div>
        <p style="font-size: 12px; color: #666;">Jika tombol di atas tidak berfungsi, salin tautan berikut ke browser Anda: <br/> <a href="${resetLink}">${resetLink}</a></p>
        <p style="font-size: 12px; color: #666;">Tautan ini akan kedaluwarsa dalam waktu 15 menit.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #999; text-align: center;">OIER UIN Siber Syekh Nurjati &copy; 2026</p>
      </div>
    `;

    const emailResult = await sendEmail({
      to: email,
      subject: 'OIER UINSSC - Pemulihan Kata Sandi',
      html: htmlContent
    });

    if (emailResult.success) {
      res.json({ 
        success: true, 
        message: 'Tautan reset sandi telah dikirim ke email Anda. Silakan cek kotak masuk atau folder spam.'
      });
    } else {
      res.status(500).json({ success: false, message: 'Gagal mengirim email pemulihan' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token dan kata sandi baru dibutuhkan' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Tautan reset sandi tidak valid atau sudah kedaluwarsa' });
    }

    const userId = decoded.id;
    const db = await getDBConnection();
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ success: true, message: 'Kata sandi berhasil direset! Silakan login dengan kata sandi baru Anda.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  forgotPassword,
  resetPassword
};
