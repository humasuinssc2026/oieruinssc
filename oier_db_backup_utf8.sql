-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: oier_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` enum('faculty','prodi','general') NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=705 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fakultas Ilmu Tarbiyah dan Keguruan','faculty',NULL,'2026-08-20 08:56:39'),(2,'Fakultas Ekonomi dan Bisnis Islam','faculty',NULL,'2026-08-20 08:56:39'),(3,'Fakultas Syariah','faculty',NULL,'2026-08-20 08:56:39'),(4,'Fakultas Dakwah dan Komunikasi Islam','faculty',NULL,'2026-08-20 08:56:39'),(5,'Fakultas Ushuluddin dan Adab','faculty',NULL,'2026-08-20 08:56:39'),(6,'Fakultas Pascasarjana','faculty',NULL,'2026-08-20 08:56:39'),(7,'Pendidikan Jarak Jauh (PJJ)','faculty',NULL,'2026-09-02 06:25:06'),(8,'Program Profesi','faculty',NULL,'2026-09-02 06:25:06'),(101,'Pendidikan Agama Islam (S1)','prodi',1,'2026-08-20 08:56:39'),(102,'Pendidikan Bahasa Arab (S1)','prodi',1,'2026-08-20 08:56:39'),(103,'Tadris Bahasa Inggris (S1)','prodi',1,'2026-08-20 08:56:39'),(104,'Tadris Ilmu Pengetahuan Sosial (S1)','prodi',1,'2026-08-20 08:56:39'),(105,'Tadris Matematika (S1)','prodi',1,'2026-08-20 08:56:39'),(106,'Tadris Biologi (S1)','prodi',1,'2026-08-20 08:56:39'),(107,'Pendidikan Guru Madrasah Ibtidaiyah (S1)','prodi',1,'2026-08-20 08:56:39'),(108,'Pendidikan Islam Anak Usia Dini (S1)','prodi',1,'2026-08-20 08:56:39'),(109,'Manajemen Pendidikan Islam (S1)','prodi',1,'2026-08-20 08:56:39'),(110,'Tadris Bahasa Indonesia (S1)','prodi',1,'2026-08-20 08:56:39'),(111,'Tadris Kimia (S1)','prodi',1,'2026-08-20 08:56:39'),(112,'PJJ Pendidikan Agama Islam (S1)','prodi',7,'2026-08-20 08:56:39'),(113,'Pendidikan Profesi Guru Keagamaan (PPG)','prodi',8,'2026-08-20 08:56:39'),(114,'Informatika (S1)','prodi',1,'2026-09-02 06:25:06'),(115,'Matematika (S1)','prodi',1,'2026-09-02 06:25:06'),(201,'Perbankan Syariah (S1)','prodi',2,'2026-08-20 08:56:39'),(202,'Ekonomi Syariah (S1)','prodi',2,'2026-08-20 08:56:39'),(203,'Akuntansi Syariah (S1)','prodi',2,'2026-08-20 08:56:39'),(204,'Pariwisata Syariah (S1)','prodi',2,'2026-08-20 08:56:39'),(205,'Bioteknologi (S1)','prodi',2,'2026-09-02 06:25:06'),(301,'Hukum Keluarga (Akhwalul Syaksiyah) (S1)','prodi',3,'2026-08-20 08:56:39'),(302,'Hukum Ekonomi Syari\'ah (Muamalah) (S1)','prodi',3,'2026-08-20 08:56:39'),(303,'Hukum Tatanegara Islam (S1)','prodi',3,'2026-08-20 08:56:39'),(304,'Ilmu Falak (S1)','prodi',3,'2026-08-20 08:56:39'),(401,'Komunikasi dan Penyiaran Islam (S1)','prodi',4,'2026-08-20 08:56:39'),(402,'Pengembangan Masyarakat Islam (S1)','prodi',4,'2026-08-20 08:56:39'),(403,'Bimbingan dan Konseling Islam (S1)','prodi',4,'2026-08-20 08:56:39'),(404,'Sosiologi Agama (S1)','prodi',4,'2026-08-20 08:56:39'),(501,'Sejarah Peradaban Islam (S1)','prodi',5,'2026-08-20 08:56:39'),(502,'Aqidah dan Filsafat Islam (S1)','prodi',5,'2026-08-20 08:56:39'),(503,'Ilmu Al-Qur\'an dan Tafsir (S1)','prodi',5,'2026-08-20 08:56:39'),(504,'Ilmu Hadis (S1)','prodi',5,'2026-08-20 08:56:39'),(505,'Bahasa dan Sastra Arab (S1)','prodi',5,'2026-08-20 08:56:39'),(506,'Tasawuf dan Psikoterapi (S1)','prodi',5,'2026-08-20 08:56:39'),(601,'Manajemen Pendidikan Islam (S2)','prodi',6,'2026-08-20 08:56:39'),(602,'Pendidikan Agama Islam (S2)','prodi',6,'2026-08-20 08:56:39'),(603,'Hukum Keluarga (Akhwalul Syaksiyah) (S2)','prodi',6,'2026-08-20 08:56:39'),(604,'Ekonomi Syariah (S2)','prodi',6,'2026-08-20 08:56:39'),(605,'Pengembangan Masyarakat Islam (S2)','prodi',6,'2026-08-20 08:56:39'),(606,'PJJ Pendidikan Agama Islam (S2)','prodi',7,'2026-08-20 08:56:39'),(607,'Pendidikan Agama Islam (S3)','prodi',6,'2026-08-20 08:56:39'),(608,'Hukum Keluarga Islam (Ahwal Syakhshiyyah) (S3)','prodi',6,'2026-08-20 08:56:39'),(609,'Sejarah Peradaban Islam (S2)','prodi',6,'2026-09-02 06:25:06'),(610,'Ekonomi Syariah (S3)','prodi',6,'2026-09-02 06:25:06'),(701,'PJJ Pendidikan Bahasa Arab (S1)','prodi',7,'2026-09-02 06:25:06'),(702,'PJJ Pendidikan Guru Madrasah Ibtidaiyah (S1)','prodi',7,'2026-09-02 06:25:06'),(703,'PJJ Sejarah Peradaban Islam (S1)','prodi',7,'2026-09-02 06:25:06'),(704,'PJJ Hukum Keluarga (S1)','prodi',7,'2026-09-02 06:25:06');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussions`
--

