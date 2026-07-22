<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookingRooms;
use App\Models\RoomBook;
use App\Models\Rooms;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

            $roomBooks = RoomBook::with([
                'guest',
                'package',
                'BookingRooms.roomCategory'
            ])
                ->where('is_active', true)
                ->orderBy('created_at', 'DESC')
                ->paginate(20);

            return response()->json($roomBooks);

        } catch (\Exception $e) {

            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while retrieving room bookings.'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * @throws \Throwable
     */
    public function store(Request $request)
    {

        $data = json_decode($request->form, true);
        $data2 = json_decode($request->room, true);

        $bookingRoom='';
        // Validate request data directly
        $validatedData = Validator::make($data, [
            'guest_id' => 'required',
            'package_id' => 'required',
            'max_guests' => 'required',
            'number_of_room' => 'required',
            'r_book' => 'required',
            'booking_Date' => 'required|date',
            'cancel_Date' => 'required|date|after_or_equal:booking_Date',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        // Check if the booking already exists
        $existingBooking = RoomBook::where(function ($query) use ($data) {
            $query->where('guest_id', $data['guest_id'])
                ->where('r_book', md5("Booking"));
        })->orWhere(function ($query) use ($data) {
            $query->where('booking_Date', $data['booking_Date'])
                ->where('is_active', true);
        })->first();

        if ($existingBooking) {
            return response()->json(['error' => 'Booking already exists for this room and guest.'], 409);
        }
        DB::beginTransaction();

        try {
            $nextId = RoomBook::max('id') + 1;
            $rNo = 'RBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $roomBook = RoomBook::create([
                'guest_id' => $data['guest_id'],
                'r_book' => $data['r_book'],
                'number_of_room' => $data['number_of_room'],
                'max_guests' => $data['max_guests'],
                'package_id' => $data['package_id'],
                'booking_Date' => $data['booking_Date'],
                'cancel_Date' => $data['cancel_Date'],
                'booking_no' => $rNo,
            ]);

            foreach ($data2 as $item) {
                $requestedRooms = $item['no_of_rooms'];

                $rooms = Rooms::where('r_category_id', $item['room_category_id'])
                    ->where('status', 'available')
                    ->take($requestedRooms)
                    ->get();

                if ($rooms->count() < $requestedRooms) {
                    return response()->json([
                        'message' => 'Not enough rooms available.'
                    ], 400);
                }

                $bookingRooms = [];

                foreach ($rooms as $room) {

                    $bookingRooms[] = $room->r_no;
                    $room->status = 'Booked';
                    $room->save();
                }


                $bookingRoom= BookingRooms::create([
                    'room_category_id' => $item['room_category_id'],
                    'no_of_rooms'      => $requestedRooms,
                    'r_no'             => json_encode($bookingRooms),
                    'booking_id'       => $roomBook->id,
                    'total_amount'     => $data['number_of_room'],
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'Room booked successfully', ['roomBook' => $roomBook,'bookingRoom' =>$bookingRoom]], 201);
        } catch (\Exception $e) {
            DB::rollback();
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
            $roomBook = RoomBook::with('guest')
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
     * @throws \Throwable
     */
    public function update(Request $request, string $id)
    {
        $data = json_decode($request->form, true);
        $roomsData = json_decode($request->room, true);

        $validator = Validator::make($data, [
            'guest_id'        => 'required',
            'package_id'      => 'required',
            'max_guests'      => 'required|integer',
            'number_of_room'  => 'required|integer',
            'r_book'          => 'required',
            'booking_Date'    => 'required|date',
            'cancel_Date'     => 'required|date|after_or_equal:booking_Date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();

        try {

            $roomBook = RoomBook::findOrFail($id);

            $oldBookingRooms = BookingRooms::where('booking_id', $roomBook->id)->get();

            foreach ($oldBookingRooms as $bookingRoom) {

                foreach ($bookingRoom->r_no as $roomNo) {

                    Rooms::where('r_no', $roomNo)->update([
                        'status' => 'Available'
                    ]);
                }
            }


            BookingRooms::where('booking_id', $roomBook->id)->delete();


            $roomBook->update([
                'guest_id'        => $data['guest_id'],
                'r_book'          => $data['r_book'],
                'number_of_room'  => $data['number_of_room'],
                'max_guests'      => $data['max_guests'],
                'package_id'      => $data['package_id'],
                'booking_Date'    => $data['booking_Date'],
                'cancel_Date'     => $data['cancel_Date'],
                'is_active'       => $data['r_book'] == 'Canceling' ? false : $roomBook->is_active,
            ]);

            foreach ($roomsData as $item) {

                $requestedRooms = $item['no_of_rooms'];

                $availableRooms = Rooms::where('r_category_id', $item['room_category_id'])
                    ->where('status', 'Available')
                    ->take($requestedRooms)
                    ->get();

                if ($availableRooms->count() < $requestedRooms) {

                    DB::rollBack();

                    return response()->json([
                        'message' => 'Not enough available rooms for selected category.'
                    ], 400);
                }

                $assignedRooms = [];

                foreach ($availableRooms as $room) {

                    $assignedRooms[] = $room->r_no;

                    $room->status = 'Booked';
                    $room->save();
                }

                BookingRooms::create([
                    'room_category_id' => $item['room_category_id'],
                    'booking_id'       => $roomBook->id,
                    'no_of_rooms'      => $requestedRooms,
                    'r_no'             => json_encode($assignedRooms),
                    'total_amount'     => $item['total_amount'] ?? 0,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Room booking updated successfully.',
                'roomBook' => $roomBook
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while updating the booking.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function countRoomBooking(){
        $roomBookingCount = RoomBook::where('is_active', 1)
                                ->count();

        return response()->json(['roomBookingCount' =>$roomBookingCount]);
    }

    /**
     * Remove the specified resource from storage.
     * @throws \Throwable
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {

            $roomBook = RoomBook::findOrFail($id);

            // Get all booked rooms for this booking
            $bookingRooms = BookingRooms::where('booking_id', $roomBook->id)->get();

            foreach ($bookingRooms as $bookingRoom) {

                foreach ($bookingRoom->r_no as $roomNo) {

                    Rooms::where('r_no', $roomNo)->update([
                        'status' => 'Available'
                    ]);
                }
            }

            // Cancel booking
            $roomBook->update([
                'is_active' => false,
                'r_book' => 'Canceling',
            ]);

            // Optional: deactivate booking room records
            BookingRooms::where('booking_id', $roomBook->id)
                ->update([
                    'is_active' => false,
                ]);

            DB::commit();

            return response()->json([
                'message' => 'Room booking cancelled successfully.'
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while cancelling the booking.'
            ], 500);
        }
    }
}
