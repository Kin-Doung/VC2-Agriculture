<?php

namespace App\Http\Controllers;

use App\Http\Requests\CropTrackerRequest;
use App\Models\CropTracker;
use Illuminate\Support\Facades\Storage;

class CropTrackerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of crop trackers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cropTrackers = CropTracker::with('crop')->get();
        return response()->json($cropTrackers, 200);
    }

    /**
     * Store a newly created crop tracker.
     *
     * @param  \App\Http\Requests\CropTrackerRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CropTrackerRequest $request)
    {
        $data = $request->only(['crop_id', 'planted', 'location']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image_path'] = $imagePath; // Store relative path
        }

        $cropTracker = CropTracker::create($data);
        return response()->json($cropTracker->load('crop'), 201);
    }

    /**
     * Display the specified crop tracker.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $cropTracker = CropTracker::with('crop')->find($id);
        if (!$cropTracker) {
            return response()->json(['message' => 'Crop Tracker not found'], 404);
        }
        return response()->json($cropTracker, 200);
    }

    /**
     * Update the specified crop tracker.
     *
     * @param  \App\Http\Requests\CropTrackerRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(CropTrackerRequest $request, $id)
    {
        $cropTracker = CropTracker::find($id);
        if (!$cropTracker) {
            return response()->json(['message' => 'Crop Tracker not found'], 404);
        }

        $data = $request->only(['crop_id', 'planted', 'location']);

        if ($request->hasFile('image')) {
            if ($cropTracker->getRawOriginal('image_path')) {
                Storage::disk('public')->delete($cropTracker->getRawOriginal('image_path'));
            }
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image_path'] = $imagePath; // Store relative path
        }

        $cropTracker->update($data);
        return response()->json($cropTracker->load('crop'), 200);
    }

    /**
     * Remove the specified crop tracker.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cropTracker = CropTracker::find($id);
        if (!$cropTracker) {
            return response()->json(['message' => 'Crop Tracker not found'], 404);
        }

        if ($cropTracker->getRawOriginal('image_path')) {
            Storage::disk('public')->delete($cropTracker->getRawOriginal('image_path'));
        }

        $cropTracker->delete();
        return response()->json(['message' => 'Crop Tracker deleted'], 200);
    }
}