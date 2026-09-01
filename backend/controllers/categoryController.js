const { getDBConnection } = require('../config/db');

exports.getCategories = async (req, res) => {
  console.log('GET /api/categories called');
  try {
    const db = await getDBConnection();
    console.log('Got DB connection pool');
    // Fetch faculties
    const [faculties] = await db.query(`SELECT id, name FROM categories WHERE type = 'faculty'`);
    console.log('Fetched faculties', faculties.length);
    
    // Fetch prodis
    const [prodis] = await db.query(`SELECT id, name, parent_id as fakultasId FROM categories WHERE type = 'prodi'`);
    
    res.json({
      success: true,
      data: {
        fakultasList: faculties,
        prodiList: prodis
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori.' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, type, parent_id } = req.body;
    if (!name || !type) return res.status(400).json({ success: false, message: 'Name dan type wajib diisi.' });

    const db = await getDBConnection();
    const [result] = await db.execute(
      `INSERT INTO categories (name, type, parent_id) VALUES (?, ?, ?)`,
      [name, type, parent_id || null]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, type, fakultasId: parent_id }
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan kategori.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const db = await getDBConnection();
    await db.execute(`UPDATE categories SET name = ? WHERE id = ?`, [name, id]);
    
    res.json({ success: true, message: 'Kategori berhasil diubah.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengubah kategori.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await getDBConnection();
    await db.execute(`DELETE FROM categories WHERE id = ?`, [id]);
    
    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori.' });
  }
};
