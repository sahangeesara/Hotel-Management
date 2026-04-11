<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\FlightClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlightClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $flightClass = FlightClass::where('is_active',1)
                ->paginate(20);

            return response()->json($flightClass);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving flightClass.'], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'class_name' => 'required|max:255',
        ]);
        // Create and save the new nationality
        try{
            $flightClass = FlightClass::create($validatedData);
            return response()->json(['message' => 'Flight Class created successfully', 'flightClass' => $flightClass], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding flightClass.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $flightClass = FlightClass::findOrFail($id);
            return response()->json($flightClass);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving flightClass.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'class_name' => 'required|max:255',
        ]);
        // Create and save the new flightClass
        try{
            $flightClass = FlightClass::findOrFail($id);
            $flightClass->update($validatedData);
            return response()->json(['message' => 'Flight Class created successfully', 'flightClass' => $flightClass], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding flightClass.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $flightClass = FlightClass::findOrFail($id);
            $flightClass->is_active =false;
            $flightClass->save();
            return response()->json(['message' => 'Flight Class deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the flight class.'], 500);
        }
    }
}
