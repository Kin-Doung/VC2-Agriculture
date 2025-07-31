<?php

namespace App\Http\Controllers\adminController;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        // $users = User::all();
        // return response()->json($users);
       $users = User::select('id', 'name', 'email', 'phone', 'farm_name', 'location', 'created_at', 'role')->get();
        return response()->json($users);
    }
}
