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
     * Prepare the request data for validation by merging JSON input.
     */
    protected function prepareForValidation()
    {
        if ($this->isJson()) {
            $this->merge($this->json()->all());
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'data_area_ha' => 'required|numeric|min:0',
            'data_area_acres' => 'required|numeric|min:0',
            'seed_amount_min' => 'required|numeric|min:0',
            'seed_amount_max' => 'required|numeric|min:0',
            'fertilizer_total' => 'required|array',
            'date' => 'required|date|date_format:Y-m-d',
            'land_type' => 'required|string',
            'boundary_points' => 'required|array|min:3',
            'boundary_points.*.lat' => 'required|numeric|between:-90,90',
            'boundary_points.*.lng' => 'required|numeric|between:-180,180',
            'boundary_points.*.id' => 'required|string',
            'boundary_points.*.isGPS' => 'required|boolean',
        ];

        // For PUT/PATCH requests, allow partial updates by making non-critical fields nullable
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['data_area_ha'] = 'nullable|numeric|min:0';
            $rules['data_area_acres'] = 'nullable|numeric|min:0';
            $rules['seed_amount_min'] = 'nullable|numeric|min:0';
            $rules['seed_amount_max'] = 'nullable|numeric|min:0';
            $rules['fertilizer_total'] = 'nullable|array';
            $rules['boundary_points'] = 'nullable|array|min:3';
            $rules['boundary_points.*.lat'] = 'nullable|numeric|between:-90,90';
            $rules['boundary_points.*.lng'] = 'nullable|numeric|between:-180,180';
            $rules['boundary_points.*.id'] = 'nullable|string';
            $rules['boundary_points.*.isGPS'] = 'nullable|boolean';
        }

        return $rules;
    }
}