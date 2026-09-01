const { getDBConnection } = require('../config/db');
const { createNotification } = require('./notificationController');
const path = require('path');
const fs = require('fs');

// Mengunggah material baru (Dokumen PDF atau URL Video)
const uploadMaterial = async (req, res) => {
  try {

    const { title, type, category_slug, author, mata_kuliah, kode_mata_kuliah } = req.body;
    let file_url = null;
    let module_url = null;
    let thumbnail_url = null;

    if (!title || !type || !category_slug || !author) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    // Process files from req.files (array for upload.any)
    const docFile = req.files && Array.isArray(req.files) ? req.files.find(f => f.fieldname === 'document_file') : null;
    const thumbFile = req.files && Array.isArray(req.files) ? req.files.find(f => f.fieldname === 'thumbnail_file') : null;

    if (thumbFile) {
      thumbnail_url = `/uploads/documents/${thumbFile.filename}`;
    }

    if (type === 'document') {
      if (!docFile && !req.body.module_url) {
        return res.status(400).json({ success: false, message: 'File PDF atau Tautan Modul wajib disertakan untuk tipe dokumen.' });
      }
      file_url = docFile ? `/uploads/documents/${docFile.filename}` : req.body.module_url;
      module_url = file_url; // For document type, they are the same
    } else if (type === 'video') {
      file_url = req.body.url;
      if (!file_url) {
        return res.status(400).json({ success: false, message: 'URL Google Drive wajib diisi untuk tipe video.' });
      }
      if (docFile) {
        module_url = `/uploads/documents/${docFile.filename}`;
      } else if (req.body.module_url) {
        module_url = req.body.module_url;
      }
    } else {
      return res.status(400).json({ success: false, message: 'Tipe material tidak valid.' });
    }

    const db = await getDBConnection();
    
    // Default uploader_id is 1 (Admin) since authentication is not fully wired
    const [result] = await db.execute(
      `INSERT INTO materials (title, type, category_slug, author, file_url, module_url, thumbnail_url, uploader_id, status, mata_kuliah, kode_mata_kuliah) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'published', ?, ?)`,
      [title, type, category_slug, author, file_url, module_url, thumbnail_url, mata_kuliah || null, kode_mata_kuliah || null]
    );

    res.status(201).json({
      success: true,
      message: 'Materi berhasil diunggah dan disimpan ke database.',
      data: {
        id: result.insertId,
        title,
        type,
        category_slug,
        author,
        mata_kuliah,
        kode_mata_kuliah,
        file_url,
        file_url,
        module_url,
        thumbnail_url
      }
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat mengunggah.' });
  }
};

const getMaterials = async (req, res) => {
  try {
    const db = await getDBConnection();
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default to a large number to not break existing components if not passed
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const [countResult] = await db.query(`SELECT COUNT(*) as total FROM materials`);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [rows] = await db.query(`
      SELECT m.id, m.title, m.type, m.category_slug as category, m.author, m.mata_kuliah, m.kode_mata_kuliah, m.file_url, m.module_url, m.thumbnail_url, m.views, DATE_FORMAT(m.created_at, '%d %b %Y') as time
      FROM materials m
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    // Only fetch parts for the materials in the current page
    const materialIds = rows.map(m => m.id);
    let parts = [];
    if (materialIds.length > 0) {
      const placeholders = materialIds.map(() => '?').join(',');
      const [partsRows] = await db.query(`
        SELECT id, material_id, title, url, part_number, module_url 
        FROM material_parts 
        WHERE material_id IN (${placeholders})
        ORDER BY part_number ASC
      `, materialIds);
      parts = partsRows;
    }

    const materialsWithParts = rows.map(m => {
      m.parts = parts.filter(p => p.material_id === m.id);
      return m;
    });

    res.json({ 
      success: true, 
      data: materialsWithParts,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil materi.' });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author, url, mata_kuliah, kode_mata_kuliah } = req.body;
    console.log("UPDATE REQUEST BODY:", req.body);
    
    const db = await getDBConnection();
    
    // Check material type
    const [rows] = await db.execute('SELECT type FROM materials WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    const type = rows[0].type;
    
    let updates = ['title = ?', 'category_slug = ?', 'author = ?', 'mata_kuliah = ?', 'kode_mata_kuliah = ?'];
    let values = [title, category, author, mata_kuliah || null, kode_mata_kuliah || null];
    
    if (type === 'video' && url) {
       updates.push('file_url = ?');
       values.push(url);
    }
    
    const docFile = req.files && Array.isArray(req.files) ? req.files.find(f => f.fieldname === 'document_file') : null;
    const thumbFile = req.files && Array.isArray(req.files) ? req.files.find(f => f.fieldname === 'thumbnail_file') : null;

    if (docFile) {
       const newPath = `/uploads/documents/${docFile.filename}`;
       if (type === 'document') {
           updates.push('file_url = ?');
           values.push(newPath);
       } else if (type === 'video') {
           updates.push('module_url = ?');
           values.push(newPath);
       }
    } else if (req.body.module_url !== undefined) {
       if (type === 'document') {
           updates.push('file_url = ?');
           values.push(req.body.module_url);
       } else if (type === 'video') {
           updates.push('module_url = ?');
           values.push(req.body.module_url);
       }
    }

    if (thumbFile) {
       updates.push('thumbnail_url = ?');
       values.push(`/uploads/documents/${thumbFile.filename}`);
    }
    
    values.push(id);
    
    await db.execute(
      `UPDATE materials SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    res.json({ success: true, message: 'Materi berhasil diubah.' });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah materi.' });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDBConnection();
    await db.execute(`DELETE FROM materials WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Materi berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus materi.' });
  }
};

const addMaterialPart = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, part_number } = req.body;
    let url = req.body.url;
    let module_url = req.body.module_url || null;
    
    if (req.file) {
      if (!url) {
        url = `/uploads/documents/${req.file.filename}`;
      } else {
        module_url = `/uploads/documents/${req.file.filename}`;
      }
    }
    
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Judul dan URL (atau file) wajib diisi.' });
    }

    const db = await getDBConnection();
    const [result] = await db.execute(
      'INSERT INTO material_parts (material_id, title, url, part_number, module_url) VALUES (?, ?, ?, ?, ?)',
      [id, title, url, part_number || 1, module_url]
    );

    res.status(201).json({ success: true, message: 'Bagian berhasil ditambahkan.', part: { id: result.insertId, material_id: id, title, url, part_number, module_url } });
  } catch (error) {
    console.error('Error add part:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah bagian.' });
  }
};

const deleteMaterialPart = async (req, res) => {
  try {
    const { part_id } = req.params;
    const db = await getDBConnection();
    await db.execute('DELETE FROM material_parts WHERE id = ?', [part_id]);
    res.json({ success: true, message: 'Bagian video berhasil dihapus.' });
  } catch (error) {
    console.error('Error delete part:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus bagian video.' });
  }
};

const incrementMaterialView = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDBConnection();
    await db.execute('UPDATE materials SET views = views + 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'View count incremented' });
  } catch (error) {
    console.error('Error incrementing view:', error);
    res.status(500).json({ success: false, message: 'Failed to increment view' });
  }
};

const getReviews = async (req, res) => {
  try {
    const db = await getDBConnection();
    const materialId = req.params.id;

    const [reviews] = await db.query(
      'SELECT id, user_name, rating, comment, created_at as date FROM reviews WHERE material_id = ? ORDER BY created_at DESC',
      [materialId]
    );
    
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil ulasan' });
  }
};

const addReview = async (req, res) => {
  try {
    const db = await getDBConnection();
    const materialId = req.params.id;
    const { user_name, rating, comment } = req.body;

    if (!user_name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Semua field ulasan wajib diisi' });
    }

    const [result] = await db.query(
      'INSERT INTO reviews (material_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
      [materialId, user_name, rating, comment]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Ulasan berhasil ditambahkan',
      data: {
        id: result.insertId,
        user_name,
        rating,
        comment,
        date: new Date()
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah ulasan' });
  }
};

const getDiscussions = async (req, res) => {
  try {
    const db = await getDBConnection();
    const materialId = req.params.id;

    // We fetch discussions with their roles if they exist
    const [discussions] = await db.query(
      `SELECT d.id, d.user_name as name, d.text, d.created_at as time, d.parent_id, 
              u.role, IF(u.role IN ('admin', 'superadmin', 'dosen'), 1, 0) as isInstructor
       FROM discussions d
       LEFT JOIN users u ON d.user_id = u.id
       WHERE d.material_id = ?
       ORDER BY d.created_at ASC`,
      [materialId]
    );
    
    // Group them by parent_id on the frontend, or here.
    res.json({ success: true, data: discussions });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil diskusi' });
  }
};

const addDiscussion = async (req, res) => {
  try {
    const db = await getDBConnection();
    const materialId = req.params.id;
    const { text, parent_id, user_id, user_name } = req.body;

    if (!text || !user_name) {
      return res.status(400).json({ success: false, message: 'Nama dan teks diskusi wajib diisi' });
    }

    const [result] = await db.query(
      'INSERT INTO discussions (material_id, user_id, user_name, text, parent_id) VALUES (?, ?, ?, ?, ?)',
      [materialId, user_id || null, user_name, text, parent_id || null]
    );
    
    // Fetch inserted record with user details to return immediately
    const [newDiscussion] = await db.query(
      `SELECT d.id, d.user_name as name, d.text, d.created_at as time, d.parent_id, 
              u.role, IF(u.role IN ('admin', 'superadmin', 'dosen'), 1, 0) as isInstructor
       FROM discussions d
       LEFT JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
       [result.insertId]
    );

    // Notify parent author if it's a reply
    if (parent_id) {
      const [parentDisc] = await db.query('SELECT user_id FROM discussions WHERE id = ?', [parent_id]);
      if (parentDisc.length > 0 && parentDisc[0].user_id) {
        if (parentDisc[0].user_id !== user_id) { // don't notify self
          await createNotification(
            parentDisc[0].user_id, 
            `${user_name} membalas komentar Anda.`,
            `/material/${materialId}`
          );
        }
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Diskusi berhasil dikirim',
      data: newDiscussion[0]
    });
  } catch (error) {
    console.error('Error adding discussion:', error);
    res.status(500).json({ success: false, message: 'Gagal mengirim diskusi' });
  }
};

const getRatings = async (req, res) => {
  try {
    const db = await getDBConnection();
    const materialId = req.params.id;
    
    // Get average rating and total count from reviews table
    const [stats] = await db.query(
      'SELECT AVG(rating) as average, COUNT(id) as count FROM reviews WHERE material_id = ?',
      [materialId]
    );

    res.json({ success: true, data: { average: parseFloat(stats[0].average) || 0, count: stats[0].count } });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil rating' });
  }
};

const rateMaterial = async (req, res) => {
  try {
    const db = await getDBConnection();
    const materialId = req.params.id;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1 dan 5' });
    }

    await db.query(
      'INSERT INTO ratings (material_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
      [materialId, userId, rating]
    );

    // Fetch updated average
    const [stats] = await db.query('SELECT AVG(rating) as average, COUNT(id) as count FROM ratings WHERE material_id = ?', [materialId]);

    res.json({ success: true, message: 'Rating berhasil disimpan', data: { average: parseFloat(stats[0].average) || 0, count: stats[0].count } });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan rating' });
  }
};

const getComments = async (req, res) => {
  try {
    const db = await getDBConnection();
    const { id } = req.params;
    const [comments] = await db.query(`
      SELECT c.id, c.content, c.created_at, u.first_name, u.last_name, u.profile_pic 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.material_id = ?
      ORDER BY c.created_at DESC
    `, [id]);
    res.json({ success: true, data: comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil komentar' });
  }
};

const addComment = async (req, res) => {
  try {
    const db = await getDBConnection();
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // from verifyToken

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Komentar tidak boleh kosong' });
    }

    const [result] = await db.execute(
      'INSERT INTO comments (material_id, user_id, content) VALUES (?, ?, ?)',
      [id, userId, content]
    );

    // Fetch the newly inserted comment to return it to the frontend
    const [newComment] = await db.query(`
      SELECT c.id, c.content, c.created_at, u.first_name, u.last_name, u.profile_pic 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    res.json({ success: true, message: 'Komentar berhasil ditambahkan', data: newComment[0] });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan komentar' });
  }
};

const streamVideo = (req, res) => {
  const filename = req.params.filename;
  const videoPath = path.join(__dirname, '../uploads/documents', filename); 
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};

module.exports = {
  uploadMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
  addMaterialPart,
  deleteMaterialPart,
  incrementMaterialView,
  getReviews,
  addReview,
  getDiscussions,
  addDiscussion,
  getRatings,
  rateMaterial,
  getComments,
  addComment,
  streamVideo
};
