<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserHistory;
use App\Models\Material;

class UserController extends Controller
{
    public function getProfile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }

    public function getHistory(Request $request)
    {
        $userId = $request->user()->id;

        $history = UserHistory::where('user_id', $userId)
            ->join('materials', 'user_history.material_id', '=', 'materials.id')
            ->select('user_history.last_accessed', 'materials.id', 'materials.title', 'materials.type', 'materials.category_slug', 'materials.thumbnail_url')
            ->orderBy('user_history.last_accessed', 'desc')
            ->get();

        $totalMaterials = Material::count();
        $completed = $history->count();
        $progress_percentage = $totalMaterials > 0 ? round(($completed / $totalMaterials) * 100) : 0;

        return response()->json([
            'success' => true,
            'data' => $history,
            'progress' => [
                'total' => $totalMaterials,
                'completed' => $completed,
                'percentage' => $progress_percentage
            ]
        ]);
    }

    public function recordHistory(Request $request)
    {
        $request->validate(['material_id' => 'required|exists:materials,id']);

        UserHistory::updateOrCreate(
            ['user_id' => $request->user()->id, 'material_id' => $request->material_id],
            ['last_accessed' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Riwayat berhasil dicatat']);
    }

    public function uploadProfilePic(Request $request)
    {
        $request->validate(['profile_pic' => 'required|image']);

        $path = $request->file('profile_pic')->store('profiles', 'public');
        $fileUrl = '/storage/' . $path;

        $user = $request->user();
        $user->profile_pic = $fileUrl;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil diperbarui',
            'profile_pic' => $fileUrl
        ]);
    }

    public function getBookmarks(Request $request)
    {
        $userId = $request->user()->id;

        $bookmarks = \App\Models\Bookmark::where('user_id', $userId)
            ->join('materials', 'bookmarks.material_id', '=', 'materials.id')
            ->select('bookmarks.id as bookmark_id', 'bookmarks.created_at as bookmarked_at', 'materials.id', 'materials.title', 'materials.type', 'materials.category_slug', 'materials.thumbnail_url')
            ->orderBy('bookmarks.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bookmarks
        ]);
    }

    public function toggleBookmark(Request $request, $materialId)
    {
        $userId = $request->user()->id;
        
        $bookmark = \App\Models\Bookmark::where('user_id', $userId)->where('material_id', $materialId)->first();
        
        if ($bookmark) {
            $bookmark->delete();
            return response()->json([
                'success' => true,
                'message' => 'Materi dihapus dari favorit',
                'is_bookmarked' => false
            ]);
        } else {
            \App\Models\Bookmark::create([
                'user_id' => $userId,
                'material_id' => $materialId
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Materi ditambahkan ke favorit',
                'is_bookmarked' => true
            ]);
        }
    }
}
