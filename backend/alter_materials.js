const { getDBConnection } = require('./config/db');

async function alterMaterialsTable() {
  try {
    const db = await getDBConnection();
    await db.query(`
      ALTER TABLE materials 
      ADD COLUMN mata_kuliah VARCHAR(255) DEFAULT NULL,
      ADD COLUMN kode_mata_kuliah VARCHAR(50) DEFAULT NULL;
    `);
    console.log('Kolom mata_kuliah dan kode_mata_kuliah berhasil ditambahkan ke tabel materials.');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Kolom sudah ada.');
      process.exit(0);
    } else {
      console.error('Gagal:', error);
      process.exit(1);
    }
  }
}

alterMaterialsTable();
