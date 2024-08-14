<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $data = json_decode($request->form, true);
        $room = Rooms::create($data);
        return json_encode($room);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $rooms = Rooms::findOrFail($id);
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
        $rooms = Rooms::findOrFail($id);
        $rooms->update($request->all());

        return json_encode($rooms);
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
            return response()->json(['message' => 'An error occurred while deactivating the rooms.'], 500);
        }
    }
}
