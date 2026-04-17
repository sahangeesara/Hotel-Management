<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookStatus;
use App\Models\RestaurantEvent;
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
            'section_id'=> 'required|integer',
            'seating_preferences' => 'required',
            'organizer_id' => 'required|integer',
            'room_id' => 'required|integer',
            'book_status_id'=> 'required|integer',
            'requests' => 'required',
            'additional_services' => 'required',
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

        try {
            $nextId = RestaurantEvent::max('id') + 1;
            $heNo = 'REN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

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
                    'book_status_id' => $validatedData['book_status_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'event_no'=> $heNo,
                ]
            );

            return response()->json(['message' =>'Restaurant Event create successfully','restaurantEvent'=>$restaurantEvent], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
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
            'event_no'=> 'required|integer',
            'event_id'=> 'required|integer',
            'event_type_id' => 'required|integer',
            'event_date' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'passengers' => 'required',
            'hotel_id' => 'required|integer',
            'section_id'=> 'required|integer',
            'seating_preferences' => 'required',
            'organizer_id' => 'required|integer',
            'room_id' => 'required|integer',
            'book_status_id'=> 'required|integer',
            'requests' => 'required',
            'additional_services' => 'required',
        ]);

        $existingBooking = RestaurantEvent::where('id', '<>', $id)
            ->where(function ($query) use ($validatedData) {

                $query->where(function ($query) use ($validatedData) {
                    $query->where('organizer_id', '<>', $validatedData['organizer_id'])
                        ->where('event_id', '<>', $validatedData['event_id'])
                        ->where('event_type_id', $validatedData['event_type_id']);
                })

                    ->orWhere(function ($query) use ($validatedData) {
                        $query->where('event_id', $validatedData['event_id'])
                            ->where('event_date', $validatedData['event_date'])
                            ->where('is_active', true);
                    })

                    ->orWhere(function ($query) use ($validatedData) {
                        $query->whereBetween('end_time', [
                            $validatedData['start_time'],
                            $validatedData['end_time']
                        ])
                            ->where('is_active', true);
                    });

            })->first();
        if ($existingBooking) {
            Log::info('Conflicting Booking Found:', [
                'existingBooking' => $existingBooking,
                'newData' => $validatedData
            ]);
            return response()->json(['error' => 'This Date is Booking..'], 409);
        }
        $bookStatus= BookStatus::findOrFail($validatedData['book_status_id']);

        try {
            $restaurantEvent = RestaurantEvent::findOrFail($id);
            $restaurantEvent->update(
                [
                    'event_type_id' => $validatedData['event_type_id'],
                    'event_id' => $validatedData['event_id'],
                    'event_date' => $validatedData['event_date'],
                    'start_time' => $validatedData['start_time'],
                    'end_time' => $validatedData['end_time'],
                    'hotel_id' => $validatedData['hotel_id'],
                    'room_id' => $validatedData['room_id'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'passengers' => $validatedData['passengers'],
                    'event_no'=> $validatedData['event_no'],
                    'is_active' =>$bookStatus->name === "Cancelled" ? false : $restaurantEvent->is_active,

                ]
            );            return response()->json(['message' =>'Restaurant Event update successfully','restaurantEvent'=>$restaurantEvent], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while update Restaurant Event.'], 500);
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
