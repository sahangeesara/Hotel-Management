<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Guides;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use function Illuminate\Events\queueable;

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
                           ->orderBy('created_at',"DESC")
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
        $data = json_decode($request->form, true); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'name' => 'required|max:255',
            'address' => 'required',
            'email' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'guide_id' => '', // Allow empty guide_id
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country' => 'required',
            'guest_type' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        // Check for existing booking with the same guide_id
        $existingBooking = Guest::where('guide_id', $data['guide_id'])
            ->where('is_active', true)
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'Guide already exists.']);
        }

        try {
            DB::beginTransaction();

            $guest = new Guest();
            $guest->name = $data['name'];
            $guest->address = $data['address'];
            $guest->email = $data['email'];
            $guest->city = $data['city'];
            $guest->nic = $data['nic'];
            $guest->tel_no = $data['tel_no'];
            // Set guide_id to null if empty
            $guest->guide_id = $data['guide_id'] ?? null;
            $guest->gender_id = $data['gender_id'];
            $guest->guest_type = $data['guest_type'];
            $guest->country = $data['country'];

            $guest->save();

            if (!empty($guest->guide_id)) {
                $guides = Guides::findOrFail($guest->guide_id);
                $guides->guide_status = "Assign";
                $guides->save();
            }

            DB::commit();

            return response()->json(['message' => 'Successfully submitted.', 'guest' => $guest]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'An error occurred while processing the request.', 'exception' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $guests = Guest::with('guide','gender')
                            ->findOrFail($id);
            return response()->json($guests);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guest.'], 500);
        }
    }
    public function countGuest(){
        $guestsCount = Guest::with(['guide', 'gender'])
            ->where('is_active', 1)
            ->count();

        return response()->json(['guestsCount' =>$guestsCount]);
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

    public function searchByDate(String $gDate){

        try {
            $guest = Guest::with(['gender', 'guide'])
                ->whereDate('created_at', $gDate)
                ->where('is_active', true)
                ->get();

            return response()->json($guest);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }
    public function searchGuestByGender(string $gen_id)
    {
        try {
            $guest = Guest::with('gender', 'guide')
                ->where('gender_id', $gen_id)
                ->where('is_active', true)
                ->get();

            return response()->json($guest);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
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
            'address' => 'required',
            'email' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'guide_id' => 'nullable',
            'country' => 'required',
            'guest_type' => 'required',
            'guide_status' => 'required',

        ]);
        if ($validatedData->fails()) { return response()->json($validatedData->errors());   }

        $existingNic = Guest::where('nic', $data['nic'])
                            ->where('id', '<>', $id) // Exclude the current guest's ID
                            ->first();

        if ($existingNic) {
            // Check if the guest_id and r_book combination already exists
            $existingBooking = Guest::where('guide_id', $data['guide_id'])
                ->where('is_active', true)
                ->first();
            // If the booking exists, return an error message or handle the situation as needed
            if ($existingBooking) {
                return response()->json(['error' => 'Guide already exists.']);
            }
        }

        try {
            DB::beginTransaction();

            $guest = Guest::findOrFail($id);
            $guest->name = $data['name'];
            $guest->address = $data['address'];
            $guest->email = $data['email'];
            $guest->city = $data['city'];
            $guest->nic = $data['nic'];
            $guest->tel_no = $data['tel_no'];
            $guest->guide_id = $data['guide_id'] ?? null;
            $guest->gender_id = $data['gender_id'];
            $guest->guest_type = $data['guest_type'];
            $guest->country = $data['country'];

            $guest->save();

                $guides = Guides::findOrFail($guest->guide_id);
                $guides->guide_status = $data['guide_status'];
                $guides->save();

            DB::commit();

            return response()->json(['massage' => 'Successfully Update.', $guest]);
        }
        catch (\Exception $e) {
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
