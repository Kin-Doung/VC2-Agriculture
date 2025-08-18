<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FarmController extends Controller
{
    // ✅ Get all farms for authenticated user
    public function index()
    {
        $user = Auth::user();
        $farms = $user->farms; // Only own farms
        return response()->json($farms);
    }

    // ✅ Create a new farm for authenticated user
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:farms,name',
            'location_at_latitude' => 'required|numeric',
            'location_longitude' => 'required|numeric',
            'area' => 'nullable|numeric',
        ]);

        $farm = new Farm([
            'name' => $request->name,
            'location_at_latitude' => $request->location_at_latitude,
            'location_longitude' => $request->location_longitude,
            'area' => $request->area,
            'user_id' => Auth::id(),
        ]);

        $farm->save();

        return response()->json(['message' => 'Farm created successfully.', 'farm' => $farm], 201);
    }

    // ✅ Show a specific farm (only if owned by user)
    public function show($id)
    {
        $farm = Farm::findOrFail($id);

        if ($farm->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($farm);
    }

    // ✅ Update a farm (only if owned by user)
    public function update(Request $request, $id)
    {
        $farm = Farm::findOrFail($id);

        if ($farm->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|unique:farms,name,' . $farm->id,
            'location_at_latitude' => 'sometimes|required|numeric',
            'location_longitude' => 'sometimes|required|numeric',
            'area' => 'nullable|numeric',
        ]);

        $farm->update($request->only('name', 'location_at_latitude', 'location_longitude', 'area'));

        return response()->json(['message' => 'Farm updated successfully.', 'farm' => $farm]);
    }

    // ✅ Delete a farm (only if owned by user)
    public function destroy($id)
    {
        $farm = Farm::findOrFail($id);

        if ($farm->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $farm->delete();

        return response()->json(['message' => 'Farm deleted successfully.']);
    }
}
