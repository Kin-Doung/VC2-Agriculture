<?php

namespace App\Http\Controllers;

use App\Models\Land;
use Illuminate\Http\Request;
use App\Http\Requests\LandRequest;

class LandController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $lands = Land::where('user_id', auth()->id())->get();
        return response()->json($lands, 200);
    }

    public function create()
    {
        return view('lands.create');
    }

    public function store(LandRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        // dd($data);

        $land = Land::create($data);

        return response()->json([
            'message' => 'Land created successfully',
            'data' => $land
        ], 201);
    }

    public function show($id)
    {
        $land = Land::where('id', $id)->where('user_id', auth()->id())->first();

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
        $land = Land::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$land) {
            return response()->json(['message' => 'Land Not Found or Unauthorized'], 404);
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
        $land = Land::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$land) {
            return response()->json(['message' => 'Land Not Found'], 404);
        }

        $land->delete();

        return response()->json(['message' => 'Land deleted successfully'], 200);
    }
}
