<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GenderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $genders = Gender::where('is_active',1)
                                ->paginate(20);
            return response()->json($genders);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving gender.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $data = json_decode($request->form, true);
        $gender = Gender::create($request->all());
        return json_encode($gender);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $gender = Gender::findOrFail($id);
            return response()->json($gender);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving gender.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $gender = Gender::findOrFail($id);
        $gender->update($request->all());

        return json_encode($gender);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $gender = Gender::findOrFail($id);
            $gender->is_active = false;
            $gender->save();

            return response()->json(['message' => 'Gender deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the gender.'], 500);
        }
    }
}
