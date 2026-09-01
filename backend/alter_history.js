const { getDBConnection } = require('./config/db');

async function createUserHistoryTable() {
  let db;
  try {
    db = await getDBConnection();
    console.log("Database connected. Creating user_history table...");

    const alterQuery = `
      CREATE TABLE IF NOT EXISTS user_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        material_id INT NOT NULL,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_history (user_id, material_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
      );
    `;

    await db.query(alterQuery);
    console.log("✅ Tabel 'user_history' berhasil dibuat atau sudah ada.");

  } catch (error) {
    console.error("Gagal mengubah tabel:", error);
  } finally {
    if (db) process.exit(0);
  }
}

createUserHistoryTable();
