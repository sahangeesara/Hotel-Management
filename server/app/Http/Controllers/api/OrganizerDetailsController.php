<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\OrganizerDetails;
use App\Http\Requests\UpdateOrganizerDetailsRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreOrganizerDetailsRequest;

class OrganizerDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $organizerDetails = OrganizerDetails::with('gender')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);

            return response()->json($organizerDetails);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving organizerDetails.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizerDetailsRequest $request)
    {
        $validatedData = $request->validated();

        try {
            $organizerDetails = DB::transaction(function () use ($validatedData) {
            $nextId = (OrganizerDetails::lockForUpdate()->max('id') ?? 0) + 1;
            $orgNo = 'ORD' . str_pad($nextId, 5, '0', STR_PAD_LEFT);


            return OrganizerDetails::create(
                [
                    'gender_id' => $validatedData['gender_id'],
                    'name' => $validatedData['name'],
                    'email' => $validatedData['email'],
                    'nic' => $validatedData['nic'],
                    'phone' => $validatedData['phone'],
                    'address' => $validatedData['address'],
                    'organizer_code' => $orgNo,
                ]
            );
        });
            return response()->json(['message' => 'organizerDetails create successfully', 'organizerDetails' => $organizerDetails], 200);
        } catch (\Exception $e) {
            Log::error('organizerDetails update error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the organizerDetails.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $organizerDetails = OrganizerDetails::with('gender')
                ->findOrFail($id);
            return response()->json($organizerDetails);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving organizerDetails.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrganizerDetailsRequest $request, string $id)
    {
        $validatedData = $request->validated();

        try {
            $organizerDetails = OrganizerDetails::findOrFail($id);
            $organizerDetails->update($validatedData);

            return response()->json(['message' => 'organizerDetails updated successfully', 'organizerDetails' => $organizerDetails], 200);
        } catch (\Exception $e) {
            Log::error('organizerDetails update error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the organizerDetails.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $organizerDetails = OrganizerDetails::findOrFail($id);
            $organizerDetails->is_active = false;
            $organizerDetails->save();

            return response()->json(['message' => 'organizerDetails deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the organizerDetails.'], 500);
        }
    }
}
