<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\CountryCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CountryCodesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $countryCords = CountryCode::with('country')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($countryCords);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving Country code.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'country_id' => 'required',
            'cuntry_code' => 'required',
        ]);
        // Create and save the new country code
        try{
            $countryCode = CountryCode::create($validatedData);
            return response()->json(['message' => 'Country Code update successfully', 'countryCode' => $countryCode], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding country code.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $nationality = CountryCode::findOrFail($id);
            return response()->json($nationality);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving cuntry code.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'country_id' => 'required',
            'cuntry_code' => 'required',
        ]);
        // update and save the new country code
        try{
            $countryCode = CountryCode::create($validatedData);
            return response()->json(['message' => 'Nationality created successfully', 'countryCode' => $countryCode], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding country code.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $countryCode = CountryCode::findOrFail($id);
            $countryCode->is_active =false;
            $countryCode->save();
            return response()->json(['message' => 'Cuntry Code deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Country Code.'], 500);
        }
    }
}
