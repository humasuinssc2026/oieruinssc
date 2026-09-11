# Panduan Deployment (Update Server Production)

Dokumen ini berisi langkah-langkah standar untuk melakukan update pada server *production* setelah ada perubahan kode yang di-push ke GitHub. 

Khususnya, panduan ini mencakup langkah **penambahan tabel baru di database** dan **pembaruan tampilan dashboard di frontend**.

---

## 1. Tarik Kode Terbaru (Pull)
Login ke server via SSH atau Terminal dan arahkan ke direktori utama project Anda (root folder). Tarik perubahan kode terbaru dari GitHub.

```bash
# Pastikan Anda berada di root project
git pull origin main
```
*(Catatan: Ganti `main` dengan nama branch production Anda jika menggunakan nama lain seperti `master`).*

---

## 2. Update Backend (Laravel)
Masuk ke direktori backend untuk mengupdate dependensi dan menjalankan migrasi database.

```bash
cd laravel-backend

# 1. Update library backend (jika ada package baru di composer.json)
composer install --no-dev --optimize-autoloader

# 2. Migrasi Database 
# (SANGAT PENTING: Ini akan mengeksekusi file migrasi baru untuk menambahkan tabel tanpa menghapus data lama)
php artisan migrate --force

# 3. Clear & Rebuild Cache (Agar server membaca config dan route terbaru)
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
*(Catatan: Flag `--force` wajib digunakan di environment production agar proses migrasi bisa berjalan).*

---

## 3. Update Frontend (React / Vite)
Setelah backend selesai, Anda perlu mem-build ulang frontend agar perubahan desain/dashboard pada React bisa dirender ke file statis.

```bash
# Kembali ke direktori root (keluar dari laravel-backend)
cd ..

# 1. Update library frontend (jika ada package baru di package.json)
npm install

# 2. Build ulang production assets
npm run build
```
Setelah perintah ini selesai, file statis terbaru akan ter-generate di dalam folder `dist/` (atau `build/`). 
Pastikan konfigurasi Web Server (Nginx / Apache) Anda sudah diarahkan (Document Root) secara benar ke folder `dist/` tersebut.

---

## 4. Restart Web Server / Services (Opsional)
Jika Anda menggunakan caching dari web server, atau PM2 untuk menjalankan service tertentu, lakukan restart.

```bash
# Untuk Nginx:
sudo systemctl restart nginx

# Untuk Apache:
sudo systemctl restart apache2
```

---
**Selesai.** Website Anda sekarang sudah berjalan dengan tampilan dashboard terbaru dan struktur database yang sudah diperbarui.
