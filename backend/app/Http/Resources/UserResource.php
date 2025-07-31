<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'email'    => $this->email,
            'farm_name'=> $this->farm_name,
            'location' => $this->location,
            'phone'    => $this->phone,
            'role'      => $this->role,
            'is_admin'  => $this->is_admin,
        ];
    }
}
