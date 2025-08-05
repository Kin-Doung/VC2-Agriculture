<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     //
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //     ]); 
    //     $category = Category::create($validatedData);
    //     return response()->json($category, 201);
    // }

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    $user = auth()->user();

    if (!$user) {
        Log::error('User is null. Authentication failed.');
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    Log::info('Authenticated user:', ['id' => $user->id, 'email' => $user->email]);

    $category = new Category();
    $category->name = $request->name;
    $category->description = $request->description;
    $category->user_id = $user->id;
    $category->save();

    return response()->json($category, 201);
}

   
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $category = Category::findOrFail($id);
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $category->update($validatedData);
        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(null, 204);
    }
}
