const { getDBConnection } = require('./config/db');

async function addThumbnailColumn() {
  try {
    const db = await getDBConnection();
    await db.query(`ALTER TABLE materials ADD COLUMN thumbnail_url VARCHAR(255) NULL AFTER module_url;`);
    console.log("Kolom thumbnail_url berhasil ditambahkan ke tabel materials.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Kolom thumbnail_url sudah ada.");
      process.exit(0);
    } else {
      console.error("Gagal menambahkan kolom:", error);
      process.exit(1);
    }
  }
}

addThumbnailColumn();
