<?php

namespace App\Http\Controllers;

use App\Models\CropType;
use App\Http\Requests\CropTypeRequest;

class CropTypeController extends Controller
{
    public function index()
    {
        $types = CropType::all();
        return response()->json($types);
    }

    public function store(CropTypeRequest $request)
    {
        $cropType = CropType::create($request->validated());
        return response()->json($cropType, 201);
    }

    public function show(string $id)
    {
        $cropType = CropType::findOrFail($id);
        return response()->json($cropType);
    }

    public function update(CropTypeRequest $request, string $id)
    {
        $cropType = CropType::findOrFail($id);
        $cropType->update($request->validated());
        return response()->json($cropType);
    }

    public function destroy(string $id)
    {
        $cropType = CropType::findOrFail($id);
        $cropType->delete();
        return response()->json(['message' => 'CropType deleted']);
    }
}
