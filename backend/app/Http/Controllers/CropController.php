<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Http\Requests\CropRequest;

class CropController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $crops = Crop::where('user_id', auth()->id())->get();
        return response()->json($crops);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CropRequest $request)
    {
        $crop = Crop::create($request->validated() + ['user_id' => auth()->id()]);
        return response()->json($crop, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $crop = Crop::where('id', $id)
            ->where('user_id', auth()->id())
            ->with(['farm', 'products'])
            ->firstOrFail();

        return response()->json($crop);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CropRequest $request, string $id)
    {
        $crop = Crop::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $crop->update($request->validated());
        return response()->json($crop);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $crop = Crop::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $crop->delete();
        return response()->json(['message' => 'Crop deleted']);
    }
}
