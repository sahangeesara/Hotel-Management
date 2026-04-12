<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceTypesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $serviceTypes = ServiceType::where('is_active',1)
                ->paginate(20);

            return response()->json($serviceTypes);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Service Type.'], 500);
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
            $serviceType = ServiceType::create($validatedData);
            return response()->json(['message' => 'Service Type created successfully', 'serviceType' => $serviceType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Service Type.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $serviceType = ServiceType::findOrFail($id);
            return response()->json($serviceType);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Service Type.'], 500);
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
            $serviceType = ServiceType::findOrFail($id);
            $serviceType->update($validatedData);
            return response()->json(['message' => 'Service Type update successfully', 'serviceType' => $serviceType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating Service Type.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $serviceType = ServiceType::findOrFail($id);
            $serviceType->is_active =false;
            $serviceType->save();
            return response()->json(['message' => 'Service Type deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Service Type.'], 500);
        }
    }
}
