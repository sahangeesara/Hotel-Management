<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Nationality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mockery\Exception;

class NationalitiesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $nationalities = Nationality::where('is_active',1)
                ->paginate(20);

            return response()->json($nationalities);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving nationalities.'], 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);
        // Create and save the new nationality
        try{
            $nationality = Nationality::create($validatedData);
            return response()->json(['message' => 'Nationality created successfully', 'nationality' => $nationality], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding nationality.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $nationality = Nationality::findOrFail($id);
            return response()->json($nationality);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving nationality.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);
        // Update and save the new nationality
        try{
            $nationality = Nationality::findOrFail($id);
            $nationality->update($validatedData);
            return response()->json(['message' => 'Nationality update successfully', 'nationality' => $nationality], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding nationality.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $nationality = Nationality::findOrFail($id);
            $nationality->is_active =false;
            $nationality->save();

            return response()->json(['message' => 'Nationality deactivated successfully.'], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Nationality.'], 500);
        }
    }
}
