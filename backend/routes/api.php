<?php

use App\Http\Controllers\adminController\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\CropTypeController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TaskController;

Route::apiResource('lands', LandController::class);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::get('/admin/users/{id}', [AdminController::class, 'show']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
});

// Route User sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Category routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);

    // Product routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});


Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Category Routes
Route::apiResource('categories', CategoryController::class);

// Product 
Route::apiResource("products", ProductController::class);

Route::apiResource("task", TaskController::class);
Route::apiResource("crops", CropController::class);
// Route::apiResource("croptypes", CropTypeController::class);
Route::apiResource("farms", FarmController::class);
