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
}
