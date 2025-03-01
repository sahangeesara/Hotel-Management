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
        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [
            'r_id' => 'required',
            'guest_id' => 'required',
            'r_book' => 'required',
            'booking_Date' => 'required',
            'cancel_Date' => 'required',
        ]);
        if ($validatedData->fails()) { return response()->json($validatedData->errors());   }
        // Check if the guest_id and r_book combination already exists
        $existingBooking = RoomBook::where(function($query) use ($data) {
            $query->where('guest_id', $data['guest_id'])
                ->where('r_book', md5("Booking"));
        })->orWhere(function($query) use ($data) {
            $query->where('r_id', $data['r_id'])
                ->where('booking_Date', $data['booking_Date'])
                ->where('is_active', true);
        })->first();


        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Booking already exists Room and Guest and already booking.']); }

        $nextId = RoomBook::max('id') + 1; // Get the next available ID
        $rNo = 'RBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'r_no'

        $today = Carbon::now()->format('Y-m-d');
        $bookingDate = Carbon::parse($data['booking_Date']);
        $cancelDate = Carbon::parse($data['cancel_Date']);
        $today = Carbon::parse($today);

        try{
            if($bookingDate  >= $today && $bookingDate <= $cancelDate ) {

                $roomBook = new RoomBook();
                $roomBook->r_id = $data['r_id'];
                $roomBook->guest_id = $data['guest_id'];
                $roomBook->r_book = $data['r_book'];
                $roomBook->booking_Date = $data['booking_Date'];
                $roomBook->cancel_Date = $data['cancel_Date'];
                $roomBook->booking_no =$rNo;
                $roomBook->save();

                return json_encode($roomBook);

            }else{
                return (response()->json(['error' => 'Date not valid.']));
            }
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room booking.'], 500);
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
        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [
            'r_id' => 'required',
            'booking_no' => '',
            'guest_id' => 'required',
            'r_book' => 'required',
            'booking_Date' => 'required|date',
            'cancel_Date' => 'required|date|after_or_equal:booking_Date',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        // Check if the guest_id and r_book combination already exists
        $existingBooking = RoomBook::where('id', '<>', $id)
            ->where(function ($query) use ($data) {
                $query->where(function ($query) use ($data) {
                    $query->where('guest_id', $data['guest_id'])
                        ->where('r_book', $data['r_book']); // Fixed comparison
                })->orWhere(function ($query) use ($data) {
                    $query->where('r_id', $data['r_id'])
                        ->where('booking_Date', $data['booking_Date'])
                        ->where('is_active', true);
                })->orWhere(function ($query) use ($data) {
                    $query->whereBetween('cancel_Date', [$data['booking_Date'], $data['cancel_Date']]) // Fixed whereBetween
                    ->where('is_active', true);
                });
            })
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'Booking already exists for this guest or room.']);
        }

        $today = Carbon::now()->format('Y-m-d');
        $bookingDate = Carbon::parse($data['booking_Date']);
        $cancelDate = Carbon::parse($data['cancel_Date']);
        $today = Carbon::parse($today);

        try {
            if ($bookingDate >= $today && $bookingDate <= $cancelDate) {
                $roomBook = RoomBook::findOrFail($id);

                $roomBook->r_id = $data['r_id'];
                $roomBook->guest_id = $data['guest_id'];
                $roomBook->r_book = $data['r_book'];
                $roomBook->booking_Date = $data['booking_Date'];
                $roomBook->cancel_Date = $data['cancel_Date'];
                $roomBook->booking_no = $data['booking_no'];

                if ($data['r_book'] === "Canceling") {
                    $roomBook->is_active = false;
                }

                $roomBook->save();

                return response()->json($roomBook);
            } else {
                return response()->json(['message' => 'Invalid booking date range.']);
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
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
