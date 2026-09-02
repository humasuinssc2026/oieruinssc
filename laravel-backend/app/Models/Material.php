<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['title', 'type', 'category_slug', 'author', 'uploader_id', 'file_url', 'module_url', 'thumbnail_url', 'status', 'downloads', 'views', 'mata_kuliah', 'kode_mata_kuliah'])]
class Material extends Model
{
    const UPDATED_AT = null;

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function parts()
    {
        return $this->hasMany(MaterialPart::class, 'material_id')->orderBy('part_number', 'asc');
    }
}
