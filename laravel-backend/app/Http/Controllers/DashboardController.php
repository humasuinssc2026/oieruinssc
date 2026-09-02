<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\User;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalViews = Material::sum('views');
        $totalMaterials = Material::count();
        $pendingApprovals = Material::where('status', 'review')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'visitors' => $totalViews + 45000,
                'totalMaterials' => $totalMaterials,
                'pendingApprovals' => $pendingApprovals
            ]
        ]);
    }

    public function getChartData()
    {
        // Mock data to match what the old Node backend did for growth & categories
        $categories = Material::selectRaw('category_slug as name, count(*) as value')
            ->groupBy('category_slug')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => [
                'growth' => [], // Returning empty will make frontend use fallback visitorData
                'categories' => $categories
            ]
        ]);
    }

    public function getRecentActivity()
    {
        $recent = Material::select('id', 'title', 'type', 'category_slug', 'author', 'status', 'created_at as time')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $recent
        ]);
    }

    // --- MANAJEMEN PENGGUNA ---
    public function getAllUsers()
    {
        $users = User::orderBy('created_at', 'desc')->get(['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at']);
        return response()->json(['success' => true, 'data' => $users]);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:superadmin,admin,dosen,mahasiswa,guest'
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name ?? '',
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active'
        ]);

        return response()->json(['success' => true, 'message' => 'Pengguna berhasil ditambahkan.', 'data' => $user], 201);
    }

    public function updateUserRole(Request $request, $id)
    {
        $request->validate(['role' => 'required|string']);
        
        $user = User::findOrFail($id);
        if ($user->role === 'superadmin') {
            return response()->json(['success' => false, 'message' => 'Tidak dapat mengubah peran Super Admin.'], 403);
        }

        $user->update(['role' => $request->role]);
        return response()->json(['success' => true, 'message' => 'Peran berhasil diperbarui.']);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string|in:active,pending,blocked']);
        
        $user = User::findOrFail($id);
        if ($user->role === 'superadmin' && $request->status !== 'active') {
            return response()->json(['success' => false, 'message' => 'Tidak dapat mengubah status Super Admin.'], 403);
        }

        $user->update(['status' => $request->status]);
        return response()->json(['success' => true, 'message' => 'Status berhasil diperbarui.']);
    }

    public function updateUser(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'password' => 'nullable|min:6'
        ]);

        $user = User::findOrFail($id);
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name ?? '';
        $user->email = $request->email;
        if ($request->password) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }
        $user->save();

        return response()->json(['success' => true, 'message' => 'Data pengguna berhasil diperbarui.']);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'superadmin') {
            return response()->json(['success' => false, 'message' => 'Super Admin utama tidak dapat dihapus.'], 403);
        }
        $user->delete();
        return response()->json(['success' => true, 'message' => 'Pengguna berhasil dihapus.']);
    }

    // --- MODERASI ULASAN ---
    public function getAllReviews()
    {
        $reviews = \App\Models\Review::with('material:id,title')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Map the result to match the frontend expectations: material_title
        $mapped = $reviews->map(function($review) {
            $review->material_title = $review->material ? $review->material->title : null;
            return $review;
        });

        return response()->json(['success' => true, 'data' => $mapped]);
    }

    public function toggleReviewVisibility($id)
    {
        $review = \App\Models\Review::findOrFail($id);
        $review->is_hidden = !$review->is_hidden;
        $review->save();

        return response()->json([
            'success' => true,
            'is_hidden' => $review->is_hidden,
            'message' => $review->is_hidden ? 'Ulasan disembunyikan.' : 'Ulasan ditampilkan kembali.'
        ]);
    }

    public function deleteReview($id)
    {
        \App\Models\Review::destroy($id);
        return response()->json(['success' => true, 'message' => 'Ulasan berhasil dihapus.']);
    }
}
