<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Food_status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FoodStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $foodStatus = Food_status::where('is_active',1)
                ->paginate(20);

            return response()->json($foodStatus);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $foodStatus = Food_status::create($data);
        return json_encode($foodStatus);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $foodStatus = Food_status::findOrFail($id);
            return response()->json($foodStatus);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

//        info($request->request->all());
//        info($id);

        $data = json_decode($request->form, true);
        $foodStatus = Food_status::findOrFail($id);
        $foodStatus->update($data);

        return json_encode($foodStatus);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $foodStatus = Food_status::findOrFail($id);
            $foodStatus->is_active = false;
            $foodStatus->save();

            return response()->json(['message' => 'Employee deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the employee.'], 500);
        }
    }
}
