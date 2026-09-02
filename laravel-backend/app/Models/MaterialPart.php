<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialPart extends Model
{
    protected $table = "material_parts";
    public $timestamps = false; // We only have created_at, but let us disable default timestamps

    protected $fillable = [
        "material_id",
        "title",
        "url",
        "module_url",
        "part_number",
        "created_at"
    ];

    public function material()
    {
        return $this->belongsTo(Material::class, "material_id");
    }
}

