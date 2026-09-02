<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserHistory extends Model
{
    protected $table = 'user_history';
    public $timestamps = false; // Karena tabel ini punya last_accessed alih-alih created_at/updated_at
    protected $fillable = ['user_id', 'material_id', 'last_accessed'];

    public function user() { return $this->belongsTo(User::class); }
    public function material() { return $this->belongsTo(Material::class); }
}
