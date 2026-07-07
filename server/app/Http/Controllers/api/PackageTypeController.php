<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\PackageType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PackageTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $packageTypes = PackageType::where('is_active',1)
                ->paginate(20);

            return response()->json($packageTypes);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving package Type.'], 500);
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
            $packageType = PackageType::create($validatedData);
            return response()->json(['message' => 'package Type created successfully', 'packageType' => $packageType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating package Type.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $packageType = PackageType::findOrFail($id);
            return response()->json($packageType);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving package Type.'], 500);
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
            $packageType = PackageType::findOrFail($id);
            $packageType->update($validatedData);
            return response()->json(['message' => 'Package Type update successfully', 'packageType' => $packageType], 201);
        }catch(\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating package Type.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $packageType = PackageType::findOrFail($id);
            $packageType->is_active =false;
            $packageType->save();
            return response()->json(['message' => 'package Type deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the package Type.'], 500);
        }
    }
}
