<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Return true to allow all users for now.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name'             => 'required|string|max:255',
            'data_area_ha'     => 'required|numeric',
            'data_area_acres'  => 'required|numeric',
            'boundary_points'  => 'required|string',
        ];
    }
}
