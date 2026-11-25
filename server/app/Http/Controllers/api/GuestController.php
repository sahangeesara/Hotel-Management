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
use function Illuminate\Events\queueable;
use App\Http\Requests\StoreGuestRequest;
use App\Http\Requests\UpdateGuestRequest;


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
  public function store(StoreGuestRequest $request)
{
    $validatedData = $request->validated();

    $details = $validatedData['guestDetails'] ?? [];

    unset(
        $validatedData['guestDetails'],
        $validatedData['_form_json_valid'],
        $validatedData['_details_json_valid']
    );

    $data = $validatedData;

    $nextId = Guest::max('id') + 1;

    $rNo = 'GSN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

    DB::beginTransaction();

    try {

        // Create Guest
        $guest = new Guest();

        $guest->name = $data['name'];
        $guest->address = $data['address'] ?? null;
        $guest->email = $data['email'];
        $guest->city = $data['city'];
        $guest->nic = $data['nic'] ?? null;
        $guest->foreign_nic = $data['foreign_nic'] ?? null;
        $guest->tel_no = $data['tel_no'];
        $guest->guide_id = $data['guide_id'] ?? null;
        $guest->gender_id = $data['gender_id'];
        $guest->country_id = $data['country_id'];
        $guest->cuntry_code_id = $data['cuntry_code_id'];
        $guest->guest_type = $data['guest_type'];
        $guest->guest_no = $rNo;

        $guest->save();

        // Save Guest Counts
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

        // Save Guest Dependent Details
        if (!empty($details)) {

            foreach ($details as $item) {

                $guestDetails = new GuestDependentDetail();

                $guestDetails->guest_id = $guest->id;
                $guestDetails->dependent_name = $item['dependent_name'];
                $guestDetails->dependent_relationship = $item['dependent_relationship'];
                $guestDetails->age = $item['age'];
                $guestDetails->dependent_id = $item['dependent_id'] ?? null;

                $guestDetails->save();
            }
        }

        // Update Guide Status
        if (!empty($guest->guide_id)) {

            $guides = Guides::findOrFail($guest->guide_id);

            $guides->guide_status = "Assign";

            $guides->save();
        }

        DB::commit();

        return response()->json([
            'message' => 'Successfully submitted.',
            'guest' => $guest
        ], 201);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'error' => 'An error occurred while processing the request.',
            'exception' => $e->getMessage()
        ], 500);
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
     * @throws \Throwable
     */
    public function update(UpdateGuestRequest $request, string $id)
    {
    $guest = Guest::findOrFail($id);

    $validatedData = $request->validated();

    $details = $validatedData['guestDetails'] ?? [];

    unset(
        $validatedData['guestDetails'],
        $validatedData['_form_json_valid'],
        $validatedData['_details_json_valid']
    );

    $data = $validatedData;

    DB::beginTransaction();

    try {

        // Get previous guide ID
        $oldGuideID = $guest->guide_id;

        // Update Guest
        $guest->name = $data['name'];
        $guest->address = $data['address'] ?? null;
        $guest->email = $data['email'];
        $guest->city = $data['city'];
        $guest->nic = $data['nic'] ?? null;
        $guest->foreign_nic = $data['foreign_nic'] ?? null;
        $guest->tel_no = $data['tel_no'];
        $guest->guide_id = $data['guide_id'] ?? null;
        $guest->gender_id = $data['gender_id'];
        $guest->country_id = $data['country_id'];
        $guest->cuntry_code_id = $data['cuntry_code_id'];
        $guest->guest_type = $data['guest_type'];

        $guest->save();

        // Update Guide Status
        if (!empty($oldGuideID)) {
            $oldGuide = Guides::find($oldGuideID);

            if ($oldGuide) {
                $oldGuide->guide_status = $data['guide_status'] ?? $oldGuide->guide_status;

                $oldGuide->save();
            }
        }

        // Update Guest Counts
        $adults = (int) ($data['adults'] ?? 0);
        $children = (int) ($data['children'] ?? 0);
        $infants = (int) ($data['infants'] ?? 0);

        BookingGuestCounts::updateOrCreate(
            ['guest_id' => $guest->id],
            [
                'adults' => $adults,
                'children' => $children,
                'infants' => $infants,
                'total_amount' => $adults + $children + $infants,
            ]
        );

        // Update or Create Dependent Details
        if (!empty($details)) {

            foreach ($details as $item) {

                if (!empty($item['dependent_id'])) {

                    // Update existing dependent
                    $guestDetails = GuestDependentDetail::where(
                        'id',
                        $item['dependent_id']
                    )
                    ->where('guest_id', $guest->id)
                    ->firstOrFail();

                } else {

                    // Create new dependent
                    $guestDetails = new GuestDependentDetail();

                    $guestDetails->guest_id = $guest->id;
                }

                $guestDetails->dependent_name = $item['dependent_name'];
                $guestDetails->dependent_relationship = $item['dependent_relationship'];
                $guestDetails->age = $item['age'];
                $guestDetails->dependent_id = $item['dependent_id'] ?? null;

                $guestDetails->save();
            }
        }

        DB::commit();

        return response()->json([
            'message' => 'Successfully Updated.',
            'guest' => $guest
        ], 200);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'error' => 'An error occurred while processing the request.',
            'exception' => $e->getMessage()
        ], 500);
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
