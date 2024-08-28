<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RoomBook;
use App\Models\Rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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
        $existingBooking = RoomBook::where('guest_id', $data['guest_id'])
                                    ->where('r_book',md5("Booking"))
                                    ->first();

        $existingBooking2 = RoomBook::where('r_id', $data['r_id'])
                                    ->where('is_active', true)
                                    ->first();
        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking || $existingBooking2) {  return response()->json(['error' => 'Booking already exists Room and Guest and already booking.']); }
        $roomBook =new RoomBook();
        $roomBook->r_id = $data['r_id'];
        $roomBook->guest_id = $data['guest_id'];
        $roomBook->r_book = $data['r_book'];
        $roomBook->booking_Date = $data['booking_Date'];
        $roomBook->cancel_Date = $data['cancel_Date'];
        $roomBook->save();
        $room = Rooms::findOrFail($roomBook->r_id);
        $room->r_book =  $data['r_book'];
        $room->save();

        return json_encode([$roomBook,$room]);
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
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
        $existingBooking = RoomBook::where('guest_id', $data['guest_id'])
            ->where('r_book',md5("Booking"))
            ->first();

        $existingBooking2 = RoomBook::where('r_id', $data['r_id'])
            ->where('is_active', true)
            ->first();

        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking || $existingBooking2) {  return response()->json(['error' => 'Booking already exists Room and Guest and already booking.']); }

        $roomBook =RoomBook::findOrFail($id);

        $roomBook->r_id = $data['r_id'];
        $roomBook->guest_id = $data['guest_id'];
        $roomBook->r_book = $data['r_book'];
        $roomBook->booking_Date = $data['booking_Date'];
        $roomBook->cancel_Date = $data['cancel_Date'];
        $roomBook->save();

        $room = Rooms::findOrFail($roomBook->r_id);
        $room->r_book =  $data['r_book'];
        $room->save();

        return json_encode([$roomBook,$room]);
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

            $room = Rooms::findOrFail($roomBook->r_id);
            $room->r_book ="Canceling";
            $room->save();

            return response()->json(['message' => 'Room Book deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the room book.'], 500);
        }
    }
}
