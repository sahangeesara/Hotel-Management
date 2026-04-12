<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\TourType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TourTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $tourTypes = TourType::where('is_active',1)
                ->paginate(20);

            return response()->json($tourTypes);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Tour Type.'], 500);
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
        try {
            $tourType = TourType::create($validatedData);
            return response()->json(['message' => 'tour Type created successfully', 'tourType' => $tourType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Tour Type.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $tourType = TourType::findOrFail($id);
            return response()->json($tourType);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Tour Type.'], 500);
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
        try {
            $tourType = TourType::findOrFail($id);
            $tourType->update($validatedData);
            return response()->json(['message' => 'tour Type update successfully', 'tourType' => $tourType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Tour Type.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $tourType = TourType::findOrFail($id);
            $tourType->is_active =false;
            $tourType->save();
            return response()->json(['message' => 'Tour Type deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Tour Type.'], 500);
        }
    }
}
