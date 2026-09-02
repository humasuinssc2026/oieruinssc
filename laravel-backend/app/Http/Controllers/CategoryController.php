<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $faculties = Category::where('type', 'faculty')->get(['id', 'name']);
        $prodis = Category::where('type', 'prodi')
            ->select('id', 'name', 'parent_id as fakultasId')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => [
                'fakultasList' => $faculties,
                'prodiList' => $prodis
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:faculty,prodi,general',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type,
                'fakultasId' => $category->parent_id
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string']);
        
        $category = Category::findOrFail($id);
        $category->update(['name' => $request->name]);

        return response()->json(['success' => true, 'message' => 'Kategori berhasil diubah.']);
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['success' => true, 'message' => 'Kategori berhasil dihapus.']);
    }
}
