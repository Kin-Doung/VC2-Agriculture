<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
<<<<<<< HEAD
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
=======
use App\Http\Controllers\LandController;
use App\Http\Controllers\Api\AuthController;
>>>>>>> 4029f82 (feature backend land: create update show and delete databasce)

Route::apiResource('lands', LandController::class);

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
<<<<<<< HEAD

// Register
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Category Routes
Route::apiResource('categories', CategoryController::class);

// Product 
Route::apiResource("products", ProductController::class);
=======
>>>>>>> 4029f82 (feature backend land: create update show and delete databasce)
