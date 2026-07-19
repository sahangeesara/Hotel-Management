<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookStatus;
use App\Models\WeddingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WeddingEventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $countryCords = WeddingEvent::with('hotel','room','organizer','bookStatus')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($countryCords);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Country code.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'bride_name'=> 'required',
            'groom_name' => 'required',
            'event_date' => 'required',
            'event_time' => 'required',
            'passengers' => 'required',
            'hotel_id' => 'required|integer',
            'organizer_id' => 'required|integer',
            'room_id' => 'required|integer',
            'book_status_id'=> 'required|integer',
            'requests' => 'required',
            'additional_services' => 'required',
        ]);

        $existingBooking = WeddingEvent::where('organizer_id', $validatedData['organizer_id'])
            ->where('event_date', $validatedData['event_date'])
            ->where('event_time', $validatedData['event_time'])
            ->where('book_status_id', $validatedData['book_status_id'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json([
                'error' => 'This date and time is already booked.'
            ], 409);
        }

        try {
            $nextId = WeddingEvent::max('id') + 1;
            $heNo = 'WEN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $weddingEvent= WeddingEvent::create(
                [
                    'bride_name' => $validatedData['bride_name'],
                    'groom_name' => $validatedData['groom_name'],
                    'event_date' => $validatedData['event_date'],
                    'event_time' => $validatedData['event_time'],
                    'passengers' => $validatedData['passengers'],
                    'hotel_id' => $validatedData['hotel_id'],
                    'room_id' => $validatedData['room_id'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'event_no'=> $heNo,
                ]
            );

            return response()->json(['message' =>'wedding Event create successfully','weddingEvent'=>$weddingEvent], 200);
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
            $weddingEvent = WeddingEvent::with('hotel','room','organizer','bookStatus')
                ->findOrFail($id);
            return response()->json($weddingEvent);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving wedding Event.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'bride_name'=> 'required',
            'groom_name' => 'required',
            'event_date' => 'required',
            'event_time' => 'required',
            'passengers' => 'required',
            'hotel_id' => 'required|integer',
            'organizer_id' => 'required|integer',
            'room_id' => 'required|integer',
            'book_status_id'=> 'required|integer',
            'requests' => 'required',
            'additional_services' => 'required',
            'event_no'=> 'required',
        ]);


        $existingBooking = WeddingEvent::where('id', '<>', $id)
            ->where('hotel_id', $validatedData['hotel_id'])
            ->where('room_id', $validatedData['room_id'])
            ->where('event_date', $validatedData['event_date'])
            ->where('event_time', $validatedData['event_time'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            Log::info('Conflicting Wedding Booking Found', [
                'existingBooking' => $existingBooking,
                'newData' => $validatedData,
            ]);

            return response()->json([
                'error' => 'This room is already booked for the selected date and time.'
            ], 409);
        }

        $bookStatus= BookStatus::findOrFail($validatedData['book_status_id']);

        try {

            $weddingEvent = WeddingEvent::findOrFail($id);

            $weddingEvent->update(
                [
                    'bride_name' => $validatedData['bride_name'],
                    'groom_name' => $validatedData['groom_name'],
                    'event_date' => $validatedData['event_date'],
                    'event_time' => $validatedData['event_time'],
                    'passengers' => $validatedData['passengers'],
                    'hotel_id' => $validatedData['hotel_id'],
                    'room_id' => $validatedData['room_id'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'requests' => $validatedData['requests'],
                    'additional_services' => $validatedData['additional_services'],
                    'event_no'=> $validatedData['event_no'],
                    'is_active' =>$bookStatus->name === "Cancelled" ? false : $weddingEvent->is_active,

                ]
            );

            return response()->json(['message' =>'wedding Event create successfully','weddingEvent'=>$weddingEvent], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $weddingEvent = WeddingEvent::findOrFail($id);
            $weddingEvent->is_active =false;
            $weddingEvent->save();
            return response()->json(['message' => 'Wedding Event deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Wedding Event.'], 500);
        }
    }
}
