<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\Farm;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ✅ Register
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'farm_name' => $request->farm_name,
            'location'  => $request->location,
            'phone'     => $request->phone,
        ]);

            // Create Farm
        $farm = Farm::create([
            'name' => $request->farm_name,
            'location_at_latitude' => $request->latitude ?? 0,       
            'location_longitude'   => $request->longitude ?? 0,
            'area' => $request->area ?? null,
            'user_id' => $user->id,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'User registered successfully.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => new UserResource($user),
            'farm' => $farm,
        ], 201);
    }

    // ✅ Login
    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login credentials.'], 401);
        }

        $user = Auth::user();
        /** @var \App\Models\User $user */
        $user->is_active = true;
        $user->save();
        /** @var \App\Models\User|\Laravel\Sanctum\HasApiTokens $user */
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login successful.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => new UserResource($user),
        ]);
    }

    // ✅ Logout
    public function logout($request)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        $user->is_active = false;
        $user->save();

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
