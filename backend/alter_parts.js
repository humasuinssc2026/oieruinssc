const { getDBConnection } = require('./config/db');

async function createPartsTable() {
  try {
    const db = await getDBConnection();
    await db.query(`
      CREATE TABLE IF NOT EXISTS material_parts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        material_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        part_number INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabel material_parts berhasil dibuat.');
    process.exit(0);
  } catch (error) {
    console.error('Gagal:', error);
    process.exit(1);
  }
}

createPartsTable();
