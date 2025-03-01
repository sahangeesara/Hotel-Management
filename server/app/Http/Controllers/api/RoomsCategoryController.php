<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Rooms_category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RoomsCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $roomsCategories = Rooms_category::where('is_active',1)
                                                ->paginate(20);

            return response()->json($roomsCategories);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving  room category.'], 500);
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
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        try {
            $roomsCategory = new Rooms_category();
            $roomsCategory->name = $data['name'];
            $roomsCategory->save();
            return json_encode($roomsCategory);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room category.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $roomsCategory = Rooms_category::findOrFail($id);
            return response()->json($roomsCategory);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving  room category.'], 500);
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
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        try {
            $roomsCategory = Rooms_category::findOrFail($id);
            $roomsCategory->name = $data['name'];
            $roomsCategory->save();

            return json_encode($roomsCategory);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving room category.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomsCategory = Rooms_category::findOrFail($id);
            $roomsCategory->is_active = false;
            $roomsCategory->save();

            return response()->json(['message' => 'Room category deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the room category.'], 500);
        }
    }
}
