<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropType extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'category',
        'description',
        'care_tips',
    ];  
    public function crop()
    {
        return $this->hasMany(Crop::class, 'crop_type_id'); 
    }
    public function seedScans()
    {
        return $this->hasMany(SeedScan::class, 'crop_type_id');
    }
}
