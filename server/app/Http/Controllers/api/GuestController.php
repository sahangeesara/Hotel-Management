<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookingGuestCounts;
use App\Models\Guest;
use App\Models\GuestDependentDetail;
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
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function index()
    {
        try {
           $guests = Guest::with(['guide','gender','country','countryCode',
                                            'BookingGuestCounts.guest','GuestDependentDetail.guest'])
                            ->where('is_active', 1)
                           ->orderBy('created_at',"DESC")
                           ->paginate(20);

            return response()->json($guests);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guest get.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * @throws \Throwable
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $details = json_decode($request->guestDetails, true);


        // Validate request data
        $validatedData = Validator::make($data, [
            'name' => 'required|max:255',
            'address' => '',
            'email' => 'required|email',
            'city' => 'required',
            'nic' => '',
            'foreign_nic' => '',
            'guide_id' => '', // Allow empty guide_id
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country_id' => 'required',
            'cuntry_code_id' => 'required',
            'guest_type' => 'required',
            'adults' => 'required',
            'children' => '',
            'infants' => '',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $existingNic='';

            if ($data['nic']) {
                $existingNic = Guest::where('nic', $data['nic'])
                    ->first();
            }



        // If the booking exists, return an error message or handle the situation as needed
        if ($existingNic) {  return response()->json(['error' => 'Nic already exists.']); }

        if ($data['guide_id'] != null) {
            // Check for existing booking with the same guide_id
            $existingGuide = Guest::where('guide_id', $data['guide_id'])
                ->where('is_active', true)
                ->first();

            if ($existingGuide) {
                return response()->json(['error' => 'Guide already exists.']);
            }
        }

        $nextId = Guest::max('id') + 1; // Get the next available ID
        $rNo = 'GSN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'r_no'

        DB::beginTransaction();

        try {


            $guest = new Guest();
            $guest->name = $data['name'];
            $guest->address = $data['address'];
            $guest->email = $data['email'];
            $guest->city = $data['city'];
            $guest->nic = !empty($data['nic']) ? $data['nic'] : null;
            $guest->foreign_nic = !empty($data['foreign_nic']) ? $data['foreign_nic'] : null;
            $guest->tel_no = $data['tel_no'];
            // Set guide_id to null if empty
            $guest->guide_id = empty($data['guide_id']) ? null : $data['guide_id'];
            $guest->gender_id = $data['gender_id'];
            $guest->country_id = $data['country_id'];
            $guest->cuntry_code_id = $data['cuntry_code_id'];
            $guest->guest_type = $data['guest_type'];
            $guest->guest_no = $rNo;

            $guest->save();

            $adults = (int) ($data['adults'] ?? 0);
            $children = (int) ($data['children'] ?? 0);
            $infants = (int) ($data['infants'] ?? 0);

            $guestcount = new BookingGuestCounts();
            $guestcount->guest_id = $guest->id;
            $guestcount->adults = $adults;
            $guestcount->children = $children;
            $guestcount->infants = $infants;
            $guestcount->total_amount = $adults + $children + $infants;

            $guestcount->save();

            if (!empty($details)) {
                foreach ($details as $item) {
                    $guestDetails = new GuestDependentDetail();
                    $guestDetails->guest_id = $guest->id;
                    $guestDetails->dependent_name = $item['dependent_name'];
                    $guestDetails->dependent_relationship = $item['dependent_relationship'];
                    $guestDetails->age = $item['age'];
                    $guestDetails->dependent_id = $item['dependent_id'];
                    $guestDetails->save();
                }
            }

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
            $guests = Guest::with(['guide','gender','country','countryCode',
                'BookingGuestCounts.guest','GuestDependentDetail.guest'])
                            ->findOrFail($id);
            return response()->json($guests);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving guest.'], 500);
        }
    }

    public function searchGuest(Request $request)
    {
        try {
            $guests = Guest::with(['guide','gender','country','countryCode',
                'BookingGuestCounts.guest','GuestDependentDetail.guest'])
                ->where('is_active', true)

                ->when($request->filled('name'), function ($query) use ($request) {
                    $query->where('name', 'like', '%' . $request->name . '%');
                })

                ->when($request->filled('country_id'), function ($query) use ($request) {
                    $query->where('country_id', $request->country_id);
                })

                ->when($request->filled('gender_id'), function ($query) use ($request) {
                    $query->where('gender_id', $request->gender_id);
                })

                ->get();

            return response()->json($guests);

        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while retrieving guests.'
            ], 500);
        }
    }

    public function getDependentDetail(String $id)
    {
        try {
            $dependents = GuestDependentDetail::where('guest_id', $id)->get();

            if ($dependents->isEmpty()) {
                return response()->json(["message" => "No dependents found."], 404);
            }

            return response()->json($dependents);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(["message" => "An error occurred while retrieving dependent details."], 500);
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

        $data = json_decode($request->form, true);
        $details = json_decode($request->guestDetails, true);

        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
            'address' => '',
            'guest_no' => '',
            'email' => 'required|email',
            'city' => 'required',
            'nic' => '',
            'foreign_nic' => '',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country_id' => 'required',
            'cuntry_code_id' => 'required',
            'guide_id' => '',
            'guest_type' => 'required',
            'guide_status' => '',
            'adults' => 'required',
            'children' => 'required',
            'infants' => 'required',
        ]);
        if ($validatedData->fails()) { return response()->json($validatedData->errors());   }

        $existingNic = Guest::where('nic', $data['nic'])
                            ->where('id', '<>', $id) // Exclude the current guest's ID
                            ->first();

        if ($existingNic) {  return response()->json(['error' => 'Nic already exists.']); }

        if ($data['guide_id'] != null){
            // Check if the guest_id and r_book combination already exists
            $existingGuide = Guest::where('guide_id', $data['guide_id'])
                ->where('is_active', true)
                ->where('id', '<>', $id)
                ->first();
            // If the booking exists, return an error message or handle the situation as needed
            if ($existingGuide) {
                return response()->json(['error' => 'Guide already exists.']);
            }

        }

        try {
            DB::beginTransaction();

            $guest = Guest::findOrFail($id);
            $oldGuideID = empty($data['guide_id']) ? $guest->guide_id : $data['guide_id'];
            $guest->name = $data['name'];
            $guest->address = $data['address'];
            $guest->email = $data['email'];
            $guest->city = $data['city'];
            $guest->nic = $data['nic'];
            $guest->foreign_nic = $data['foreign_nic'];
            $guest->tel_no = $data['tel_no'];
            // Set guide_id to null if empty
            $guest->guide_id = empty($data['guide_id']) ? null : $data['guide_id']; // Ensure null is set
            $guest->gender_id = $data['gender_id'];
            $guest->country_id = $data['country_id'];
            $guest->cuntry_code_id = $data['cuntry_code_id'];
            $guest->guest_type = $data['guest_type'];
            $guest->guest_no = $data['guest_no'];

            $guest->save();

                $guides = Guides::findOrFail($oldGuideID);
                $guides->guide_status = $data['guide_status'];
                $guides->save();

            $guestcount =BookingGuestCounts::findOrFail($id);
            $guestcount->guest_id = $guest->id;
            $guestcount->adults = $data['adults'];
            $guestcount->children = $data['children'];
            $guestcount->infants = $data['infants'];
            $guestcount->total_amount = $data['infants'] + $data['children'] + $data['adults'];

            $guestcount->save();

            if (!empty($details)) {
                foreach ($details as $item) {
                    $guestDetails = GuestDependentDetail::findOrFail($id);
                    $guestDetails->guest_id = $guest->id;
                    $guestDetails->dependent_name = $item['dependent_name'];
                    $guestDetails->age = $item['age'];
                    $guestDetails->dependent_relationship = $item['dependent_relationship'];
                    $guestDetails->dependent_id = $item['dependent_id'];
                    $guestDetails->save();
                }
            }

            DB::commit();

            return response()->json(['massage' => 'Successfully Update.', $guest]);
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
