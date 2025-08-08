<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    use HasFactory;
    protected $fillable = [
        'farm_id',
        'crop_type_id',
        'planting_date',
        'growth_stage',
        'notes',
        'user_id',
    ];
    public function cropType()
    {
        return $this->belongsTo(CropType::class, 'crop_type_id');
    }
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
}
