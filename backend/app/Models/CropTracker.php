<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropTracker extends Model
{
    use HasFactory;

    protected $table = 'croptracker';
    protected $fillable = [
        'crop_id',
        'planted',
        'location',
        'image_path',
    ];

    public function crop()
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
}
