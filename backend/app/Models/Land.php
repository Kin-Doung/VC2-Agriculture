<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Land extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'data_area_ha',
        'data_area_acres',
        'seed_amount_min',
        'seed_amount_max',
        'fertilizer_total',
        'date',
        'land_type',
        'boundary_points',
    ];

    protected $casts = [
        'fertilizer_total' => 'array',
        'boundary_points' => 'array',
        'date' => 'date',
    ];
}