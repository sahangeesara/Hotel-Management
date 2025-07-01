<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RoomsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $rooms = Rooms::with('roomCategory')
                        ->where('is_active',1)
                        ->orderBy('created_at',"DESC")
                        ->paginate(20);

            return response()->json($rooms);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request data directly
        $validatedData = $request->validate([
            'id' =>'',
            'r_no' =>'',
            'r_cost' => 'required|numeric',
            'r_category_id' => 'required|integer',
        ]);

        try {
            // Generate 'r_no' based on the next auto-incremented 'id'
            $nextId = Rooms::max('id') + 1;
            $rNo = 'RN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            // Create and save the new room
            $room = Rooms::create([
                'r_no' => $rNo,
                'r_cost' => $validatedData['r_cost'],
                'r_category_id' => $validatedData['r_category_id'],
            ]);

            return response()->json(['message' => 'Room created successfully', 'room' => $room], 201);
        } catch (\Exception $e) {
            Log::error('Room creation error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the room.'], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $rooms = Rooms::with('roomCategory')
                            ->findOrFail($id);
            return response()->json($rooms);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room.'], 500);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the incoming JSON request
        $validatedData = $request->validate([
            'r_no' => 'required',
            'r_cost' => 'required|numeric',
            'r_category_id' => 'required|integer',
        ]);

        try {
            // Find the room by ID or fail
            $room = Rooms::findOrFail($id);

            // Update room details
            $room->update($validatedData);

            return response()->json(['message' => 'Room updated successfully', 'room' => $room]);
        } catch (\Exception $e) {
            Log::error('Room update error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the room.'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $room = Rooms::findOrFail($id);
            $room->is_active = false;
            $room->save();

            return response()->json(['message' => 'Rooms deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while deactivating the rooms.'], 500);
        }
    }
}
