const { getDBConnection } = require('./config/db');

async function createDiscussionsTable() {
  let db;
  try {
    db = await getDBConnection();
    console.log("Database connected. Creating discussions table...");

    const alterQuery = `
      CREATE TABLE IF NOT EXISTS discussions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT NOT NULL,
        user_id INT,
        user_name VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        parent_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (parent_id) REFERENCES discussions(id) ON DELETE CASCADE
      );
    `;

    await db.query(alterQuery);
    console.log("✅ Tabel 'discussions' berhasil dibuat atau sudah ada.");

  } catch (error) {
    console.error("Gagal mengubah tabel:", error);
  } finally {
    if (db) process.exit(0);
  }
}

createDiscussionsTable();
