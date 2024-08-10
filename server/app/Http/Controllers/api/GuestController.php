<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $guest = Guest::create($data);
        return json_encode($guest);
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

            return response()->json(['message' => 'Guest deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the guest.'], 500);
        }
    }
}
