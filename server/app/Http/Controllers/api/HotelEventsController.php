<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookStatus;
use App\Models\HotelEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use ParagonIE\Sodium\Core\Curve25519\H;

class HotelEventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $hotelEvents= HotelEvent::with('hotel','event','organizer','eventType','bookStatus')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($hotelEvents, 200);
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
            'name' => 'required|max:255',
            'event_type_id' => 'required|integer',
            'event_date' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'hotel_id' => 'required|integer',
            'organizer_id' => 'required|integer',
            'requests' => 'required',
            'book_status_id'=> 'required|integer',
            'event_id'=> 'required|integer',
            'additional_services' => 'required',
        ]);

        $existingBooking = HotelEvent::where('organizer_id', $validatedData['organizer_id'])
            ->where('event_date', $validatedData['event_date'])
            ->where('start_time', $validatedData['start_time'])
            ->where('book_status_id', $validatedData['book_status_id'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'This Date Booking.'], 409);
        }

        try {
            $nextId = HotelEvent::max('id') + 1;
            $heNo = 'HEN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $hotelEvent= HotelEvent::create(
                [
                    'name' => $validatedData['name'],
                    'event_type_id' => $validatedData['event_type_id'],
                    'event_id' => $validatedData['event_id'],
                    'event_date' => $validatedData['event_date'],
                    'start_time' => $validatedData['start_time'],
                    'end_time' => $validatedData['end_time'],
                    'hotel_id' => $validatedData['hotel_id'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'event_no'=> $heNo,
                ]
            );

            return response()->json(['message' =>'Hotel Event create successfully','hotelEvent'=>$hotelEvent], 200);
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
            $hotelEvent = HotelEvent::findOrFail($id);
            return response()->json($hotelEvent);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Hotel Event.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'event_type_id' => 'required|integer',
            'event_date' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'hotel_id' => 'required|integer',
            'organizer_id' => 'required|integer',
            'requests' => 'required',
            'additional_services' => 'required',
            'event_id' => 'required',
            'event_no'=> 'required',
        ]);
        $existingBooking = HotelEvent::where('id', '<>', $id)
            ->where(function ($query) use ($validatedData) {

                $query->where(function ($query) use ($validatedData) {
                    $query->where('organizer_id', '<>', $validatedData['organizer_id'])
                        ->where('event_id', '<>', $validatedData['event_id'])
                        ->where('event_type', $validatedData['event_type']);
                })

                    ->orWhere(function ($query) use ($validatedData) {
                        $query->where('event_id', $validatedData['event_id'])
                            ->where('event_date', $validatedData['event_date'])
                            ->where('is_active', true);
                    })

                    ->orWhere(function ($query) use ($validatedData) {
                        $query->whereBetween('end_date', [
                            $validatedData['start_date'],
                            $validatedData['end_date']
                        ])
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
        $bookStatus= BookStatus::findOrFail($validatedData['book_status_id']);

        try {
            $hotelEvent = HotelEvent::findOrFail($id);
            $hotelEvent->update(
                [
                    'name' => $validatedData['name'],
                    'event_type_id' => $validatedData['event_type_id'],
                    'event_id' => $validatedData['event_id'],
                    'event_date' => $validatedData['event_date'],
                    'start_time' => $validatedData['start_time'],
                    'end_time' => $validatedData['end_time'],
                    'hotel_id' => $validatedData['hotel_id'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'event_no'=> $validatedData['event_no'],
                    'is_active' =>$bookStatus->name === "Cancelled" ? false : $hotelEvent->is_active,

                ]
            );            return response()->json(['message' =>'Hotel Event update successfully','hotelEvent'=>$hotelEvent], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while update Hotel Event.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $hotelEvent = HotelEvent::findOrFail($id);
            $hotelEvent->is_active =false;
            $hotelEvent->save();
            return response()->json(['message' => 'hotelEvent deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the hotelEvent.'], 500);
        }
    }
}
