<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Guides;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $guests = Guest::with('guide','gender')
                            ->where('is_active', 1)
                            ->paginate(20);

            return response()->json($guests);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guest.'], 500);
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
            'address' => 'required',
            'email' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'guide_id' => 'required',
            'gender_id' => 'required',
            'country' => 'required',
            'guest_type' => 'required',

        ]);
        if ($validatedData->fails()) { return response()->json($validatedData->errors());   }

        // Check if the guest_id and r_book combination already exists
        $existingBooking = Guest::where('guide_id', $data['guide_id'])
                                  ->where('is_active', true)
                                 ->first();
        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Guide already exists.']); }

        $guest = new Guest();
        $guest->name = $data['name'];
        $guest->address = $data['address'];
        $guest->email = $data['email'];
        $guest->city = $data['city'];
        $guest->nic = $data['nic'];
        $guest->tel_no = $data['tel_no'];
        $guest->guide_id = $data['guide_id'];
        $guest->gender_id = $data['gender_id'];
        $guest->guest_type = $data['guest_type'];
        $guest->country = $data['country'];

        $guest->save();

        $guides = Guides::findOrFail($guest->guide_id);
        $guides->guide_status ="Assign";
        $guides->save();

        return response()->json(['massage' => 'Successfully submit.', $guest]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $guests = Guest::findOrFail($id);
            return response()->json($guests);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guest.'], 500);
        }
    }

    public function getGuide(){
        try {
            $guide = Guides::with('gender')
                            ->where('guide_status', 'NOT like', "Assign" )
                            ->get();

            return response()->json($guide);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guest.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $guest = Guest::findOrFail($id);
        $guest->update($request->all());

        return json_encode($guest);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $guest = Guest::findOrFail($id);
            $guest->is_active = false;
            $guest->save();

            $guides = Guides::findOrFail($guest->guide_id);
            $guides->guide_status ="No_Assign";
            $guides->save();
            return response()->json(['message' => 'Guest deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the guest.'], 500);
        }
    }
}
