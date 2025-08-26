<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'farm_id',
        'crop_id',  
        'task_type',
        'description',
        'due_date',
        'is_completed',

    ];
    public function farm()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function crop()
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'task_id');
    }
}
