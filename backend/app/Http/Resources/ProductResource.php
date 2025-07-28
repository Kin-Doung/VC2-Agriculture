<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'image' => $this->image_path,
            'available_from' => $this->available_from,
            'category' => $this->category->name ?? null,
            'crop' => $this->crop->name ?? null,
            'user' => $this->user->name ?? null,
        ];
    }
}
