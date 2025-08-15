<?php

namespace App\Http\Controllers;

use App\Models\CropTracker;
use Illuminate\Http\Request;

class CropTrackerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    
   public function index()
    {
        $cropTrackers = CropTracker::with('crop')->get();
        return response()->json($cropTrackers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'crop_id' => 'required|exists:crops,id',
            'planted' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
        ]);

        $cropTracker = CropTracker::create($validatedData);

        return response()->json($cropTracker, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cropTracker = CropTracker::with('crop')->findOrFail($id);
        return response()->json($cropTracker);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cropTracker = CropTracker::findOrFail($id);

        $validatedData = $request->validate([
            'crop_id' => 'sometimes|exists:crops,id',
            'planted' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
        ]);

        $cropTracker->update($validatedData);

        return response()->json($cropTracker);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cropTracker = CropTracker::findOrFail($id);
        $cropTracker->delete();

        return response()->json(null, 204);
    }
}
