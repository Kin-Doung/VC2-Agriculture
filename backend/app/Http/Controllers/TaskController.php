<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer',
            'crop_id' => 'nullable|integer',
            'task_type' => 'nullable|string',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'is_completed' => 'nullable|boolean',
        ]);

        $task = Task::create($validatedData);
        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);
            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Task not found.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);

            $validatedData = $request->validate([
                'user_id' => 'required|integer',
                'crop_id' => 'nullable|integer',
                'task_type' => 'nullable|string',
                'description' => 'nullable|string',
                'due_date' => 'nullable|date',
                'is_completed' => 'nullable|boolean',
            ]);

            $task->update($validatedData);
            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Task not found or update failed.'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);
            $task->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Task not found or deletion failed.'], 404);
        }
    }
}
