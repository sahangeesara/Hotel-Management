<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Duration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $duration = Duration::where('is_active',1)
                ->paginate(20);

            return response()->json($duration);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving duration.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'duration' => 'required|max:255',
        ]);
        // Create and save the new nationality
        try{
            $duration = Duration::create($validatedData);
            return response()->json(['message' => 'Duration created successfully', 'duration' => $duration], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding duration.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $duration = Duration::findOrFail($id);
            return response()->json($duration);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving duration.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'duration' => 'required|max:255',
        ]);
        // Create and save the new duration
        try{
            $duration = Duration::findOrFail($id);
            $duration->update($validatedData);
            return response()->json(['message' => 'duration created successfully', 'duration' => $duration], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding duration.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $duration = Duration::findOrFail($id);
            $duration->is_active =false;
            $duration->save();
            return response()->json(['message' => 'duration deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the duration.'], 500);
        }
    }
}
