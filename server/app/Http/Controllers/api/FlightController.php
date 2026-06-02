<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\flight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $flight = Flight::with('airline')
                                ->where('is_active', 1)->get();
            return response()->json($flight, 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response(['message'=>$e->getMessage()],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'airline_id' => 'required|integer',
            'from' => 'required|string|max:255',
            'to' => 'required|string|max:255',
            'departure_time' => 'required|date_format:H:i:s',
            'departure_date' => 'required|date',
            'available_seats' => 'required|integer',
            'total_seats' => 'required|integer',
        ]);

        try{
            $nextId = Flight::max('id') + 1;
            $flightNo = 'FLN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $flight =new Flight();
            $flight->airline_id = $validatedData['airline_id'];
            $flight->from = $validatedData['from'];
            $flight->to = $validatedData['to'];
            $flight->departure_time = $validatedData['departure_time'];
            $flight->departure_date = $validatedData['departure_date'];
            $flight->available_seats = $validatedData['available_seats'];
            $flight->total_seats = $validatedData['total_seats'];
            $flight->flight_no = $flightNo;

            $flight->save();

            return response()->json(['message'=>'Successfully submitted.', 'Flight'=>$flight],200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response(['message'=>'An error occurred while retrieving Flight.'],500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $flight = Flight::with('airline')
                            ->findOrFail($id);
            return response()->json($flight);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Flight.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'airline_id' => 'required|integer',
            'from' => 'required|string|max:255',
            'to' => 'required|string|max:255',
            'departure_time' => 'required|date_format:H:i:s',
            'departure_date' => 'required|date',
            'available_seats' => 'required|integer',
            'total_seats' => 'required|integer',
            'flight_no' => 'required|string|max:255',
        ]);

        try{

            $flight =Flight::findOrFail($id);
            $flight->airline_id = $validatedData['airline_id'];
            $flight->from = $validatedData['from'];
            $flight->to = $validatedData['to'];
            $flight->departure_time = $validatedData['departure_time'];
            $flight->departure_date = $validatedData['departure_date'];
            $flight->available_seats = $validatedData['available_seats'];
            $flight->total_seats = $validatedData['total_seats'];
            $flight->flight_no = $validatedData['flight_no'];

            $flight->save();

            return response()->json(['message'=>'Successfully Updated.', 'Flight'=>$flight],200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response(['message'=>'An error occurred while retrieving Flight.'],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $flight = Flight::findOrFail($id);
            $flight->is_active = false;
            $flight->save();

            return response()->json(['message' => 'flight deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the flight.'], 500);
        }
    }
}
