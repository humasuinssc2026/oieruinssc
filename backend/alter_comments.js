const { getDBConnection } = require('./config/db');

async function createCommentsTable() {
  try {
    const db = await getDBConnection();

    // Buat tabel comments jika belum ada
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log("✅ Tabel 'comments' berhasil dibuat atau sudah ada.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat membuat tabel comments:", error.message);
    process.exit(1);
  }
}

createCommentsTable();
