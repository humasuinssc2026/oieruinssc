<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['material_id', 'user_id', 'user_name', 'text', 'parent_id'];

    public function user() { return $this->belongsTo(User::class); }
    public function material() { return $this->belongsTo(Material::class); }
}
