const { getDBConnection } = require('./config/db');

async function createReviewsTable() {
  let db;
  try {
    db = await getDBConnection();
    console.log("Database connected. Creating reviews table...");

    const alterQuery = `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        rating INT NOT NULL DEFAULT 5,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
      );
    `;

    await db.query(alterQuery);
    console.log("✅ Tabel 'reviews' berhasil dibuat atau sudah ada.");

    // Tambahkan dummy review jika tabel kosong
    const [rows] = await db.query('SELECT COUNT(*) as count FROM reviews');
    if (rows[0].count === 0) {
      console.log("Menambahkan beberapa ulasan dummy...");
      await db.query(`
        INSERT INTO reviews (material_id, user_name, rating, comment) VALUES
        (1, 'Ahmad Fauzi', 5, 'Materi yang sangat bagus dan mudah dipahami!'),
        (1, 'Siti Aminah', 4, 'Penjelasannya cukup runtut, tapi suaranya agak kecil di menit ke-5.'),
        (2, 'Budi Santoso', 5, 'Terima kasih, sangat membantu tugas akhir saya.')
      `);
      console.log("✅ Ulasan dummy berhasil ditambahkan.");
    }
  } catch (error) {
    console.error("Gagal mengubah tabel:", error);
  } finally {
    if (db) process.exit(0);
  }
}

createReviewsTable();
