<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CropTrackerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth('sanctum')->check(); // Ensure the user is authenticated via Sanctum
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'crop_id' => ['sometimes', 'exists:crops,id'],
            'planted' => ['sometimes', 'string', 'date'],
            'location' => ['sometimes', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];

        // For POST requests (store), make fields required
        if ($this->isMethod('POST')) {
            $rules['crop_id'] = ['required', 'exists:crops,id'];
            $rules['planted'] = ['required', 'string', 'date'];
            $rules['location'] = ['required', 'string'];
        }

        return $rules;
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'crop_id.required' => 'The crop name is required.',
            'crop_id.exists' => 'The selected crop does not exist.',
            'planted.required' => 'The planted date is required.',
            'planted.date' => 'The planted date must be a valid date.',
            'location.required' => 'The location is required.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif.',
            'image.max' => 'The image may not be larger than 2MB.',
        ];
    }
}