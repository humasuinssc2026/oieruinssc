const mysql = require('mysql2/promise');

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: '',
    });

    console.log('Koneksi ke MySQL Server berhasil...');

    await connection.query(`CREATE DATABASE IF NOT EXISTS oier_db`);
    await connection.query(`USE oier_db`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('superadmin', 'admin', 'dosen', 'mahasiswa', 'guest') DEFAULT 'mahasiswa',
        status ENUM('active', 'pending', 'blocked') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabel "users" berhasil dibuat.');

    await connection.query(`DROP TABLE IF EXISTS categories`);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('faculty', 'prodi', 'general') NOT NULL,
        parent_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabel "categories" berhasil dibuat.');

    // Seed Categories
    const [catRows] = await connection.query(`SELECT COUNT(*) as count FROM categories`);
    if (catRows[0].count === 0) {
      console.log('Seeding data Kategori (Fakultas & Prodi)...');
      
      const fakultasList = [
        { id: 1, name: 'Fakultas Ilmu Tarbiyah dan Keguruan' },
        { id: 2, name: 'Fakultas Ekonomi dan Bisnis Islam' },
        { id: 3, name: 'Fakultas Syariah' },
        { id: 4, name: 'Fakultas Dakwah dan Komunikasi Islam' },
        { id: 5, name: 'Fakultas Ushuluddin dan Adab' },
        { id: 6, name: 'Fakultas Pascasarjana' }
      ];

      for (const fak of fakultasList) {
        await connection.query(
          `INSERT INTO categories (id, name, type) VALUES (?, ?, 'faculty')`, 
          [fak.id, fak.name]
        );
      }

      const prodiList = [
        { id: 101, fakultasId: 1, name: 'Pendidikan Agama Islam (S1)' },
        { id: 102, fakultasId: 1, name: 'Pendidikan Bahasa Arab (S1)' },
        { id: 103, fakultasId: 1, name: 'Tadris Bahasa Inggris (S1)' },
        { id: 104, fakultasId: 1, name: 'Tadris Ilmu Pengetahuan Sosial (S1)' },
        { id: 105, fakultasId: 1, name: 'Tadris Matematika (S1)' },
        { id: 106, fakultasId: 1, name: 'Tadris Biologi (S1)' },
        { id: 107, fakultasId: 1, name: 'Pendidikan Guru Madrasah Ibtidaiyah (S1)' },
        { id: 108, fakultasId: 1, name: 'Pendidikan Islam Anak Usia Dini (S1)' },
        { id: 109, fakultasId: 1, name: 'Manajemen Pendidikan Islam (S1)' },
        { id: 110, fakultasId: 1, name: 'Tadris Bahasa Indonesia (S1)' },
        { id: 111, fakultasId: 1, name: 'Tadris Kimia (S1)' },
        { id: 112, fakultasId: 1, name: 'PJJ Pendidikan Agama Islam (S1)' },
        { id: 113, fakultasId: 1, name: 'Pendidikan Profesi Guru Keagamaan (PPG)' },
        { id: 201, fakultasId: 2, name: 'Perbankan Syariah (S1)' },
        { id: 202, fakultasId: 2, name: 'Ekonomi Syariah (S1)' },
        { id: 203, fakultasId: 2, name: 'Akuntansi Syariah (S1)' },
        { id: 204, fakultasId: 2, name: 'Pariwisata Syariah (S1)' },
        { id: 301, fakultasId: 3, name: 'Hukum Keluarga (Akhwalul Syaksiyah) (S1)' },
        { id: 302, fakultasId: 3, name: "Hukum Ekonomi Syari'ah (Muamalah) (S1)" },
        { id: 303, fakultasId: 3, name: 'Hukum Tatanegara Islam (S1)' },
        { id: 304, fakultasId: 3, name: 'Ilmu Falak (S1)' },
        { id: 401, fakultasId: 4, name: 'Komunikasi dan Penyiaran Islam (S1)' },
        { id: 402, fakultasId: 4, name: 'Pengembangan Masyarakat Islam (S1)' },
        { id: 403, fakultasId: 4, name: 'Bimbingan dan Konseling Islam (S1)' },
        { id: 404, fakultasId: 4, name: 'Sosiologi Agama (S1)' },
        { id: 501, fakultasId: 5, name: 'Sejarah Peradaban Islam (S1)' },
        { id: 502, fakultasId: 5, name: 'Aqidah dan Filsafat Islam (S1)' },
        { id: 503, fakultasId: 5, name: "Ilmu Al-Qur'an dan Tafsir (S1)" },
        { id: 504, fakultasId: 5, name: 'Ilmu Hadis (S1)' },
        { id: 505, fakultasId: 5, name: 'Bahasa dan Sastra Arab (S1)' },
        { id: 506, fakultasId: 5, name: 'Tasawuf dan Psikoterapi (S1)' },
        { id: 601, fakultasId: 6, name: 'Manajemen Pendidikan Islam (S2)' },
        { id: 602, fakultasId: 6, name: 'Pendidikan Agama Islam (S2)' },
        { id: 603, fakultasId: 6, name: 'Hukum Keluarga (Akhwalul Syaksiyah) (S2)' },
        { id: 604, fakultasId: 6, name: 'Ekonomi Syariah (S2)' },
        { id: 605, fakultasId: 6, name: 'Pengembangan Masyarakat Islam (S2)' },
        { id: 606, fakultasId: 6, name: 'PJJ Pendidikan Agama Islam (S2)' },
        { id: 607, fakultasId: 6, name: 'Pendidikan Agama Islam (S3)' },
        { id: 608, fakultasId: 6, name: 'Hukum Keluarga Islam (Ahwal Syakhshiyyah) (S3)' }
      ];

      for (const prodi of prodiList) {
        await connection.query(
          `INSERT INTO categories (id, name, type, parent_id) VALUES (?, ?, 'prodi', ?)`, 
          [prodi.id, prodi.name, prodi.fakultasId]
        );
      }
      
      console.log('Seeding Kategori Selesai.');
    }

    await connection.query(`DROP TABLE IF EXISTS materials`);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('document', 'video') NOT NULL,
        category_slug VARCHAR(100) NOT NULL,
        author VARCHAR(150) NOT NULL,
        uploader_id INT DEFAULT 1,
        file_url VARCHAR(255),
        module_url VARCHAR(255) DEFAULT NULL,
        status ENUM('published', 'review', 'draft') DEFAULT 'published',
        downloads INT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('Tabel "materials" berhasil dibuat dengan schema MySQL terbaru.');

    const [rows] = await connection.query(`SELECT id FROM users WHERE email = 'admin@oier.uin.ac.id'`);
    if (rows.length === 0) {
      await connection.query(`
        INSERT INTO users (first_name, last_name, email, password, role, status) 
        VALUES ('Super', 'Admin', 'admin@oier.uin.ac.id', 'password123', 'superadmin', 'active')
      `);
      console.log('Data Super Admin default berhasil ditambahkan.');
    }

    console.log('--- INISIALISASI DATABASE SELESAI ---');
    await connection.end();
    
  } catch (error) {
    console.error('Error saat inisialisasi database MySQL:', error);
  }
}

initializeDatabase();
