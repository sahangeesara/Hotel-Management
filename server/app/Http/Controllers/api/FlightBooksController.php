<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Flight_passenger_counts;
use App\Models\FlightBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlightBooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $flightBooks = FlightBook::with('flight', 'guest', 'flightClass','currency')
                ->where('is_active', 1)
                ->orderBy('created_at', "DESC")
                ->paginate(20);

            return response()->json($flightBooks);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving flight books.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'flight_id' => 'required|integer',
            'guest_id' => 'required|integer',
            'class_id' => 'required|integer',
            'currency_id' => 'required|integer',
            'to' => 'required|string|max:255',
            'from' => 'required|string|max:255',
            'departure_date' => 'required|date',
            'return_Date' => 'required|date',
            'number_of_passengers' => 'required|integer',
            'travel_route' => 'required|string|max:255',
            'requests' => 'required|string',
        ]);

        try {
            $nextId = FlightBook::max('id') + 1; // Get the next available ID
            $fNo = 'FBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'custom_no'

            $total_amount =$validatedData['adults'] + $validatedData['children'] + $validatedData['infants'];

            $flightBook = new FlightBook();
            $flightBook->guest_id =$validatedData['guest_id'];
            $flightBook->to =$validatedData['to'];
            $flightBook->from =$validatedData['from'];
            $flightBook->departure_Date =$validatedData['departure_Date'];
            $flightBook->return_Date =$validatedData['return_Date'];
            $flightBook->number_of_passengers =$total_amount;
            $flightBook->travel_route =$validatedData['travel_route'];
            $flightBook->currency_id =$validatedData['currency_id'];
            $flightBook->class_id =$validatedData['class_id'];
            $flightBook->flight_id =$validatedData['flight_id'];
            $flightBook->requests =$validatedData['requests'];
            $flightBook->booking_no= $fNo;

            $flightBook->save();

            $flightPassengerCounts = new Flight_passenger_counts();
            $flightPassengerCounts->flight_book_id = $flightBook->id;
            $flightPassengerCounts->adults = $validatedData['adults'];
            $flightPassengerCounts->children = $validatedData['children'];
            $flightPassengerCounts->infants = $validatedData['infants'];
            $flightPassengerCounts->total_amount = $total_amount;

            $flightPassengerCounts->save();

            return response()->json(['message' => 'Successfully submitted.', 'FlightBook' => $flightBook, 'flightPassengerCounts' => $flightPassengerCounts], 200);
        }catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating flight book.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $flightBook = FlightBook::with('flight', 'guest', 'flightClass','currency')
                ->findOrFail($id);
            return response()->json($flightBook);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving flight book.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'flight_id' => 'required|integer',
            'guest_id' => 'required|integer',
            'class_id' => 'required|integer',
            'currency_id' => 'required|integer',
            'to' => 'required|string|max:255',
            'from' => 'required|string|max:255',
            'departure_date' => 'required|date',
            'return_Date' => 'required|date',
            'number_of_passengers' => 'required|integer',
            'travel_route' => 'required|string|max:255',
            'requests' => 'required|string',
            'booking_no' => 'required|string|max:255'
        ]);

        try {

            $total_amount = $validatedData['adults'] + $validatedData['children'] + $validatedData['infants'];

            $flightBook = FlightBook::findOrFail($id);

            $flightBook->guest_id = $validatedData['guest_id'];
            $flightBook->to = $validatedData['to'];
            $flightBook->from = $validatedData['from'];
            $flightBook->departure_Date = $validatedData['departure_Date'];
            $flightBook->return_Date = $validatedData['return_Date'];
            $flightBook->number_of_passengers = $total_amount;
            $flightBook->travel_route = $validatedData['travel_route'];
            $flightBook->currency_id = $validatedData['currency_id'];
            $flightBook->class_id = $validatedData['class_id'];
            $flightBook->flight_id = $validatedData['flight_id'];
            $flightBook->requests = $validatedData['requests'];
            $flightBook->booking_no = $validatedData['booking_no'];

            $flightBook->save();

            $flightPassengerCounts = Flight_passenger_counts::where('flight_book_id', $id)->first();

            if (!$flightPassengerCounts) {
                $flightPassengerCounts = new Flight_passenger_counts();
                $flightPassengerCounts->flight_book_id = $flightBook->id;
            }

            $flightPassengerCounts->adults = $validatedData['adults'];
            $flightPassengerCounts->children = $validatedData['children'];
            $flightPassengerCounts->infants = $validatedData['infants'];
            $flightPassengerCounts->total_amount = $total_amount;

            $flightPassengerCounts->save();

            return response()->json([
                'message' => 'Successfully updated.',
                'FlightBook' => $flightBook,
                'flightPassengerCounts' => $flightPassengerCounts
            ], 200);

        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while updating flight book.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $flightBook = FlightBook::findOrFail($id);
            $flightBook->is_active = false;
            $flightBook->save();
            return response()->json(['message' => 'Flight Book deactivated successfully.'], 200);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the flight book.'], 500);
        }
    }
}
