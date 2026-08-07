<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookingRooms;
use App\Models\Currency;
use App\Models\Package;
use App\Models\RoomBook;
use App\Models\Rooms;
use App\Models\TransportBook;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\RoomBookExport;
use Maatwebsite\Excel\Facades\Excel;

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
            info(print_r($data, true));
        $data2 = json_decode($request->room, true);

        $bookingRoom='';
        // Validate request data directly
        $validatedData = Validator::make($data, [
            'guest_id' => 'required',
            'package_id' => 'required',
            'hotel_id' => 'required',
            'max_guests' => 'required',
            'number_of_room' => 'required',
            'additional_services' => '',
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

        $currency_name = "LKR";

        $currency_id = Currency::where('currency', $currency_name)->value('id');

        DB::beginTransaction();

        try {
            $nextId = RoomBook::max('id') + 1;
            $rNo = 'RBN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);



            $roomBook = RoomBook::create([
                'guest_id' => $data['guest_id'],
                'hotel_id' => $data['hotel_id'],
                'r_book' => $data['r_book'],
                'number_of_room' => $data['number_of_room'],
                'max_guests' => $data['max_guests'],
                'package_id' => $data['package_id'],
                'booking_Date' => $data['booking_Date'],
                'currencies_id' => $currency_id ?? null,
                'cancel_Date' => $data['cancel_Date'],
                'booking_no' => $rNo,
                'additional_services' => $data['additional_services'],
            ]);

            foreach ($data2 as $item) {
                $requestedRooms = $item['no_of_rooms'];

                $rooms = Rooms::where('r_category_id', $item['room_category_id'])
                    ->where('hotel_id',$data['hotel_id'])
                    ->where('status', 'available')
                    ->take($requestedRooms)
                    ->get();

                if ($rooms->count() < $requestedRooms) {
                    return response()->json([
                        'message' => 'Not enough rooms available.'
                    ], 400);
                }

                $bookingRooms = [];
                $totalAmount=0;
                $request_price = 0;

                foreach ($rooms as $room) {

                    $roomDetails = Rooms::findOrFail($room->id);
                    $package = Package::findOrFail($data['package_id']);

                    $package_amount = $package->package_amount ?? 0;

                    $totalAmount += ($roomDetails->r_cost ?? 0) + $package_amount;

                    $bookingRooms[] = $room->r_no;
                    $room->status = 'Booked';
                    $room->save();
                }

                $transportBooking = TransportBook::where('guest_id', $data['guest_id'])->first();
                $booking_amount = $transportBooking->total_amount ?? 0;


                if(!empty($data['additional_services'])){
                    $request_price = 6000;
                }
                $totalAmount = $totalAmount + $request_price + $booking_amount;
                $roomBook = RoomBook::where('booking_no', $rNo)->first();
                $roomBook->update([
                    'total_amount' => $totalAmount,
                ]);


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

    public function downloadPDF()
    {

        $roomsBooks = RoomBook::with([
            'guest',
            'bookingRooms.roomCategory'
        ])
            ->where('is_active',1)
            ->get();


        $pdf = Pdf::loadView(
            'reports.room_book_pdf',
            compact('roomsBooks')
        );


        return $pdf->download('room-book-report.pdf');

    }

    public function downloadExcel()
    {

        return Excel::download(
            new RoomBookExport,
            'room-book-report.xlsx'
        );

    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $roomBook = RoomBook::with([
                'guest',
                'package',
                'BookingRooms.roomCategory'
            ])->findOrFail($id);

            return response()->json($roomBook);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }

    public function searchRoomBook(Request $request)
    {
        try {
            $roomBook = RoomBook::with([
                'guest',
                'package',
                'BookingRooms.roomCategory'
            ])
                ->where('is_active', true)

                ->when($request->filled('guest_id'), function ($query) use ($request) {
                    $query->where('guest_id',  $request->guest_id);
                })
                ->when($request->filled('package_id'), function ($query) use ($request) {
                    $query->where('package_id',  $request->package_id);
                })

                ->when($request->filled('booking_Date'), function ($query) use ($request) {
                    $query->where('booking_Date',  $request->booking_Date);
                })

                ->get();

            return response()->json($roomBook);

        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while retrieving room Book.'
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     * @throws \Throwable
     */

    public function update(Request $request, string $id)
    {

        $bookingAmount='';

        $data = json_decode($request->input('form'), true);
        info(print_r($data, true));
        $roomsData = json_decode($request->input('room'), true);

        if (!is_array($data)) {
            return response()->json([
                'message' => 'Invalid or missing form data.',
                'received_form' => $request->input('form'),
            ], 422);
        }

        if (!is_array($roomsData)) {
            return response()->json([
                'message' => 'Invalid or missing room data.',
                'received_room' => $request->input('room'),
            ], 422);
        }

        $validator = Validator::make($data, [
            'guest_id'           => 'required',
            'package_id'         => 'required',
            'hotel_id'         => 'required',
            'max_guests'         => 'required|integer',
            'number_of_room'     => 'required|integer',
            'r_book'             => 'required',
            'booking_Date'       => 'required|date',
            'cancel_Date'        => 'required|date|after_or_equal:booking_Date',
            'additional_services' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        DB::beginTransaction();

        try {

              $roomBook = RoomBook::findOrFail($id);


           $oldBookingRooms = BookingRooms::where(
                'booking_id',
                $roomBook->id
            )->get();

            foreach ($oldBookingRooms as $bookingRoom) {

                $roomNumbers = $bookingRoom->r_no;

                if (is_string($roomNumbers)) {
                    $roomNumbers = json_decode($roomNumbers, true);
                }

                if (!is_array($roomNumbers)) {
                    continue;
                }

                foreach ($roomNumbers as $roomNo) {

                    Rooms::where('r_no', $roomNo)->update([
                        'status' => 'Available'
                    ]);
                }
            }

            BookingRooms::where(
                'booking_id',
                $roomBook->id
            )->delete();


            $roomBook->update([
                'guest_id'        => $data['guest_id'],
                'r_book'          => $data['r_book'],
                'number_of_room'  => $data['number_of_room'],
                'max_guests'      => $data['max_guests'],
                'package_id'      => $data['package_id'],
                'hotel_id'      => $data['hotel_id'],
                'booking_Date'    => $data['booking_Date'],
                'currencies_id'      => $data['currency_id'] ??  $roomBook->currency_id,
                'cancel_Date'     => $data['cancel_Date'],
                'is_active'       => $data['r_book'] === 'Canceling'
                    ? false
                    : $roomBook->is_active,
            ]);



            $grandTotal = 0;


            foreach ($roomsData as $item) {

                $requestedRooms = (int) $item['no_of_rooms'];

                $availableRooms = Rooms::where(
                    'r_category_id',
                    $item['room_category_id']
                )->where(
                    'hotel_id',
                    $item['hotel_id']
                )
                    ->where('status', 'Available')
                    ->take($requestedRooms)
                    ->get();



                if ($availableRooms->count() < $requestedRooms) {

                    DB::rollBack();

                    return response()->json([
                        'message' =>
                            'Not enough available rooms for selected category.'
                    ], 400);
                }



                $package = Package::findOrFail(
                    $data['package_id']
                );

                $packageAmount = $package->package_amount ?? 0;

                $assignedRooms = [];
                $categoryTotal = 0;

                foreach ($availableRooms as $room) {

                    $roomCost = $room->r_cost ?? 0;

                    $categoryTotal += $roomCost + $packageAmount;

                    $assignedRooms[] = $room->r_no;


                    $room->update([
                        'status' => 'Booked'
                    ]);
                }


                $transportBooking = TransportBook::where(
                    'guest_id',
                    $data['guest_id']
                )->first();

                $bookingAmount = $transportBooking->total_amount ?? 0;


                $grandTotal += $categoryTotal;


                BookingRooms::create([
                    'room_category_id' => $item['room_category_id'],
                    'booking_id'       => $roomBook->id,
                    'no_of_rooms'      => $requestedRooms,
                    'r_no'             => json_encode($assignedRooms),
                    'total_amount'     => $item['total_amount'] ?? 0,
                ]);
            }

            $grandTotal += $bookingAmount;


            $roomBook->update([
                'total_amount' => $grandTotal
            ]);


            DB::commit();


            return response()->json([
                'message'  => 'Room booking updated successfully.',
                'roomBook' => $roomBook->load([
                    'guest',
                    'package',
                    'bookingRooms.roomCategory'
                ])
            ], 200);


        } catch (\Exception $e) {

            DB::rollBack();

            Log::error(
                'Room booking update failed: ' . $e->getMessage()
            );

            return response()->json([
                'message' => 'An error occurred while updating the booking.',
                'error'   => $e->getMessage()
            ], 500);
        }
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
