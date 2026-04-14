<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookStatus;
use App\Models\GeneralEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GeneralEventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $generalEvents= GeneralEvent::with('event','organizer','eventType','bookStatus')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($generalEvents, 200);
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
            'organizer_id' => 'required|integer',
            'requests' => 'required',
            'book_status_id'=> 'required|integer',
            'event_id'=> 'required|integer',
            'passengers' => 'required',
        ]);

        $existingBooking = GeneralEvent::where('organizer_id', $validatedData['organizer_id'])
            ->where('event_date', $validatedData['event_date'])
            ->where('event_time', $validatedData['event_time'])
            ->where('book_status_id', $validatedData['book_status_id'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'This Date Booking.'], 409);
        }

        try {
            $nextId = GeneralEvent::max('id') + 1;
            $heNo = 'GEN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $generalEvent= GeneralEvent::create(
                [
                    'name' => $validatedData['name'],
                    'event_type_id' => $validatedData['event_type_id'],
                    'event_id' => $validatedData['event_id'],
                    'event_date' => $validatedData['event_date'],
                    'event_time' => $validatedData['event_time'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'requests' => $validatedData['requests'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'passengers' => $validatedData['passengers'],
                    'event_no'=> $heNo,
                ]
            );

            return response()->json(['message' =>'General Event create successfully','generalEvent'=>$generalEvent], 200);
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
            $generalEvent = GeneralEvent::with('event','organizer','eventType','bookStatus')
                                    ->findOrFail($id);
            return response()->json($generalEvent);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving General Event.'], 500);
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
            'organizer_id' => 'required|integer',
            'requests' => 'required',
            'passengers' => 'required',
            'event_id' => 'required',
            'event_no'=> 'required',
            'book_status_id' => 'required|integer',
        ]);
        $existingBooking = generalEvent::where('id', '<>', $id)
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
            $generalEvent = generalEvent::findOrFail($id);
            $generalEvent->update(
                [
                    'name' => $validatedData['name'],
                    'event_type_id' => $validatedData['event_type_id'],
                    'event_id' => $validatedData['event_id'],
                    'event_date' => $validatedData['event_date'],
                    'event_time' => $validatedData['event_time'],
                    'organizer_id' => $validatedData['organizer_id'],
                    'requests' => $validatedData['requests'],
                    'book_status_id' => $validatedData['book_status_id'],
                    'passengers' => $validatedData['passengers'],
                    'event_no'=> $validatedData['event_no'],
                    'is_active' =>$bookStatus->name === "Cancelled" ? false : $generalEvent->is_active,

                ]
            );            return response()->json(['message' =>'general Event update successfully','generalEvent'=>$generalEvent], 200);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while update general Event.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $generalEvent = GeneralEvent::findOrFail($id);
            $generalEvent->is_active =false;
            $generalEvent->save();
            return response()->json(['message' => 'General Event deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the generalEvent.'], 500);
        }
    }
}
