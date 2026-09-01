const mysql = require('mysql2/promise');

async function checkDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'oier_db'
  });

  await connection.query(`UPDATE materials SET module_url = '/uploads/documents/dummy.pdf' WHERE id = 2`);
  await connection.query(`UPDATE materials SET module_url = '/uploads/documents/dummy.pdf' WHERE id = 3`);
  const [rows] = await connection.query(`SELECT id, title, type, file_url, module_url FROM materials`);
  console.log(rows);
  await connection.end();
}

checkDB();
