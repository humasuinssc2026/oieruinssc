/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: categories
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` enum('faculty', 'prodi', 'general') NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 609 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: comments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: discussions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `discussions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) NOT NULL,
  `text` text NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `discussions_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `discussions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL,
  CONSTRAINT `discussions_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `discussions` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: material_parts
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `material_parts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `part_number` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `module_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `material_parts_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: materials
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` enum('document', 'video') NOT NULL,
  `category_slug` varchar(100) NOT NULL,
  `author` varchar(150) NOT NULL,
  `uploader_id` int(11) DEFAULT 1,
  `file_url` varchar(255) DEFAULT NULL,
  `module_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `status` enum('published', 'review', 'draft') DEFAULT 'published',
  `downloads` int(11) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `mata_kuliah` varchar(255) DEFAULT NULL,
  `kode_mata_kuliah` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uploader_id` (`uploader_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: notifications
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ratings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (
  `rating` >= 1
  and `rating` <= 5
  ),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_material_idx` (`user_id`, `material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: reviews
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_hidden` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: site_visits
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `site_visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `visited_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 58 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user_history
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `last_accessed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_history` (`user_id`, `material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `user_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_history_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 176 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin', 'admin', 'dosen', 'mahasiswa', 'guest') DEFAULT 'mahasiswa',
  `status` enum('active', 'pending', 'blocked') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: categories
# ------------------------------------------------------------

INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    1,
    'Fakultas Ilmu Tarbiyah dan Keguruan',
    'faculty',
    NULL,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    2,
    'Fakultas Ekonomi dan Bisnis Islam',
    'faculty',
    NULL,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    3,
    'Fakultas Syariah',
    'faculty',
    NULL,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    4,
    'Fakultas Dakwah dan Komunikasi Islam',
    'faculty',
    NULL,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    5,
    'Fakultas Ushuluddin dan Adab',
    'faculty',
    NULL,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    6,
    'Fakultas Pascasarjana',
    'faculty',
    NULL,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    101,
    'Pendidikan Agama Islam (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    102,
    'Pendidikan Bahasa Arab (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    103,
    'Tadris Bahasa Inggris (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    104,
    'Tadris Ilmu Pengetahuan Sosial (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    105,
    'Tadris Matematika (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    106,
    'Tadris Biologi (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    107,
    'Pendidikan Guru Madrasah Ibtidaiyah (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    108,
    'Pendidikan Islam Anak Usia Dini (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    109,
    'Manajemen Pendidikan Islam (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    110,
    'Tadris Bahasa Indonesia (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    111,
    'Tadris Kimia (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    112,
    'PJJ Pendidikan Agama Islam (S1)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    113,
    'Pendidikan Profesi Guru Keagamaan (PPG)',
    'prodi',
    1,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    201,
    'Perbankan Syariah (S1)',
    'prodi',
    2,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    202,
    'Ekonomi Syariah (S1)',
    'prodi',
    2,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    203,
    'Akuntansi Syariah (S1)',
    'prodi',
    2,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    204,
    'Pariwisata Syariah (S1)',
    'prodi',
    2,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    301,
    'Hukum Keluarga (Akhwalul Syaksiyah) (S1)',
    'prodi',
    3,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    302,
    'Hukum Ekonomi Syari\'ah (Muamalah) (S1)',
    'prodi',
    3,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    303,
    'Hukum Tatanegara Islam (S1)',
    'prodi',
    3,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    304,
    'Ilmu Falak (S1)',
    'prodi',
    3,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    401,
    'Komunikasi dan Penyiaran Islam (S1)',
    'prodi',
    4,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    402,
    'Pengembangan Masyarakat Islam (S1)',
    'prodi',
    4,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    403,
    'Bimbingan dan Konseling Islam (S1)',
    'prodi',
    4,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    404,
    'Sosiologi Agama (S1)',
    'prodi',
    4,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    501,
    'Sejarah Peradaban Islam (S1)',
    'prodi',
    5,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    502,
    'Aqidah dan Filsafat Islam (S1)',
    'prodi',
    5,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    503,
    'Ilmu Al-Qur\'an dan Tafsir (S1)',
    'prodi',
    5,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    504,
    'Ilmu Hadis (S1)',
    'prodi',
    5,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    505,
    'Bahasa dan Sastra Arab (S1)',
    'prodi',
    5,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    506,
    'Tasawuf dan Psikoterapi (S1)',
    'prodi',
    5,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    601,
    'Manajemen Pendidikan Islam (S2)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    602,
    'Pendidikan Agama Islam (S2)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    603,
    'Hukum Keluarga (Akhwalul Syaksiyah) (S2)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    604,
    'Ekonomi Syariah (S2)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    605,
    'Pengembangan Masyarakat Islam (S2)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    606,
    'PJJ Pendidikan Agama Islam (S2)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    607,
    'Pendidikan Agama Islam (S3)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );
INSERT INTO
  `categories` (`id`, `name`, `type`, `parent_id`, `created_at`)
VALUES
  (
    608,
    'Hukum Keluarga Islam (Ahwal Syakhshiyyah) (S3)',
    'prodi',
    6,
    '2026-08-20 15:56:39'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: comments
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: discussions
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: material_parts
# ------------------------------------------------------------

INSERT INTO
  `material_parts` (
    `id`,
    `material_id`,
    `title`,
    `url`,
    `part_number`,
    `created_at`,
    `module_url`
  )
VALUES
  (
    4,
    15,
    'Pengertian Syariah, Fiqih dan Hukum',
    'https://drive.google.com/file/d/1eMnfgyWi_BwOA9T358n9UmQvGBYtrgf4/view?usp=sharing',
    2,
    '2026-09-01 11:45:20',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: materials
# ------------------------------------------------------------

INSERT INTO
  `materials` (
    `id`,
    `title`,
    `type`,
    `category_slug`,
    `author`,
    `uploader_id`,
    `file_url`,
    `module_url`,
    `thumbnail_url`,
    `status`,
    `downloads`,
    `views`,
    `created_at`,
    `mata_kuliah`,
    `kode_mata_kuliah`
  )
VALUES
  (
    15,
    'Maisir dalam Hukum Bisnis Syariah',
    'video',
    'perbankan-syariah-s1-',
    'Ahmad Khoirudin, M.H.',
    1,
    'https://drive.google.com/file/d/1AXR00Gy8ydJ_syqxKjetFvfM3yx9PWJR/view?usp=sharing',
    'https://drive.google.com/file/d/1p9YDsjCHjeKsw_M3TMgUiuvCbf_uxS5q/view?usp=drive_link',
    '/uploads/documents/document-1788236018523-435890206.jpg',
    'published',
    0,
    2,
    '2026-09-01 11:13:38',
    'Hukum Bisnis Islam dan Digital Marketplace',
    'JHK623005'
  );
INSERT INTO
  `materials` (
    `id`,
    `title`,
    `type`,
    `category_slug`,
    `author`,
    `uploader_id`,
    `file_url`,
    `module_url`,
    `thumbnail_url`,
    `status`,
    `downloads`,
    `views`,
    `created_at`,
    `mata_kuliah`,
    `kode_mata_kuliah`
  )
VALUES
  (
    16,
    'Penelitian Tindakan Kelas',
    'video',
    'pendidikan-agama-islam-s1-',
    'Zakky Yavani, M.Pd',
    1,
    'https://drive.google.com/file/d/1STyNHKLpUda5ZuEazdJIc4d-JUcXmX8K/view?usp=sharing',
    'https://drive.google.com/file/d/1lgjhtN6SjpY-6RfyWKOKbV3LZHAVk7Ut/view?usp=drive_link',
    '/uploads/documents/document-1788238134764-710611734.jpg',
    'published',
    0,
    3,
    '2026-09-01 11:48:54',
    'Penelitian Tindakan Kelas',
    'SNJ6007J'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: notifications
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ratings
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: reviews
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: site_visits
# ------------------------------------------------------------

INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (1, '::1', '2026-08-27 10:47:46');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (2, '::1', '2026-08-27 10:47:57');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (3, '::1', '2026-08-27 10:47:57');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (4, '::1', '2026-08-27 12:29:07');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (5, '::1', '2026-08-27 12:29:07');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (6, '::1', '2026-08-27 14:17:44');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (7, '::1', '2026-08-27 14:17:44');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (8, '::1', '2026-08-27 16:08:40');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (9, '::1', '2026-08-27 16:08:40');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (10, '::1', '2026-08-28 07:48:47');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (11, '::1', '2026-08-28 07:48:47');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (12, '::1', '2026-08-28 08:25:38');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (13, '::1', '2026-08-28 08:25:38');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (14, '::1', '2026-08-28 08:28:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (15, '::1', '2026-08-28 08:28:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (16, '::1', '2026-08-28 08:30:44');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (17, '::1', '2026-08-28 08:30:44');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (18, '::1', '2026-08-28 08:31:28');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (19, '::1', '2026-08-28 08:31:28');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (20, '::1', '2026-08-28 08:32:47');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (21, '::1', '2026-08-28 08:32:47');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (22, '::1', '2026-08-28 08:35:34');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (23, '::1', '2026-08-28 08:35:34');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (24, '::1', '2026-08-28 08:43:32');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (25, '::1', '2026-08-28 08:43:32');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (26, '::1', '2026-08-28 08:50:14');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (27, '::1', '2026-08-28 08:50:14');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (28, '::1', '2026-08-28 08:56:32');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (29, '::1', '2026-08-28 08:56:32');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (30, '::1', '2026-08-28 09:22:34');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (31, '::1', '2026-08-28 09:22:34');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (32, '::1', '2026-08-28 09:24:22');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (33, '::1', '2026-08-28 09:24:22');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (34, '::1', '2026-08-28 09:25:27');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (35, '::1', '2026-08-28 09:25:27');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (36, '::1', '2026-08-31 08:10:14');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (37, '::1', '2026-08-31 08:10:14');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (38, '::1', '2026-08-31 08:46:41');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (39, '::1', '2026-08-31 08:46:41');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (40, '::1', '2026-08-31 09:39:34');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (41, '::1', '2026-08-31 09:39:34');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (42, '::1', '2026-08-31 10:20:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (43, '::1', '2026-08-31 10:20:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (44, '::1', '2026-09-01 08:09:30');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (45, '::1', '2026-09-01 08:09:30');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (46, '::1', '2026-09-01 08:19:25');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (47, '::1', '2026-09-01 08:19:25');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (48, '::1', '2026-09-01 11:53:51');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (49, '::1', '2026-09-01 11:53:51');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (50, '::1', '2026-09-01 11:54:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (51, '::1', '2026-09-01 11:54:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (52, '::1', '2026-09-01 13:18:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (53, '::1', '2026-09-01 13:18:10');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (54, '::1', '2026-09-01 13:18:25');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (55, '::1', '2026-09-01 13:18:25');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (56, '::1', '2026-09-01 13:27:36');
INSERT INTO
  `site_visits` (`id`, `ip_address`, `visited_at`)
VALUES
  (57, '::1', '2026-09-01 13:27:36');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user_history
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `first_name`,
    `last_name`,
    `email`,
    `password`,
    `role`,
    `status`,
    `created_at`,
    `profile_pic`
  )
VALUES
  (
    1,
    'Super',
    'Admin',
    'oier@uinssc',
    '$2b$10$W5Sbm2gUVyxTFIAW4lsmF.XvUN1H4EaQyXzxR7NeAjITd2OIFKet2',
    'superadmin',
    'active',
    '2026-08-19 16:19:33',
    NULL
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
