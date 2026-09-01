const { getDBConnection } = require('./config/db');

async function alterPartsTable() {
  try {
    const db = await getDBConnection();
    await db.query(`
      ALTER TABLE material_parts ADD COLUMN module_url VARCHAR(255) DEFAULT NULL;
    `);
    console.log('Kolom module_url berhasil ditambahkan ke tabel material_parts.');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Kolom module_url sudah ada.');
      process.exit(0);
    } else {
      console.error('Gagal:', error);
      process.exit(1);
    }
  }
}

alterPartsTable();
