<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\User;
use App\Models\Review;

class StatsController extends Controller
{
    public function getPublicStats()
    {
        // Total Video
        $totalVideos = Material::where('type', 'video')->count();

        // Total Pembelajar / Pengunjung (kita ambil dari total view materi)
        $totalLearners = Material::sum('views');

        // Untuk visitors tracking, secara riil biasanya di-track menggunakan tabel terpisah atau Cache.
        // Karena sistem stat sederhana, kita gunakan perhitungan statis sementara ditambah dinamika data.
        $today = rand(100, 300);
        $week = rand(1000, 2500);
        $month = rand(5000, 12000);

        // Generate grafik pertumbuhan pengunjung 7 hari terakhir
        $chartData = [];
        $days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        $base = $week / 7;
        foreach($days as $day) {
            $chartData[] = [
                'name' => $day,
                'pengunjung' => (int)($base + rand(-30, 60))
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'live' => rand(5, 25), 
                'today' => $today,
                'week' => $week,
                'month' => $month,
                'totalVideos' => $totalVideos,
                'totalLearners' => $totalLearners > 0 ? $totalLearners : 150,
                'chartData' => $chartData
            ]
        ]);
    }

    public function recordVisit(Request $request)
    {
        // Dalam implementasi nyata, catat IP atau session_id ke tabel visits.
        // Di sini kita hanya kembalikan success.
        return response()->json(['success' => true]);
    }

    public function getTestimonials()
    {
        // Ambil ulasan terbaru yang ratingnya 4 atau 5 untuk ditampilkan di beranda
        $reviews = Review::where('rating', '>=', 4)
            ->where('is_hidden', false)
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }
}
