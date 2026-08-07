<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookStatus;
use App\Models\Currency;
use App\Models\Package;
use App\Models\RestaurantEvent;
use App\Models\Rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RestaurantEventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $restaurantEvent= RestaurantEvent::with('hotel','event','organizer','eventType','bookStatus','section','rooms')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($restaurantEvent, 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'event_id'=> 'required|integer',
            'event_type_id' => 'required|integer',
            'event_date' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'passengers' => 'required',
            'hotel_id' => 'required|integer',
            'package_id' => 'nullable|integer',
            'section_id'=> 'required|integer',
            'seating_preferences' => '',
            'organizer_id' => 'required|integer',
            'room_id' => 'required|integer',
            'book_status_id'=> 'required|integer',
            'requests' => '',
            'additional_services' => '',
        ]);

        $existingBooking = RestaurantEvent::where('organizer_id', $validatedData['organizer_id'])
            ->where('event_date', $validatedData['event_date'])
            ->where('start_time', $validatedData['start_time'])
            ->where('book_status_id', $validatedData['book_status_id'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'This Date is Booking.'], 409);
        }

        $currency_name = "LKR";

        $currency_id = Currency::where('currency', $currency_name)->value('id');

        try {
            $nextId = RestaurantEvent::max('id') + 1;
            $heNo = 'REN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            $totalAmount=0;
            $room = Rooms::findOrFail($validatedData['room_id']);
            $package = Package::where('id', $validatedData['package_id'])->first() ;
            $package_amount = $package->package_amount ?? 0;
            $totalAmount = ($room->r_cost ?? 0) + $package_amount;
            $request_price = 0;
            if ($validatedData['requests']) {
                $request_price += 3000;
            }

            if ($validatedData['additional_services']) {
                $request_price += 3000;
            }
            $totalAmount =$totalAmount+ $request_price;

            $restaurantEvent= RestaurantEvent::create(
                [
                    'event_id' => $validatedData['event_id'],
                    'event_type_id' => $validatedData['event_type_id'],
                    'event_date' => $validatedData['event_date'],
                    'start_time' => $validatedData['start_time'],
                    'end_time' => $validatedData['end_time'],
                    'passengers' => $validatedData['passengers'],
                    'hotel_id' => $validatedData['hotel_id'],
                    'section_id' => $validatedData['section_id'],
                    'room_id' => $validatedData['room_id'],
                    'seating_preferences' => $validatedData['seating_preferences'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'package_id' => $validatedData['package_id'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'total_amount' => $totalAmount,
                    'currencies_id' => $currency_id,
                    'event_no'=> $heNo,
                ]
            );

            return response()->json(['message' =>'Restaurant Event create successfully','restaurantEvent'=>$restaurantEvent], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function searchRestaurantEvent(Request $request)
    {
        try {
            $restaurantEvent = RestaurantEvent::with('hotel','event','organizer','eventType','bookStatus','section','rooms')
                ->where('is_active', true)

                ->when($request->filled('hotel_id'), function ($query) use ($request) {
                    $query->where('hotel_id',  $request->hotel_id);
                })
                ->when($request->filled('event_id'), function ($query) use ($request) {
                    $query->where('event_id',  $request->event_id);
                })

                ->when($request->filled('event_type_id'), function ($query) use ($request) {
                    $query->where('event_type_id',  $request->event_type_id);
                })

                ->when($request->filled('room_id'), function ($query) use ($request) {
                    $query->where('room_id', $request->room_id);
                })

                ->when($request->filled('event_date'), function ($query) use ($request) {
                    $query->where('event_date', $request->event_date);
                })

                ->get();

            return response()->json($restaurantEvent);

        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while retrieving restaurant Event.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $restaurantEvent = RestaurantEvent::with('hotel','event','organizer','eventType','bookStatus','section','rooms')
                ->findOrFail($id);
            return response()->json($restaurantEvent);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Restaurant Event.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'event_no' => 'required',
            'event_id' => 'required|integer',
            'event_type_id' => 'required|integer',
            'event_date' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'passengers' => 'required',
            'hotel_id' => 'required|integer',
            'section_id' => 'required|integer',
            'seating_preferences' => '',
            'organizer_id' => 'required|integer',
            'room_id' => 'required|integer',
            'package_id' => 'required|integer',
            'book_status_id' => 'required|integer',
            'requests' => '',
            'additional_services' => '',
            'currency_id' => 'nullable|integer',
            'total_amount'    => 'nullable|numeric',

        ]);

        // Fixed booking conflict overlap check
        $existingBooking = RestaurantEvent::where('id', '<>', $id)
            ->where('room_id', $validatedData['room_id'])
            ->where('event_date', $validatedData['event_date'])
            ->where('is_active', true)
            ->where(function ($query) use ($validatedData) {
                $query->where('start_time', '<', $validatedData['end_time'])
                    ->where('end_time', '>', $validatedData['start_time']);
            })->first();

        if ($existingBooking) {
            Log::info('Conflicting Booking Found:', [
                'existingBooking' => $existingBooking,
                'newData' => $validatedData
            ]);
            return response()->json(['error' => 'This Date is Booking..'], 409);
        }

        $bookStatus = BookStatus::findOrFail($validatedData['book_status_id']);



        try {
            $restaurantEvent = RestaurantEvent::findOrFail($id);

            $totalAmount = $restaurantEvent->total_amount;

            if($validatedData['room_id' ] != $restaurantEvent->room_id || $validatedData['package_id'] != $restaurantEvent->package_id) {
                $room = Rooms::findOrFail($validatedData['room_id']);
                $package = Package::findOrFail($validatedData['package_id']);

                if($validatedData['package_id'] != $restaurantEvent->package_id) {
                    $oldPackage = Package::find($restaurantEvent->package_id);
                    $oldPackageAmount = $oldPackage->package_amount ?? 0;
                    $totalAmount -= $oldPackageAmount;
                    $package_amount = $package->package_amount ?? 0;
                }else{
                    $package_amount = $package->package_amount ?? 0;
                }
                $request_price = 0;
                if ($validatedData['requests']) {
                    $request_price += 3000;
                }

                if ($validatedData['additional_services']) {
                    $request_price += 3000;
                }
                $totalAmount += ($room->r_cost ?? 0) + $package_amount + $request_price;

            }

            if($validatedData['requests'] == null && $restaurantEvent->requests){
                $totalAmount = $totalAmount - 3000;
            }

            if($validatedData['additional_services'] == null && $restaurantEvent->additional_services){
                $totalAmount =$totalAmount - 3000;
            }

            $restaurantEvent->update([
                'event_type_id' => $validatedData['event_type_id'],
                'event_id' => $validatedData['event_id'],
                'event_date' => $validatedData['event_date'],
                'start_time' => $validatedData['start_time'],
                'end_time' => $validatedData['end_time'],
                'hotel_id' => $validatedData['hotel_id'],
                'room_id' => $validatedData['room_id'],
                'package_id' => $validatedData['package_id'],
                'organizer_id' => $validatedData['organizer_id'],
                'requests' => $validatedData['requests'],
                'additional_services' => $validatedData['additional_services'],
                'book_status_id' => $validatedData['book_status_id'],
                'passengers' => $validatedData['passengers'],
                'event_no' => $validatedData['event_no'],
                'currency_id' => $validatedData['currency_id'] ?? $restaurantEvent->currency_id,
                'total_amount' => $totalAmount,
                'is_active' => $bookStatus->name === "Cancelled" ? false : $restaurantEvent->is_active,
            ]);

            return response()->json([
                'message' => 'Restaurant Event update successfully',
                'restaurantEvent' => $restaurantEvent
            ], 200);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'An error occurred while update Restaurant Event.'
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $restaurantEvent = RestaurantEvent::findOrFail($id);
            $restaurantEvent->is_active =false;
            $restaurantEvent->save();
            return response()->json(['message' => 'Restaurant Event deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Restaurant Event.'], 500);
        }
    }
}
