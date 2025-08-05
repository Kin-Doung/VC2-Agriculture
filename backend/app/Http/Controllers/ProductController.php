<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class ProductController extends Controller
{
public function index()
{
    $products = Product::with('category', "user")->get()->map(function ($product) {
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
        $product = Product::create($validated);
        $product->image_url = $product->image_path ? asset('storage/' . $product->image_path) : null;

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->image_url = $product->image_path
            ? asset('storage/' . $product->image_path)
            : null;

        return response()->json($product, 200);
    }

    public function update(ProductRequest $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $validated['image_path'] = $path;
        }

        $product->update($validated);

        $product->image_url = $product->image_path
            ? asset('storage/' . $product->image_path)
            : null;

        return response()->json($product, 200);
    }


    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted'], 204);
    }
}
