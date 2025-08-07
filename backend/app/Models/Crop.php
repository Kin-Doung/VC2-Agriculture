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
    ];
    public function farm()
    {
        return $this->belongsTo(Farm::class, 'farm_id');
    }
    public function product()
    {
        return $this->hasMany(Product::class, 'product_id');
    }
}
