<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\Farm;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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
            'role'      => $request->role ?? 'user', // Default to 'user'
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
    public function logout(Request $request)
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

    // ✅ Get User Information
    public function getUser(Request $request)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */

        $user->load([
            'farm',
            'seedScans',
            'transactions',
            'supportRequests',
            'chats',
        ]);

        return response()->json([
            'message' => 'User information retrieved successfully.',
            'user' => new UserResource($user),
        ], 200);
    }

    // ✅ Update User Information
    public function updateUser(Request $request)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => 'sometimes|string|max:20',
            'farm_name' => 'sometimes|nullable|string|max:255',
            'location' => 'sometimes|nullable|string|max:255',
            'role' => 'sometimes|string|in:admin,farmer,user',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'latitude' => 'sometimes|nullable|numeric',
            'longitude' => 'sometimes|nullable|numeric',
            'area' => 'sometimes|nullable|numeric',
        ]);

        $userData = [
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'phone' => $request->phone ?? $user->phone,
            'farm_name' => $request->farm_name ?? $user->farm_name,
            'location' => $request->location ?? $user->location,
            'role' => $request->role ?? $user->role,
        ];

        if ($request->has('password') && !empty($request->password)) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        if ($request->hasAny(['farm_name', 'latitude', 'longitude', 'area'])) {
            $farm = $user->farm()->first();
            if ($farm) {
                $farm->update([
                    'name' => $request->farm_name ?? $farm->name,
                    'location_at_latitude' => $request->latitude ?? $farm->location_at_latitude,
                    'location_longitude' => $request->longitude ?? $farm->location_longitude,
                    'area' => $request->area ?? $farm->area,
                ]);
            }
        }

        $user->load([
            'farm',
            'seedScans',
            'transactions',
            'supportRequests',
            'chats',
        ]);

        return response()->json([
            'message' => 'User information updated successfully.',
            'user' => new UserResource($user),
        ], 200);
    }

    // ✅ Update Profile Image
    public function updateProfileImage(Request $request)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */

        if ($request->has('profile_image') && $request->profile_image === null) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
                $user->update(['profile_image' => null]);
            }
            return response()->json([
                'message' => 'Profile image removed successfully.',
                'user' => new UserResource($user),
            ], 200);
        }

        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $path = $request->file('profile_image')->store('users', 'public');
            $user->update(['profile_image' => $path]);

            return response()->json([
                'message' => 'Profile image updated successfully.',
                'user' => new UserResource($user),
            ], 200);
        }

        return response()->json(['message' => 'No profile image provided.'], 400);
    }
}