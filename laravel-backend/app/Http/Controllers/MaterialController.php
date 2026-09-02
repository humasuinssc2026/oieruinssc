<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 1000);
        
        $materials = Material::with(['uploader', 'parts'])
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $materials->items(),
            'pagination' => [
                'page' => $materials->currentPage(),
                'limit' => $materials->perPage(),
                'totalItems' => $materials->total(),
                'totalPages' => $materials->lastPage()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:document,video',
            'category_slug' => 'required|string',
            'author' => 'required|string',
            'document_file' => 'nullable|file',
            'thumbnail_file' => 'nullable|image',
            'url' => 'nullable|string',
            'module_url' => 'nullable|string',
            'mata_kuliah' => 'nullable|string',
            'kode_mata_kuliah' => 'nullable|string',
        ]);

        $file_url = null;
        $module_url = null;
        $thumbnail_url = null;

        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('documents', 'public');
            $thumbnail_url = '/storage/' . $path;
        }

        if ($request->type === 'document') {
            if (!$request->hasFile('document_file') && !$request->module_url) {
                return response()->json(['success' => false, 'message' => 'File PDF atau Tautan wajib diisi.'], 400);
            }
            if ($request->hasFile('document_file')) {
                $path = $request->file('document_file')->store('documents', 'public');
                $file_url = '/storage/' . $path;
            } else {
                $file_url = $request->module_url;
            }
            $module_url = $file_url;
        } else {
            $file_url = $request->url;
            if (!$file_url) {
                return response()->json(['success' => false, 'message' => 'URL wajib diisi untuk video.'], 400);
            }
            if ($request->hasFile('document_file')) {
                $path = $request->file('document_file')->store('documents', 'public');
                $module_url = '/storage/' . $path;
            } else {
                $module_url = $request->module_url;
            }
        }

        $material = Material::create([
            'title' => $request->title,
            'type' => $request->type,
            'category_slug' => $request->category_slug,
            'author' => $request->author,
            'uploader_id' => $request->user()->id ?? 1,
            'file_url' => $file_url,
            'module_url' => $module_url,
            'thumbnail_url' => $thumbnail_url,
            'mata_kuliah' => $request->mata_kuliah,
            'kode_mata_kuliah' => $request->kode_mata_kuliah,
            'status' => 'published'
        ]);
        
        // Thumbnail URL tidak ada di model yang saya buat sebelumnya, tapi di node.js ada.
        // Jika perlu, tambahkan kolom thumbnail_url ke migration materials.

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil diunggah dan disimpan ke database.',
            'data' => $material
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'category' => 'required|string',
            'author' => 'required|string',
            'url' => 'nullable|string',
            'module_url' => 'nullable|string',
            'thumbnail_file' => 'nullable|image'
        ]);

        $material->title = $request->title;
        $material->category_slug = $request->category;
        $material->author = $request->author;
        
        if ($material->type === 'video' && $request->url) {
            $material->file_url = $request->url;
        }
        
        if ($request->has('module_url')) {
            $material->module_url = $request->module_url;
        }

        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('documents', 'public');
            $material->thumbnail_url = '/storage/' . $path;
        }

        $material->save();

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil diupdate',
            'data' => $material
        ]);
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil dihapus.'
        ]);
    }

    // --- INTERAKSI MATERI ---
    
    public function incrementView($id)
    {
        Material::where('id', $id)->increment('views');
        return response()->json(['success' => true, 'message' => 'View count incremented']);
    }

    public function getReviews($id)
    {
        $reviews = \App\Models\Review::where('material_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function addReview(Request $request, $id)
    {
        $request->validate([
            'user_name' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string'
        ]);

        $review = \App\Models\Review::create([
            'material_id' => $id,
            'user_name' => $request->user_name,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json(['success' => true, 'message' => 'Ulasan berhasil ditambahkan', 'data' => $review], 201);
    }

    public function getDiscussions($id)
    {
        $discussions = \App\Models\Discussion::where('material_id', $id)
            ->leftJoin('users', 'discussions.user_id', '=', 'users.id')
            ->select('discussions.id', 'discussions.user_name as name', 'discussions.text', 'discussions.created_at as time', 'discussions.parent_id', 'users.role')
            ->orderBy('discussions.created_at', 'asc')
            ->get();
            
        $mapped = $discussions->map(function($d) {
            $d->isInstructor = in_array($d->role, ['admin', 'superadmin', 'dosen']) ? 1 : 0;
            return $d;
        });

        return response()->json(['success' => true, 'data' => $mapped]);
    }

    public function addDiscussion(Request $request, $id)
    {
        $request->validate([
            'text' => 'required|string',
            'user_name' => 'required|string',
            'parent_id' => 'nullable|integer'
        ]);

        $user_id = $request->user() ? $request->user()->id : $request->user_id;

        $discussion = \App\Models\Discussion::create([
            'material_id' => $id,
            'user_id' => $user_id,
            'user_name' => $request->user_name,
            'text' => $request->text,
            'parent_id' => $request->parent_id
        ]);

        // Mock response data
        $discussion->name = $discussion->user_name;
        $discussion->time = $discussion->created_at;
        $discussion->isInstructor = $request->user() && in_array($request->user()->role, ['admin', 'superadmin', 'dosen']) ? 1 : 0;

        return response()->json(['success' => true, 'message' => 'Diskusi berhasil dikirim', 'data' => $discussion], 201);
    }

    public function getComments($id)
    {
        $comments = \App\Models\Comment::where('material_id', $id)
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->select('comments.id', 'comments.content', 'comments.created_at', 'users.first_name', 'users.last_name', 'users.profile_pic')
            ->orderBy('comments.created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $comments]);
    }

    public function addComment(Request $request, $id)
    {
        $request->validate(['content' => 'required|string']);

        $comment = \App\Models\Comment::create([
            'material_id' => $id,
            'user_id' => $request->user()->id,
            'content' => $request->content
        ]);
        
        $comment->first_name = $request->user()->first_name;
        $comment->last_name = $request->user()->last_name;
        $comment->profile_pic = $request->user()->profile_pic;

        return response()->json(['success' => true, 'message' => 'Komentar berhasil ditambahkan', 'data' => $comment]);
    }

    public function addPart(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'url' => 'required|string',
            'module_url' => 'nullable|string'
        ]);

        $material = Material::findOrFail($id);
        
        $partCount = \App\Models\MaterialPart::where('material_id', $id)->count();

        $part = \App\Models\MaterialPart::create([
            'material_id' => $id,
            'title' => $request->title,
            'url' => $request->url,
            'module_url' => $request->module_url,
            'part_number' => $partCount + 1
        ]);

        return response()->json(['success' => true, 'message' => 'Bagian berhasil ditambahkan', 'data' => $part], 201);
    }

    public function deletePart($partId)
    {
        $part = \App\Models\MaterialPart::findOrFail($partId);
        $part->delete();

        return response()->json(['success' => true, 'message' => 'Bagian berhasil dihapus']);
    }
}
