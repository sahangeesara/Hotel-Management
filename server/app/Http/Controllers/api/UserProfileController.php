<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $profiles = Profile::with('user','gender')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);

            return response()->json($profiles);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving profile.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'user_id' => 'required',
            'address' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $validatedData = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $existingBooking = Profile::where('nic', $data['nic'])
            ->first();

        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Nic already exists.']); }

        try {

            $profile = new Profile();
            $profile->user_id = $data['user_id'];
            $profile->address = $data['address'];
            $profile->city = $data['city'];
            $profile->nic = $data['nic'];
            $profile->tel_no = $data['tel_no'];
            $profile->gender_id = $data['gender_id'];
            $profile->country = $data['country'];
            $profile->image = $request->file('image')->store('public/profile/images');

            $profile->save();


            return response()->json(['message' => 'Successfully submitted.', 'Profile' => $profile]);
        } catch (\Exception $e) {

            return response()->json(['error' => 'An error occurred while processing the request.', 'exception' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        try {
            $profile = Profile::with('user','gender')
                ->findOrFail($id);
            return response()->json($profile);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving profile.'], 500);
        }
    }
    public function authProfile()
    {
        $id=  Auth::user()->id;
        try {
            $profile = Profile::with('user','gender')
                ->where('user_id',$id)
                ->first();
            return response()->json($profile);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving profile.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = json_decode($request->form, true); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'user_id' => 'required',
            'address' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $validatedData = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $existingBooking = profile::where('nic', $data['nic'])
            ->where('id', '<>', $id)
            ->first();

        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Nic already exists.']); }

        try {

            $profile =profile::findOrFail($id);
            $profile->user_id = $data['user_id'];
            $profile->address = $data['address'];
            $profile->city = $data['city'];
            $profile->nic = $data['nic'];
            $profile->tel_no = $data['tel_no'];
            // Set guide_id to null if empty
            $profile->gender_id = $data['gender_id'];
            $profile->country = $data['country'];
            if ($request->hasFile('image')) {
                // Delete the existing image if necessary
                if ($profile->image) {
                    Storage::delete($profile->image);
                }

                $profile->image = $request->file('image')->store('public/profile/images');
            }
            $profile->save();


            return response()->json(['message' => 'Successfully Updated.', 'profile' => $profile]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'An error occurred while processing the request.', 'exception' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $profile = Profile::findOrFail($id);
            $profile->is_active = false;
            $profile->save();

            return response()->json(['message' => 'Profile deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the profile.'], 500);
        }
    }
}
