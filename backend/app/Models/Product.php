<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'crop_id',
        'user_id',
        'category_id',
        'name',
        'description',
        'price',
        'quantity',
        'available_from',
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
