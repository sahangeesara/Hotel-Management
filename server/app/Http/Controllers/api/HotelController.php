<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $hotel = Hotel::with('roomSetup')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($hotel);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving hotel.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'location' => 'required|max:255',
            'phone' => 'required|max:10',
            'room_setups_id' => 'required',
            'capacity' => 'required',
        ]);

        // Create and save the new nationality
        try{
            $nextId = Hotel::max('id') + 1; // Get the next available ID
            $hNo = 'HN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $hotel = Hotel::create([
                'name' => $validatedData['name'],
                'location' => $validatedData['location'],
                'phone' => $validatedData['phone'],
                'room_setups_id' => $validatedData['room_setups_id'],
                'capacity' => $validatedData['capacity'],
                'hotel_code' => $hNo,
            ]);
            return response()->json(['message' => 'hotel created successfully', 'hotel' => $hotel], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding hotel.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $hotel = Hotel::findOrFail($id);
            return response()->json($hotel);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving hotel.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'location' => 'required|max:255',
            'phone' => 'required|max:10',
            'room_setups_id' => 'required',
            'capacity' => 'required',
            'hotel_code' => 'required',
        ]);
        // Create and save the new hotel
        try{
            $hotel = Hotel::findOrFail($id);
            $hotel->update($validatedData);
            return response()->json(['message' => 'hotel created successfully', 'hotel' => $hotel], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding hotel.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $hotel = Hotel::findOrFail($id);
            $hotel->is_active =false;
            $hotel->save();
            return response()->json(['message' => 'hotel deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the hotel.'], 500);
        }
    }
}
