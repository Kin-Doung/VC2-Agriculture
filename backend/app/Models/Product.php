<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'price',
        'quantity',
        'user_id',
        'category_id',
        'crop_id',
        'available_from',
        'image_path',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function crop()
    {
        return $this->belongsTo(Crop::class, 'crop_id');
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function chart()
    {
        return $this->hasMany(Chat::class, 'product_id');
    }
}
