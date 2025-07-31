<?php

namespace App\Http\Controllers;

use App\Models\Land;
use Illuminate\Http\Request;
use App\Http\Requests\LandRequest;

class LandController extends Controller
{
    public function index()
    {
        return response()->json(Land::all(), 200);
    }

    public function create()
    {
        return view('lands.create');
    }

    public function store(LandRequest $request)
{
    // Validated data is automatically available
    $land = Land::create($request->validated());

    return response()->json([
        'message' => 'Land created successfully',
        'data' => $land
    ], 201);
}

    public function show($id)
    {
        $land = Land::find($id);

        if (!$land) {
            return response()->json(['message' => 'Land Not Found'], 404);
        }

        return response()->json($land, 200);
    }

    public function edit(Land $land)
    {
        return view('lands.edit', compact('land'));
    }

    public function update(Request $request, $id)
    {
        $land = Land::find($id);

        if (!$land) {
            return response()->json(['message' => 'Land Not Found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'data_area_ha' => 'sometimes|required|numeric',
            'data_area_acres' => 'sometimes|required|numeric',
            'boundary_points' => 'sometimes|required|string',
        ]);

        $land->update($validated);

        return response()->json([
            'message' => 'Land updated successfully',
            'data' => $land
        ], 200);
    }

    public function destroy($id)
    {
        $land = Land::find($id);

        if (!$land) {
            return response()->json(['message' => 'Land Not Found'], 404);
        }

        $land->delete();

        return response()->json(['message' => 'Land deleted successfully'], 200);
    }
}
