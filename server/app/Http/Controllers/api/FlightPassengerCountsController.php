<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Flight_passenger_counts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlightPassengerCountsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $flightPassengerCounts = Flight_passenger_counts::with('flightBook')
                                                                ->where('is_active', 1)
                                                                ->paginate(20);

            return response()->json($flightPassengerCounts,200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Flight Passenger Counts.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'flight_book_id' => 'required|integer',
            'adults' => 'required|integer',
            'children' => 'required|integer',
            'infants' => 'required|integer',
            'total_amount' => 'required|integer'
        ]);

        try{
            $flightpassengercounts =Flight_passenger_counts::create($validatedData);
            return response()->json(['message' => 'Flight Passenger Counts created successfully', 'flightpassengercounts' => $flightpassengercounts], 201);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Flight Passenger Counts.'], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $flightPassengerCounts = Flight_passenger_counts::with('flightBook')->findOrFail($id);
            return response()->json($flightPassengerCounts,200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Flight Passenger Counts.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'flight_book_id' => 'required|integer',
            'adults' => 'required|integer',
            'children' => 'required|integer',
            'infants' => 'required|integer',
            'total_amount' => 'required|integer'
        ]);

        try{
            $flightpassengercounts = Flight_passenger_counts::findOrFail($id);
            $flightpassengercounts->updated($validatedData);
            return response()->json(['message' => 'Flight Passenger Counts created successfully', 'flightpassengercounts' => $flightpassengercounts], 201);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Flight Passenger Counts.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $flightPassengerCounts = Flight_passenger_counts::findOrFail($id);
            $flightPassengerCounts->is_active = false;
            $flightPassengerCounts->save();
            return response()->json(['message' => 'Flight Passenger Counts deactivated successfully.'], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating Flight Passenger Counts.'], 500);
        }
    }
}
