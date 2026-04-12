<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\VehicleType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VehicleTypesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $vehicleTypes = VehicleType::where('is_active',1)
                ->paginate(20);

            return response()->json($vehicleTypes);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving vehicle Type.'], 500);
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
            $vehicleType = VehicleType::create($validatedData);
            return response()->json(['message' => 'Vehicle Type created successfully', 'vehicleType' => $vehicleType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Vehicle Type.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $vehicleType = VehicleType::findOrFail($id);
            return response()->json($vehicleType);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Vehicle Type.'], 500);
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
            $vehicleType = VehicleType::findOrFail($id);
            $vehicleType->update($validatedData);
            return response()->json(['message' => 'vehicle Type update successfully', 'vehicleType' => $vehicleType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Vehicle Type.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $vehicleType = VehicleType::findOrFail($id);
            $vehicleType->is_active =false;
            $vehicleType->save();
            return response()->json(['message' => 'Vehicle Type deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Vehicle Type.'], 500);
        }
    }
}