DROP TABLE IF EXISTS `discussions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discussions` (
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
  CONSTRAINT `discussions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `discussions_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `discussions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussions`
--

LOCK TABLES `discussions` WRITE;
/*!40000 ALTER TABLE `discussions` DISABLE KEYS */;
/*!40000 ALTER TABLE `discussions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_parts`
--

DROP TABLE IF EXISTS `material_parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `material_parts` (
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_parts`
--

LOCK TABLES `material_parts` WRITE;
/*!40000 ALTER TABLE `material_parts` DISABLE KEYS */;
INSERT INTO `material_parts` VALUES (5,17,'Teknik Penulisan Proposal skripsi','https://drive.google.com/file/d/1vOo4ZZXkJ8vV7F-lDy-B-zz4WCVI1P8t/view?usp=sharing',1,'2026-09-02 06:47:10','https://drive.google.com/file/d/1IRY7SCdcLx8mOjzpdfhmRkPkwiJFInhs/view?usp=drive_link');
/*!40000 ALTER TABLE `material_parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` enum('document','video') NOT NULL,
  `category_slug` varchar(100) NOT NULL,
  `author` varchar(150) NOT NULL,
  `uploader_id` int(11) DEFAULT 1,
  `file_url` varchar(255) DEFAULT NULL,
  `module_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `status` enum('published','review','draft') DEFAULT 'published',
  `downloads` int(11) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `mata_kuliah` varchar(255) DEFAULT NULL,
  `kode_mata_kuliah` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uploader_id` (`uploader_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (17,'Eksplorasi Tools AI Populer dalam Pendidikan','video','pendidikan-agama-islam-s1-','Yayu Mega Purnamasari, M.Pd',3,'https://drive.google.com/file/d/1LpCI4CtuoSvQIkPdGjVpdMOwSz-Po_dc/view?usp=sharing','https://drive.google.com/file/d/1lgjhtN6SjpY-6RfyWKOKbV3LZHAVk7Ut/view?usp=drive_link','/storage/documents/xBC3V4fnAxjFyiyy4tlKHEI7o8lqG9fDQqnEir8K.jpg','published',0,1,'2026-09-01 22:46:38','AI dan Transformasi Pendidikan di Era','JMI624013');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2026_09_02_033106_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',3,'auth_token','378b9c934b66fdf9dc79be55343494568f1994dda6545f396dbac9a865d7e701','[\"*\"]',NULL,NULL,'2026-09-01 20:44:33','2026-09-01 20:44:33'),(2,'App\\Models\\User',3,'auth_token','2b1609071f24e428360430fe0c21add7c92eddc6c559035d49d696383b9240ca','[\"*\"]',NULL,NULL,'2026-09-01 20:44:56','2026-09-01 20:44:56'),(3,'App\\Models\\User',3,'auth_token','177a8179ec52e67f1b60014be4925fb163b2bcb7374d3ab83fd68734a643571b','[\"*\"]','2026-09-01 20:49:59',NULL,'2026-09-01 20:45:07','2026-09-01 20:49:59'),(4,'App\\Models\\User',3,'auth_token','95b268aca00d374b99f53ef3cd5ff927e5b5c31ecf06fb3b17e689ebe855879e','[\"*\"]','2026-09-01 20:50:12',NULL,'2026-09-01 20:50:00','2026-09-01 20:50:12'),(5,'App\\Models\\User',3,'auth_token','45a254cb31fe75a41f58784ad20fb57de121c72625474c7723694ad7a0d0d124','[\"*\"]','2026-09-01 20:53:37',NULL,'2026-09-01 20:50:13','2026-09-01 20:53:37'),(6,'App\\Models\\User',3,'auth_token','b4bf429d09208bfa2ebe05cd86ce26d6c3431342086ec7495c2aae1925bf0b5d','[\"*\"]','2026-09-01 20:55:52',NULL,'2026-09-01 20:53:38','2026-09-01 20:55:52'),(7,'App\\Models\\User',3,'auth_token','dae13cffa4cafe151b5d925daf54d361384ff49b64b49b98a91405759a31270c','[\"*\"]','2026-09-01 21:02:56',NULL,'2026-09-01 20:55:53','2026-09-01 21:02:56'),(8,'App\\Models\\User',3,'auth_token','2d2041fe24bd8f32afaf9519f5ed7679fa4233b2392642e1250d87ed2f08d8c6','[\"*\"]','2026-09-01 21:19:09',NULL,'2026-09-01 21:05:10','2026-09-01 21:19:09'),(9,'App\\Models\\User',3,'auth_token','9634627c2c1e5a203facc77b8c68e2344803af84215b7db733c322beccc08a31','[\"*\"]','2026-09-01 22:06:59',NULL,'2026-09-01 21:19:19','2026-09-01 22:06:59'),(10,'App\\Models\\User',3,'auth_token','8fabc5f4613f226efa8bd6e78e45307f909155490c1806359a52261b810482c7','[\"*\"]','2026-09-01 22:15:30',NULL,'2026-09-01 22:07:04','2026-09-01 22:15:30'),(11,'App\\Models\\User',3,'auth_token','89c8623232d96478e7723a43ac99eddf12be0f81b5eb395a89403ede7823a2af','[\"*\"]','2026-09-01 22:21:59',NULL,'2026-09-01 22:15:33','2026-09-01 22:21:59'),(12,'App\\Models\\User',3,'auth_token','e44adab056b116aaf8234323f53025f20a969506b3853bde1f047e807b8551f2','[\"*\"]','2026-09-01 22:29:01',NULL,'2026-09-01 22:22:04','2026-09-01 22:29:01'),(13,'App\\Models\\User',3,'auth_token','1c2b7a89ad00783d1e3d987dd398a4ef55cf9baf4205798ab9bafda1c8163f7d','[\"*\"]','2026-09-01 22:34:39',NULL,'2026-09-01 22:29:02','2026-09-01 22:34:39'),(14,'App\\Models\\User',3,'auth_token','02ae74eca3bd0b07312349c5a699f3385d0863fbe2a2f1589ad2d088b17924a1','[\"*\"]','2026-09-01 22:34:43',NULL,'2026-09-01 22:34:41','2026-09-01 22:34:43'),(15,'App\\Models\\User',3,'auth_token','5314e916525468fb1b7b9b1df64acb2216e18733bc9da13e55d90a2127ade5d9','[\"*\"]','2026-09-01 22:45:40',NULL,'2026-09-01 22:34:41','2026-09-01 22:45:40'),(16,'App\\Models\\User',3,'auth_token','165246e0f50bb34485b14d73651906729ad8497b8c72280692443dbbef920112','[\"*\"]','2026-09-01 23:07:27',NULL,'2026-09-01 22:45:42','2026-09-01 23:07:27'),(17,'App\\Models\\User',3,'auth_token','529427adaaef90495bc7f057393503b62c2289f7cfa6f82696a378f88f2bd3e4','[\"*\"]','2026-09-01 23:20:11',NULL,'2026-09-01 23:08:02','2026-09-01 23:20:11'),(18,'App\\Models\\User',3,'auth_token','750132cc05db58cf9c3b871746c1c066d38c29e58f4b1c33935e1c20c7dbecca','[\"*\"]','2026-09-01 23:16:28',NULL,'2026-09-01 23:13:20','2026-09-01 23:16:28'),(19,'App\\Models\\User',3,'auth_token','1b6b7aac7108ff8db153d7af1873c85aaa9b347cdbd28588bd3d5686f1e8e901','[\"*\"]','2026-09-01 23:30:14',NULL,'2026-09-01 23:16:29','2026-09-01 23:30:14'),(20,'App\\Models\\User',3,'auth_token','2a3eab876476a68a58c1aa1503e39f20117a337c5fec4ef740abb64db8236ca9','[\"*\"]','2026-09-01 23:47:16',NULL,'2026-09-01 23:30:14','2026-09-01 23:47:16'),(21,'App\\Models\\User',3,'auth_token','79acbdd38beaf0563437dadb3c565f4cd68527551ce53d704f5b7621ccfea026','[\"*\"]','2026-09-02 00:09:49',NULL,'2026-09-01 23:47:18','2026-09-02 00:09:49'),(22,'App\\Models\\User',3,'auth_token','f078f26217922955e28891a6ee23b5a1455de46a3061e948d79ae07013172033','[\"*\"]','2026-09-02 00:10:00',NULL,'2026-09-02 00:09:57','2026-09-02 00:10:00'),(23,'App\\Models\\User',3,'auth_token','069b972f89fdaaacd6d9b1b62822a3cbbf1463c55c938047416269898c4c8802','[\"*\"]','2026-09-02 00:10:12',NULL,'2026-09-02 00:10:05','2026-09-02 00:10:12'),(24,'App\\Models\\User',3,'auth_token','864b47c23b701b5701248ce0e0252491b6c1ee0789986c547a68219cf785b4a2','[\"*\"]','2026-09-02 00:27:00',NULL,'2026-09-02 00:26:24','2026-09-02 00:27:00'),(25,'App\\Models\\User',5,'auth_token','5a0a5421fd52108376548e862f84072a968ddc7a1a022f586a65506b7ff22787','[\"*\"]','2026-09-02 00:27:44',NULL,'2026-09-02 00:27:22','2026-09-02 00:27:44'),(26,'App\\Models\\User',3,'auth_token','150f85b32a270ead98c504675275f69deaf8cc8bf654a18c7cdd75fa9a85fbce','[\"*\"]','2026-09-02 00:27:57',NULL,'2026-09-02 00:27:49','2026-09-02 00:27:57');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_material_idx` (`user_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (8,17,'Okta',5,'Materinya sesuai denga perkembang zaman','2026-09-01 22:59:58',0);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_visits`
--

DROP TABLE IF EXISTS `site_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `visited_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_visits`
--

LOCK TABLES `site_visits` WRITE;
/*!40000 ALTER TABLE `site_visits` DISABLE KEYS */;
INSERT INTO `site_visits` VALUES (1,'::1','2026-08-27 03:47:46'),(2,'::1','2026-08-27 03:47:57'),(3,'::1','2026-08-27 03:47:57'),(4,'::1','2026-08-27 05:29:07'),(5,'::1','2026-08-27 05:29:07'),(6,'::1','2026-08-27 07:17:44'),(7,'::1','2026-08-27 07:17:44'),(8,'::1','2026-08-27 09:08:40'),(9,'::1','2026-08-27 09:08:40'),(10,'::1','2026-08-28 00:48:47'),(11,'::1','2026-08-28 00:48:47'),(12,'::1','2026-08-28 01:25:38'),(13,'::1','2026-08-28 01:25:38'),(14,'::1','2026-08-28 01:28:10'),(15,'::1','2026-08-28 01:28:10'),(16,'::1','2026-08-28 01:30:44'),(17,'::1','2026-08-28 01:30:44'),(18,'::1','2026-08-28 01:31:28'),(19,'::1','2026-08-28 01:31:28'),(20,'::1','2026-08-28 01:32:47'),(21,'::1','2026-08-28 01:32:47'),(22,'::1','2026-08-28 01:35:34'),(23,'::1','2026-08-28 01:35:34'),(24,'::1','2026-08-28 01:43:32'),(25,'::1','2026-08-28 01:43:32'),(26,'::1','2026-08-28 01:50:14'),(27,'::1','2026-08-28 01:50:14'),(28,'::1','2026-08-28 01:56:32'),(29,'::1','2026-08-28 01:56:32'),(30,'::1','2026-08-28 02:22:34'),(31,'::1','2026-08-28 02:22:34'),(32,'::1','2026-08-28 02:24:22'),(33,'::1','2026-08-28 02:24:22'),(34,'::1','2026-08-28 02:25:27'),(35,'::1','2026-08-28 02:25:27'),(36,'::1','2026-08-31 01:10:14'),(37,'::1','2026-08-31 01:10:14'),(38,'::1','2026-08-31 01:46:41'),(39,'::1','2026-08-31 01:46:41'),(40,'::1','2026-08-31 02:39:34'),(41,'::1','2026-08-31 02:39:34'),(42,'::1','2026-08-31 03:20:10'),(43,'::1','2026-08-31 03:20:10'),(44,'::1','2026-09-01 01:09:30'),(45,'::1','2026-09-01 01:09:30'),(46,'::1','2026-09-01 01:19:25'),(47,'::1','2026-09-01 01:19:25'),(48,'::1','2026-09-01 04:53:51'),(49,'::1','2026-09-01 04:53:51'),(50,'::1','2026-09-01 04:54:10'),(51,'::1','2026-09-01 04:54:10'),(52,'::1','2026-09-01 06:18:10'),(53,'::1','2026-09-01 06:18:10'),(54,'::1','2026-09-01 06:18:25'),(55,'::1','2026-09-01 06:18:25'),(56,'::1','2026-09-01 06:27:36'),(57,'::1','2026-09-01 06:27:36'),(58,'::1','2026-09-01 06:33:40'),(59,'::1','2026-09-01 06:33:40'),(60,'::1','2026-09-02 03:18:16'),(61,'::1','2026-09-02 03:18:16');
/*!40000 ALTER TABLE `site_visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_history`
--

DROP TABLE IF EXISTS `user_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `last_accessed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_history` (`user_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `user_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_history_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_history`
--

LOCK TABLES `user_history` WRITE;
/*!40000 ALTER TABLE `user_history` DISABLE KEYS */;
INSERT INTO `user_history` VALUES (178,3,17,'2026-09-02 00:04:07');
/*!40000 ALTER TABLE `user_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','dosen','mahasiswa','guest') DEFAULT 'mahasiswa',
  `status` enum('active','pending','blocked') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super','Admin','oier@uinssc','$2b$10$W5Sbm2gUVyxTFIAW4lsmF.XvUN1H4EaQyXzxR7NeAjITd2OIFKet2','superadmin','active','2026-08-19 09:19:33',NULL),(3,'Super','Admin','admin@oier.uin.ac.id','$2y$12$PJC8VI3LpWBQdgEzNuwjK.njZGoKgdjU7u2vdDHfUtUSG4PmskU1e','admin','active','2026-09-01 20:40:57',NULL),(5,'okta','bere','okta@gmail.com','$2y$12$CUZgAG.w26MTModXGnWyUuyyOAqFOgtH6guOS6pdpwmn12DlZczEe','mahasiswa','active','2026-09-02 00:26:19',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-02 14:33:24
