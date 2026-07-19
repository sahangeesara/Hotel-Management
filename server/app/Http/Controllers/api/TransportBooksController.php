<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\TransportBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransportBooksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $transportBooks = TransportBook::with('serviceType', 'tourType', 'vehicleType','duration','guest','province')
                ->where('is_active', 1)
                ->orderBy('created_at', "DESC")
                ->paginate(20);

            return response()->json($transportBooks);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving transport books.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'service_type_id' => 'required|integer',
            'tour_type_id' => 'required|integer',
            'vehicle_type_id' => 'required|integer',
            'duration_id' => 'required|integer',
            'guest_id' => 'required|integer',
            'province_id' => 'required|integer',
            'passengers' => 'required|integer',
            'pickup_location' => 'required|string|max:255',
            'drop_location' => 'required|string|max:255',
            'pickup_date' => 'required|date',
            'pickup_time' => 'required|date_format:H:i:s',
            'requests' => 'required|string',
            'custom_duration' => 'nullable|string|max:255',
        ]);
        $existingBooking = TransportBook::where('vehicle_type_id', $validatedData['vehicle_type_id'])
            ->where('pickup_date', $validatedData['pickup_date'])
            ->where('pickup_time', $validatedData['pickup_time'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json([
                'error' => 'This vehicle is already booked for the selected date and time.'
            ], 409);
        }

        try{
            $nextId = TransportBook::max('id') + 1; // Get the next available ID
            $cNo = 'TBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'custom_no'

            $transportBook = new TransportBook();
            $transportBook->booking_no = $cNo;
            $transportBook->guest_id = $validatedData['guest_id'];
            $transportBook->province_id = $validatedData['province_id'];
            $transportBook->passengers = $validatedData['passengers'];
            $transportBook->service_type_id = $validatedData['service_type_id'];
            $transportBook->vehicle_type_id = $validatedData['vehicle_type_id'];
            $transportBook->tour_type_id = $validatedData['tour_type_id'];
            $transportBook->pickup_location = $validatedData['pickup_location'];
            $transportBook->drop_location = $validatedData['drop_location'];
            $transportBook->pickup_date = $validatedData['pickup_date'];
            $transportBook->pickup_time = $validatedData['pickup_time'];
            $transportBook->duration_id = $validatedData['duration_id'];
            $transportBook->custom_duration = $validatedData['custom_duration'];
            $transportBook->requests = $validatedData['requests'];

            $transportBook->save();

            return response()->json(['message' => 'Successfully submitted.', 'TransportBook' => $transportBook]);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Transport Book.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $transportBook =  TransportBook::with('serviceType', 'tourType', 'vehicleType','duration','guest','province')
                ->findOrFail($id);
            return response()->json($transportBook);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Transport Book.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'service_type_id' => 'required|integer',
            'tour_type_id' => 'required|integer',
            'vehicle_type_id' => 'required|integer',
            'duration_id' => 'required|integer',
            'guest_id' => 'required|integer',
            'province_id' => 'required|integer',
            'passengers' => 'required|integer',
            'pickup_location' => 'required|string|max:255',
            'drop_location' => 'required|string|max:255',
            'pickup_date' => 'required|date',
            'pickup_time' => 'required|date_format:H:i:s',
            'requests' => 'required|string',
            'custom_duration' => 'nullable|string|max:255',
            'booking_no' => 'required|string|max:255'
        ]);

        $existingBooking = TransportBook::where('id', '<>', $id)
            ->where('vehicle_type_id', $validatedData['vehicle_type_id'])
            ->where('pickup_date', $validatedData['pickup_date'])
            ->where('pickup_time', $validatedData['pickup_time'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json([
                'error' => 'This vehicle is already booked for the selected date and time.'
            ], 409);
        }

        try{

            $transportBook =  TransportBook::findOrFail($id);
            $transportBook->booking_no = $validatedData['booking_no'];
            $transportBook->guest_id = $validatedData['guest_id'];
            $transportBook->province_id = $validatedData['province_id'];
            $transportBook->passengers = $validatedData['passengers'];
            $transportBook->service_type_id = $validatedData['service_type_id'];
            $transportBook->vehicle_type_id = $validatedData['vehicle_type_id'];
            $transportBook->tour_type_id = $validatedData['tour_type_id'];
            $transportBook->pickup_location = $validatedData['pickup_location'];
            $transportBook->drop_location = $validatedData['drop_location'];
            $transportBook->pickup_date = $validatedData['pickup_date'];
            $transportBook->pickup_time = $validatedData['pickup_time'];
            $transportBook->duration_id = $validatedData['duration_id'];
            $transportBook->custom_duration = $validatedData['custom_duration'];
            $transportBook->requests = $validatedData['requests'];

            $transportBook->save();

            return response()->json(['message' => 'Successfully update.', 'TransportBook' => $transportBook]);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Transport Book.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $transportBook = TransportBook::findOrFail($id);
            $transportBook->is_active = false;
            $transportBook->save();

            return response()->json(['message' => 'Transport Book deactivated successfully.']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating Transport Book.'], 500);
        }
    }
}
