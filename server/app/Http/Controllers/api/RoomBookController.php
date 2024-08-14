<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\RoomBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoomBookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $roomBooks = RoomBook::with(['room', 'guest'])
                ->where('is_active', 1)
                ->paginate(20);


            return response()->json($roomBooks);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);

        $roomBook = RoomBook::create($data);
        return json_encode($roomBook);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $roomBook = RoomBook::findOrFail($id);
            return response()->json($roomBook);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room book.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $roomBook = RoomBook::findOrFail($id);
        $roomBook->update($request->all());

        return json_encode($roomBook);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomBook = RoomBook::findOrFail($id);
            $roomBook->is_active = false;
            $roomBook->save();

            return response()->json(['message' => 'Room Book deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the room book.'], 500);
        }
    }
}
