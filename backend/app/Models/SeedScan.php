<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeedScan extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'crop_type_id',
        'scan_result',
        'scan_date',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function crop_type()
    {
        return $this->belongsTo(CropType::class, 'crop_type_id');
    }
    
}
