const { getDBConnection } = require('./config/db');

async function addProfilePicColumn() {
  let db;
  try {
    db = await getDBConnection();
    console.log("Database connected. Altering users table...");

    const alterQuery = `
      ALTER TABLE users 
      ADD COLUMN profile_pic VARCHAR(255) DEFAULT NULL;
    `;

    await db.query(alterQuery);
    console.log("✅ Kolom 'profile_pic' berhasil ditambahkan ke tabel 'users'.");

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("✅ Kolom 'profile_pic' sudah ada, melewati proses alter.");
    } else {
      console.error("Gagal mengubah tabel:", error);
    }
  } finally {
    if (db) process.exit(0);
  }
}

addProfilePicColumn();
