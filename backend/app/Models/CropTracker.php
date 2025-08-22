<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    /**
     * Define the relationship with the Crop model.
     */
    public function crop()
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }

    /**
     * Accessor for image_path to return a full URL.
     *
     * @param  string|null  $value
     * @return string|null
     */
    public function getImagePathAttribute($value)
    {
        if (!$value) {
            return null; // Return null if no image_path is set
        }

        // If the value is already a full URL, return it as is
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Convert relative path to full URL
        return Storage::url($value);
    }
}