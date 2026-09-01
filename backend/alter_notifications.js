const { getDBConnection } = require('./config/db');

async function createNotificationsTable() {
  let db;
  try {
    db = await getDBConnection();
    console.log("Database connected. Creating notifications table...");

    const query = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(255) DEFAULT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await db.query(query);
    console.log("✅ Tabel 'notifications' berhasil dibuat.");

  } catch (error) {
    console.error("Gagal membuat tabel notifications:", error);
  } finally {
    if (db) process.exit(0);
  }
}

createNotificationsTable();
