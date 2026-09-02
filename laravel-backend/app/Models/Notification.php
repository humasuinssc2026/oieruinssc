<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['user_id', 'message', 'link', 'is_read'];

    public function user() { return $this->belongsTo(User::class); }
}
