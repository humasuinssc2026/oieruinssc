const { getDBConnection } = require('./config/db');

async function createVisitorsTable() {
  try {
    const db = await getDBConnection();
    
    // Create site_visits table
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabel site_visits berhasil dibuat atau sudah ada.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createVisitorsTable();
