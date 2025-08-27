<?php

use App\Http\Controllers\adminController\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\CropTrackerController;
use App\Http\Controllers\CropTypeController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TaskController;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Admin Routes (Require auth & admin middleware)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::get('/admin/users/{id}', [AdminController::class, 'show']);
    Route::put('/admin/users/{id}', [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Authenticated category CRUD
    Route::apiResource('categories', CategoryController::class);

    // Authenticated product CRUD
    Route::apiResource("products", ProductController::class);

    // Crop routes
    Route::get('/crops', [CropController::class, 'index']);
    Route::post('/crops', [CropController::class, 'store']);
    Route::get('/crops/{id}', [CropController::class, 'show']);
    Route::put('/crops/{id}', [CropController::class, 'update']);
    Route::delete('/crops/{id}', [CropController::class, 'destroy']);

    // Land routes
    Route::get('/lands', [LandController::class, 'index']);
    Route::post('/lands', [LandController::class, 'store']);
    Route::get('/lands/{id}', [LandController::class, 'show']);
    Route::put('/lands/{id}', [LandController::class, 'update']);
    Route::delete('/lands/{id}', [LandController::class, 'destroy']);


    // Croptrackers
    Route::apiResource('croptrackers', CropTrackerController::class);
    /*
    |--------------------------------------------------------------------------
    | Logout Routes
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::apiResource("tasks", TaskController::class);
Route::apiResource("crops", CropController::class);
// Route::apiResource("croptypes", CropTypeController::class);
Route::apiResource("farms", FarmController::class);
// Route::apiResource('croptrackers', CropTrackerController::class);
