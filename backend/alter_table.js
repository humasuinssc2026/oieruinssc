const mysql = require('mysql2/promise');

async function alterTable() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: '',
      database: 'oier_db'
    });

    console.log('Koneksi ke MySQL Server berhasil...');
    
    // Cek apakah kolom sudah ada
    const [columns] = await connection.query(`SHOW COLUMNS FROM materials LIKE 'module_url'`);
    if (columns.length === 0) {
      await connection.query(`ALTER TABLE materials ADD COLUMN module_url VARCHAR(255) DEFAULT NULL AFTER file_url`);
      console.log('Berhasil menambahkan kolom module_url ke tabel materials.');
    } else {
      console.log('Kolom module_url sudah ada.');
    }

    await connection.end();
  } catch (error) {
    console.error('Error saat alter database:', error);
  }
}

alterTable();
