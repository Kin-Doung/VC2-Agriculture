<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'location_lat',
        'location_lon',
        'area',
        'farmer_id', // Assuming there's a user who owns the farm
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function crops()
    {
        return $this->hasMany(Crop::class, 'farm_id');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'farm_id');
    }
    public function farm()
    {
        return $this->hasMany(Farm::class, 'farm_id');
    }
}
