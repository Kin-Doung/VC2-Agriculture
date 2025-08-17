<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'farm_id',
        'planting_date',
        'growth_stage',
        'notes',
        'user_id',
    ];
    public function farm()
    {
        return $this->belongsTo(Farm::class, 'farm_id');
    }
    public function product()
    {
        return $this->hasMany(Product::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function cropTrackers()
    {
        return $this->hasMany(CropTracker::class, 'crop_id');
    }
}
