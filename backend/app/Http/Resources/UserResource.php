<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'farm_name' => $this->farm_name,
            'location' => $this->location,
            'role' => $this->role,
            'profile_image' => $this->profile_image ? asset('storage/' . $this->profile_image) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'farm' => $this->whenLoaded('farm'),
            'seedScans' => $this->whenLoaded('seedScans'),
            'transactions' => $this->whenLoaded('transactions'),
            'supportRequests' => $this->whenLoaded('supportRequests'),
            'chats' => $this->whenLoaded('chats'),
        ];
    }
}