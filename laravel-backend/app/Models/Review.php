<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['material_id', 'user_name', 'rating', 'comment', 'is_hidden'];
    
    public function material() { return $this->belongsTo(Material::class); }
}
