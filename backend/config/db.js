const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'oier_db',
  port: process.env.DB_PORT || 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getDBConnection() {
  return pool;
}

// Test the connection on startup
pool.getConnection()
  .then(connection => {
    console.log('MySQL Database connected successfully.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL database:', err.message);
    console.log('Pastikan MySQL/XAMPP Anda sudah berjalan!');
  });

module.exports = { getDBConnection };
