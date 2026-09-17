<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan tabel kategori terlebih dahulu agar tidak duplikat saat dijalankan ulang
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Category::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $faculties = [
            'Fakultas Ilmu Tarbiyah dan Keguruan' => [
                'Pendidikan Agama Islam (S1)',
                'Pendidikan Bahasa Arab (S1)',
                'Tadris Bahasa Inggris (S1)',
                'Tadris Ilmu Pengetahuan Sosial (S1)',
                'Tadris Matematika (S1)',
                'Tadris Biologi (S1)',
                'Pendidikan Guru Madrasah Ibtidaiyah (S1)',
                'Pendidikan Islam Anak Usia Dini (S1)',
                'Manajemen Pendidikan Islam (S1)',
                'Tadris Bahasa Indonesia (S1)',
                'Tadris Kimia (S1)',
                'PJJ Pendidikan Agama Islam (S1)',
                'Informatika (S1)',
                'Matematika (S1)',
            ],
            'Fakultas Syariah' => [
                'Hukum Keluarga (Akhwalul Syaksiyah) (S1)',
                'Hukum Ekonomi Syari\'ah (Muamalah) (S1)',
                'Hukum Tatanegara Islam (S1)',
                'Ilmu Falak (S1)',
                'PJJ Hukum Keluarga (S1)',
            ],
            'Fakultas Ekonomi dan Bisnis Islam' => [
                'Perbankan Syariah (S1)',
                'Ekonomi Syariah (S1)',
                'Akuntansi Syariah (S1)',
                'Pariwisata Syariah (S1)',
                'Bioteknologi (S1)',
            ],
            'Fakultas Ushuluddin dan Adab' => [
                'Sejarah Peradaban Islam (S1)',
                'Aqidah dan Filsafat Islam (S1)',
                'Ilmu Al-Qur\'an dan Tafsir (S1)',
                'Ilmu Hadis (S1)',
                'Bahasa dan Sastra Arab (S1)',
                'Tasawuf dan Psikoterapi (S1)',
                'PJJ Sejarah Peradaban Islam (S1)',
            ],
            'Fakultas Dakwah dan Komunikasi Islam' => [
                'Komunikasi dan Penyiaran Islam (S1)',
                'Pengembangan Masyarakat Islam (S1)',
                'Bimbingan dan Konseling Islam (S1)',
                'Sosiologi Agama (S1)',
            ],
            'Pascasarjana' => [
                'Manajemen Pendidikan Islam (S2)',
                'Pendidikan Agama Islam (S2)',
                'Hukum Keluarga (Akhwalul Syaksiyah) (S2)',
                'Ekonomi Syariah (S2)',
                'Pengembangan Masyarakat Islam (S2)',
                'Sejarah Peradaban Islam (S2)',
                'PJJ Pendidikan Agama Islam (S2)',
                'Pendidikan Agama Islam (S3)',
                'Hukum Keluarga Islam (Ahwal Syakhshiyyah) (S3)',
                'Ekonomi Syariah (S3)',
            ],
            'Pendidikan Jarak Jauh (PJJ)' => [
                'PJJ Pendidikan Agama Islam (S1)',
                'PJJ Hukum Keluarga Islam (S1)',
                'PJJ Sejarah Peradaban Islam (S1)',
                'PJJ Pendidikan Guru Madrasah Ibtidaiyah (S1)',
                'PJJ Tadris Matematika (S1)',
                'PJJ Ilmu Al-Qur\'an dan Tafsir (S1)',
                'PJJ Tadris Bahasa Indonesia (S1)',
            ]
        ];

        foreach ($faculties as $facultyName => $prodis) {
            $faculty = Category::create([
                'name' => $facultyName,
                'type' => 'faculty',
            ]);

            foreach ($prodis as $prodiName) {
                Category::create([
                    'name' => $prodiName,
                    'type' => 'prodi',
                    'parent_id' => $faculty->id,
                ]);
            }
        }
    }
}
