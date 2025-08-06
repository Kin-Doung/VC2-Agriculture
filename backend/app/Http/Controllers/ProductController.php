<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum'); 
    }

public function index(Request $request)
{
    $query = Product::with(['category', 'user']);

    // If ?only_mine=true, filter to only current user's products
    if ($request->query('only_mine') === 'true') {
        $query->where('user_id', Auth::id());
    }

    $products = $query->get()->map(function ($product) {
        $product->image_url = $product->image_path
            ? asset('storage/' . $product->image_path)
            : null;
        return $product;
    });

    return response()->json($products, 200);
}


    public function store(ProductRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $validated['image_path'] = $path;
        }

        $validated['user_id'] = Auth::id(); // <--- Required

        $product = Product::create($validated);
        $product->image_url = $product->image_path ? asset('storage/' . $product->image_path) : null;

        return response()->json($product, 201);
    }


    public function show($id)
    {
        $product = Product::with('category')->where('id', $id)->where('user_id', Auth::id())->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->image_url = $product->image_path ? asset('storage/' . $product->image_path) : null;

        return response()->json($product, 200);
    }

    public function update(ProductRequest $request, $id)
    {
        $product = Product::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found or unauthorized'], 404);
        }

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $validated['image_path'] = $path;
        }

        $product->update($validated);
        $product->image_url = $product->image_path ? asset('storage/' . $product->image_path) : null;

        return response()->json($product, 200);
    }

    public function destroy($id)
    {
        $product = Product::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found or unauthorized'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted'], 204);
    }
}
