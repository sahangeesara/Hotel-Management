<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $eventBook = Package::with('packageType')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->get();

            return response()->json($eventBook);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving package.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate request data directly
        $validatedData = $request->validate([
            'name'            => 'required|max:255',
            'description'     => 'nullable|string',
            'package_type_id' => 'required|integer|exists:package_types,id',
            'package_amount'  => 'required|numeric',
        ]);

        try {

            $nextId = Package::max('id') + 1;
            $pckNo = 'PCK' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            // Create and save the new package
            $package = Package::create([
                'name'            => $validatedData['name'],
                'description'     => $validatedData['description'] ?? null,
                'package_type_id' => $validatedData['package_type_id'],
                'package_amount'  => $validatedData['package_amount'],
                'package_code' => $pckNo,
            ]);

            return response()->json(['message' => 'Package created successfully', 'package' => $package], 201);
        } catch (\Exception $e) {
            \Log::error('Package creation error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the package.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $package = Package::with('packageType')
                ->findOrFail($id);
            return response()->json($package);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving package.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate request data directly
        $validatedData = $request->validate([
            'name'            => 'required|max:255',
            'description'     => 'nullable|string',
            'package_type_id' => 'required|integer|exists:package_types,id',
            'package_amount'  => 'required|numeric',
            'package_code' => 'required',
        ]);

        try {

            // Create and save the new package
            $package = Package::findOrFail($id);

            $package->update($validatedData);
            return response()->json(['message' => 'Package created successfully', 'package' => $package], 201);
        } catch (\Exception $e) {
            \Log::error('Package creation error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the package.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $package = Package::findOrFail($id);
            $package->is_active = false;
            $package->save();

            return response()->json(['message' => 'Pakage deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the room book.'], 500);
        }
    }
}
