<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Http\Requests\FarmRequest;

class FarmController extends Controller
{
    public function index()
    {
        return response()->json(Farm::with('user')->get());
    }

    public function store(FarmRequest $request)
    {
        $farm = Farm::create($request->validated());
        return response()->json($farm, 201);
    }

    public function show(string $id)
    {
        return response()->json(Farm::with('user')->findOrFail($id));
    }

    public function update(FarmRequest $request, string $id)
    {
        $farm = Farm::findOrFail($id);
        $farm->update($request->validated());
        return response()->json($farm);
    }

    public function destroy(string $id)
    {
        $farm = Farm::findOrFail($id);
        $farm->delete();
        return response()->json(['message' => 'Farm deleted']);
    }
}
