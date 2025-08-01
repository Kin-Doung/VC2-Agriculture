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
            'farm_id' => 'required|integer|exists:farms,id',
            'crop_type_id' => 'required|integer|exists:crop_types,id',
            'planting_date' => 'nullable|date',
            'growth_stage' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
