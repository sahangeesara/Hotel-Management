<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Airlines;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AirlinesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $airline = Airlines::where('is_active', 1)
                ->get();
            return response()->json($airline);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving airline.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'airline_name' => 'required|max:255',
        ]);

        try{
            $nextId = Airlines::max('id') + 1;
            $airlineNo = 'AN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $airline =new Airlines();
            $airline->airline_name = $validatedData['airline_name'];
            $airline->airline_code = $airlineNo;
            $airline->save();

            return response()->json(['message'=>'Successfully submitted.', 'airline'=>$airline],200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving airline.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $airline = Airlines::findOrFail($id);
            return response()->json($airline);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving airline.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'airline_code' => 'required|max:255',
            'airline_name' => 'required|max:255',
        ]);

        try{

            $airline =Airlines::findOrFail($id);
            $airline->airline_name = $validatedData['airline_name'];
            $airline->airline_code = $validatedData['airline_code'];
            $airline->save();

            return response()->json(['message'=>'Successfully submitted.', 'airline'=>$airline],200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving airline.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $airline = Airlines::findOrFail($id);
            $airline->is_active = false;
            $airline->save();

            return response()->json(['message' => 'Airline deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the airline.'], 500);
        }
    }
}
