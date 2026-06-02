<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RoomSetup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoomSetupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $roomSetup = RoomSetup::where('is_active', 1)
                ->get();
            return response()->json($roomSetup);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving roomSetup.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);

        try{

            $roomSetup =new RoomSetup();
            $roomSetup->name = $validatedData['name'];
            $roomSetup->save();

            return response()->json(['message'=>'Successfully submitted.', 'roomSetup'=>$roomSetup],200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving roomSetup.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $roomSetup = RoomSetup::findOrFail($id);
            return response()->json($roomSetup);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving roomSetup.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);

        try{
            $roomSetup = RoomSetup::findOrFail($id);
            $roomSetup->name = $validatedData['name'];
            $roomSetup->save();

            return response()->json(['message'=>'Successfully updated.', 'roomSetup'=>$roomSetup],200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving roomSetup.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomSetup = RoomSetup::findOrFail($id);
            $roomSetup->is_active = false;
            $roomSetup->save();

            return response()->json(['message' => 'roomSetup deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the roomSetup.'], 500);
        }
    }
}
