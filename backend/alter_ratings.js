const { getDBConnection } = require('./config/db');

async function createRatingsTable() {
  let db;
  try {
    db = await getDBConnection();
    console.log("Database connected. Creating ratings table...");

    const query = `
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_material_idx (user_id, material_id),
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await db.query(query);
    console.log("✅ Tabel 'ratings' berhasil dibuat.");

  } catch (error) {
    console.error("Gagal membuat tabel ratings:", error);
  } finally {
    if (db) process.exit(0);
  }
}

createRatingsTable();
