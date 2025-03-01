<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Guides;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GuideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $guides = Guides::with('gender')
                            ->where('is_active', 1)
                            ->orderBy('created_at',"DESC")
                            ->paginate(20);
            return response()->json($guides);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guide.'], 500);
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
            'address' => '',
            'email' => 'required|email',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
        ]);
        if ($validatedData->fails()) { return response()->json($validatedData->errors());   }

        // Check if the nic already exists
        $existingBooking = Guides::where('nic', $data['nic'])
                                ->first();
        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Nic already exists.']); }

        $nextId = Guides::max('id') + 1; // Get the next available ID
        $rNo = 'GIN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'r_no'

        $guideStatus ="No_Assign";
        try{
        $guides = new Guides();
        $guides->name = $data['name'];
        $guides->address = $data['address'];
        $guides->email = $data['email'];
        $guides->city = $data['city'];
        $guides->nic = $data['nic'];
        $guides->tel_no = $data['tel_no'];
        $guides->gender_id = $data['gender_id'];
        $guides->guide_status = $guideStatus;
        $guides->guide_no = $rNo;

        $guides->save();

        return response()->json(['massage' => 'Successfully submit.', $guides]);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guide.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $guides = Guides::with('gender')
                            ->findOrFail($id);
            return response()->json($guides);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guide.'], 500);
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
            'address' => '',
            'email' => 'required|email',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'guide_no' => 'required',
        ]);
        if ($validatedData->fails()) { return response()->json($validatedData->errors());   }

        // Check if the nic already exists
        $existingBooking = Guides::where('nic', $data['nic'])
                                ->where('id', '<>', $id)
                                ->first();
        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Nic already exists.']); }

        try{
        $guides = Guides::findOrFail($id);
        $guideStatus =$guides->guide_status;
        $guides->name = $data['name'];
        $guides->address = $data['address'];
        $guides->email = $data['email'];
        $guides->city = $data['city'];
        $guides->nic = $data['nic'];
        $guides->tel_no = $data['tel_no'];
        $guides->gender_id = $data['gender_id'];
        $guides->guide_no = $data['guide_no'];
        $guides->guide_status = $guideStatus;
        $guides->save();

        return response()->json(['massage' => 'Successfully Update.', $guides]);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guide.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $guide = Guides::findOrFail($id);
            $guide->is_active = false;
            $guide->save();

            return response()->json(['message' => 'Guide deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the guide.'], 500);
        }
    }
}
