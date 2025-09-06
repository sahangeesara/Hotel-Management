<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $event = Event::where('is_active', 1)
                ->get();
            return response()->json($event);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Event.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $nextId = Event::max('id') + 1;
        $eventNo = 'EVN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
        try{
            $event =new Event();
            $event->name = $data['name'];
            $event->event_no = $eventNo;
            $event->save();

            return json_encode($event);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Event.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $event = Event::findOrFail($id);
            return response()->json($event);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Event.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
            'event_no' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        try{
            $event = Event::findOrFail($id);
            $event->name = $data['name'];
            $event->event_no = $data['event_no'];
            $event->save();

            return json_encode($event);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Event.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->is_active = false;
            $event->save();

            return response()->json(['message' => 'Event deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Event.'], 500);
        }
    }
}
