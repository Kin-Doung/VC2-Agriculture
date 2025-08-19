<?php

namespace App\Http\Controllers;

use App\Models\CropTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CropTrackerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {

        $cropTrackers = CropTracker::with('crop')->get()->map(function ($cropTracker) {
            // Append full URL to image_path
            if ($cropTracker->image_path) {
                $cropTracker->image_path = Storage::url($cropTracker->image_path);
            }
            return $cropTracker;
        });
        return response()->json($cropTrackers, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'crop_id' => 'required|exists:crops,id',
            'planted' => 'required|string',
            'location' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif', // Added max size for clarity
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['crop_id', 'planted', 'location']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image_path'] = Storage::url($imagePath); // Store full URL
        }

        $cropTracker = CropTracker::create($data);
        return response()->json($cropTracker->load('crop'), 201);
    }

    public function show($id)
    {
        $cropTracker = CropTracker::with('crop')->find($id);
        if (!$cropTracker) {
            return response()->json(['message' => 'Crop Tracker not found'], 404);
        }
        // Append full URL to image_path
        if ($cropTracker->image_path) {
            $cropTracker->image_path = Storage::url($cropTracker->image_path);
        }
        return response()->json($cropTracker, 200);
    }

    public function update(Request $request, $id)
    {
        $cropTracker = CropTracker::find($id);
        if (!$cropTracker) {
            return response()->json(['message' => 'Crop Tracker not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'crop_id' => 'sometimes|exists:crops,id',
            'planted' => 'sometimes|string',
            'location' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['crop_id', 'planted', 'location']);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Optionally delete the old image
            if ($cropTracker->image_path) {
                Storage::disk('public')->delete(str_replace(Storage::url(''), '', $cropTracker->image_path));
            }
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image_path'] = Storage::url($imagePath);
        }

        $cropTracker->update($data);
        return response()->json($cropTracker->load('crop'), 200);
    }

    public function destroy($id)
    {
        $cropTracker = CropTracker::find($id);
        if (!$cropTracker) {
            return response()->json(['message' => 'Crop Tracker not found'], 404);
        }

        // Optionally delete the image file when deleting the record
        if ($cropTracker->image_path) {
            Storage::disk('public')->delete(str_replace(Storage::url(''), '', $cropTracker->image_path));
        }

        $cropTracker->delete();
        return response()->json(['message' => 'Crop Tracker deleted'], 200);
    }
}