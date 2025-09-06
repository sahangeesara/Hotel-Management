<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\EventBooking;
use App\Models\RoomBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EventBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $eventBook = EventBooking::with('event','room','guest','customer')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->get();

            return response()->json($eventBook);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Event.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request data directly
        $validatedData = $request->validate([
            'event_id' => 'required|integer',
            'customer_id' => 'required|integer',
            'guest_id' => 'required|integer',
            'r_id' => 'required|integer',
            'booking_Date' => 'required|date',
            'cancel_Date' => 'required|date|after_or_equal:booking_Date',
        ]);

        $existingBooking = RoomBook::where(function ($query) use ($validatedData) {
            $query->where('guest_id', $validatedData['guest_id'])
                ->where('r_book', md5("Booking"));
        })->orWhere(function ($query) use ($validatedData) {
            $query->where('r_id', $validatedData['r_id'])
                ->where('booking_Date', $validatedData['booking_Date'])
                ->where('is_active', true);
        })->first();

        if ($existingBooking) {
            return response()->json(['error' => 'Booking already exists for this room and guest.'], 409);
        }


        try {
            // Generate 'emp_no' based on the next auto-incremented 'id'
            $nextId = EventBooking::max('id') + 1;
            $eventBookNo = 'EBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            // Create and save the new employee
            $eventBook = EventBooking::create([
                'event_id' => $validatedData['event_id'],
                'r_id' => $validatedData['r_id'],
                'customer_id' => $validatedData['customer_id'],
                'guest_id' => $validatedData['guest_id'],
                'booking_Date' => $validatedData['booking_Date'],
                'cancel_Date' => $validatedData['cancel_Date'],
                'event_booking_no' => $eventBookNo,
            ]);

            $nextId = RoomBook::max('id') + 1;
            $rNo = 'RBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $roomBook = RoomBook::create([
                'r_id' => $validatedData['r_id'],
                'guest_id' => !empty($validatedData['guest_id'])
                    ? $validatedData['guest_id']
                    : $validatedData['customer_id'],
                'r_book' => $validatedData['r_book'],
                'booking_Date' => $validatedData['booking_Date'],
                'cancel_Date' => $validatedData['cancel_Date'],
                'booking_no' => $rNo,
            ]);
            return response()->json(['message' => 'Event Book created successfully', 'employee' =>  $eventBook], 201);
        } catch (\Exception $e) {
            Log::error('Employee creation error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the employee.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $employees = EventBooking::with('event','room','guest','customer')
                ->findOrFail($id);
            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving event book.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate request data directly
        $validatedData = $request->validate([
            'event_id' => 'required|integer',
            'customer_id' => 'required|integer',
            'guest_id' => 'required|integer',
            'r_id' => 'required|integer',
            'booking_Date' => 'required|date',
            'cancel_Date' => 'required|date|after_or_equal:booking_Date',
            'event_booking_no' => 'required',
        ]);

        try {
            $eventBook = EventBooking::findOrFail($id);
            // Update Event Book details
            $eventBook->update($validatedData);

            return response()->json(['message' => 'Event Book created successfully', 'employee' =>  $eventBook], 201);
        } catch (\Exception $e) {
            Log::error('Employee creation error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the employee.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        try {
            $eventBook = EventBooking::findOrFail($id);
            $eventBook->is_active = false;
            $eventBook->save();

            return response()->json(['message' => 'Employee deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the employee.'], 500);
        }
    }
}
