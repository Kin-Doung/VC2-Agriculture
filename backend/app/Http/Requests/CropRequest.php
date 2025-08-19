<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CropRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'farm_id' => 'required|integer|exists:farms,id',
            'planting_date' => 'nullable|date',
            'growth_stage' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
