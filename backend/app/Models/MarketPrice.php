<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketPrice extends Model
{
    use HasFactory;
    protected $fillable = [
        'crop_type_id',
        'price',
        'date_recorded',
        'region',
    ];
    public function cropType()
    {
        return $this->belongsTo(CropType::class, 'crop_type_id');
    }
}
