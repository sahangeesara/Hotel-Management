<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CurrenciesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $currency = Currency::where('is_active',1)
                ->paginate(20);

            return response()->json($currency);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving currency.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'currency' => 'required|max:255',
        ]);
        // Create and save the new nationality
        try{
            $currency = Currency::create($validatedData);
            return response()->json(['message' => 'Currency created successfully', 'currency' => $currency], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding currency.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $currency = Currency::findOrFail($id);
            return response()->json($currency);
        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving currency.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'currency' => 'required|max:255',
        ]);
        // Create and save the new currency
        try{
            $currency = Currency::findOrFail($id);
            $currency->update($validatedData);
            return response()->json(['message' => 'Currency created successfully', 'currency' => $currency], 201);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while adding currency.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $currency = Currency::findOrFail($id);
            $currency->is_active =false;
            $currency->save();
            return response()->json(['message' => 'Currency deactivated successfully.'], 200);

        }catch (\Exception $e){
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Currency.'], 500);
        }
    }
}
