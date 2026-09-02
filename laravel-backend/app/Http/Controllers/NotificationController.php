<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function getUserNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'Notifikasi ditandai sudah dibaca']);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'Semua notifikasi ditandai sudah dibaca']);
    }

    // Fungsi helper internal jika diperlukan
    public static function createNotification($userId, $message, $link = null)
    {
        Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'link' => $link
        ]);
    }
}
