<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RoomBook;
use App\Models\Rooms;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class RoomBookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $roomBooks = RoomBook::with(['room', 'guest'])
                ->where('is_active', 1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);

            return response()->json($roomBooks);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request data directly
        $validatedData = $request->validate([
            'r_id' => 'required',
            'guest_id' => 'required',
            'r_book' => 'required',
            'booking_Date' => 'required|date',
            'cancel_Date' => 'required|date|after_or_equal:booking_Date',
        ]);

        // Check if the booking already exists
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
            $nextId = RoomBook::max('id') + 1;
            $rNo = 'RBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $roomBook = RoomBook::create([
                'r_id' => $validatedData['r_id'],
                'guest_id' => $validatedData['guest_id'],
                'r_book' => $validatedData['r_book'],
                'booking_Date' => $validatedData['booking_Date'],
                'cancel_Date' => $validatedData['cancel_Date'],
                'booking_no' => $rNo,
            ]);

            return response()->json(['message' => 'Room booked successfully', 'roomBook' => $roomBook], 201);
        } catch (\Exception $e) {
            Log::error('Room booking error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while booking the room.'], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $roomBook = RoomBook::with(['room', 'guest'])
                                 ->findOrFail($id);
            return response()->json($roomBook);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }
    public function searchByDate(String $rDate){

        try {
            $roomBook = RoomBook::with(['room', 'guest'])
                ->where('booking_Date', $rDate)
                ->where('is_active', true)
                ->get();

            return response()->json($roomBook);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }

    public function searchByDateAndRoom(String $r_id,String $rDate){

        try {
            $roomBook = RoomBook::with(['room', 'guest'])
                ->where('booking_Date', $rDate)
                ->where('r_id', $r_id)
                ->where('is_active', true)
                ->get();

            return response()->json($roomBook);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }
    public function searchByRoom(String $r_id){
        try {
            $roomBook = RoomBook::with(['room', 'guest'])
                ->where('r_id', $r_id)
                ->where('is_active', true)
                ->get();

            return response()->json($roomBook);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate request data
        $validatedData = $request->validate([
            'r_id' => 'required',
            'booking_no' => 'nullable|string',
            'guest_id' => 'required',
            'r_book' => 'required',
            'booking_Date' => 'required|date',
            'cancel_Date' => 'required|date|after_or_equal:booking_Date',
        ]);

        // Check if a conflicting booking exists
        $existingBooking = RoomBook::where('id', '<>', $id)
            ->where(function ($query) use ($validatedData) {
                $query->where(function ($query) use ($validatedData) {
                    $query->where('guest_id', $validatedData['guest_id'])
                        ->where('r_id','<>', $validatedData['r_id'])
                        ->where('r_book', $validatedData['r_book']);
                })->orWhere(function ($query) use ($validatedData) {
                    $query->where('r_id', $validatedData['r_id'])
                        ->where('booking_Date', $validatedData['booking_Date'])
                        ->where('is_active', true);
                })->orWhere(function ($query) use ($validatedData) {
                    $query->whereBetween('cancel_Date', [$validatedData['booking_Date'], $validatedData['cancel_Date']])
                        ->where('is_active', true);
                });
            })->first();

        if ($existingBooking) {
            Log::info('Conflicting Booking Found:', [
                'existingBooking' => $existingBooking,
                'newData' => $validatedData
            ]);
            return response()->json(['error' => 'Booking already exists for this guest or room.'], 409);
        }


        try {
            $roomBook = RoomBook::findOrFail($id);
            $roomBook->update([
                'r_id' => $validatedData['r_id'],
                'guest_id' => $validatedData['guest_id'],
                'r_book' => $validatedData['r_book'],
                'booking_Date' => $validatedData['booking_Date'],
                'cancel_Date' => $validatedData['cancel_Date'],
                'booking_no' => $validatedData['booking_no'],
                'is_active' => $validatedData['r_book'] === "Canceling" ? false : $roomBook->is_active,
            ]);

            return response()->json(['message' => 'Booking updated successfully', 'roomBook' => $roomBook], 200);
        } catch (\Exception $e) {
            Log::error('Room booking update error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating room booking.'], 500);
        }
    }


    public function countRoomBooking(){
        $roomBookingCount = RoomBook::where('is_active', 1)
                                ->count();

        return response()->json(['roomBookingCount' =>$roomBookingCount]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomBook = RoomBook::findOrFail($id);
            $roomBook->is_active = false;
            $roomBook->r_book = "Canceling";
            $roomBook->save();


            return response()->json(['message' => 'Room Book deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the room book.'], 500);
        }
    }

    public function scheduleBookingCancellation(Schedule $schedule): void
    {
        $schedule->call(function () {
            $today = Carbon::now()->format('Y-m-d');

            $bookingsToCancel = RoomBook::where('cancel_Date', '<', $today)
                ->where('is_active', true)
                ->get();

            foreach ($bookingsToCancel as $booking) {
                $booking->r_book = 'Canceling';
                $booking->is_active = false;
                $booking->save();
            }
        })->daily();
    }


}
