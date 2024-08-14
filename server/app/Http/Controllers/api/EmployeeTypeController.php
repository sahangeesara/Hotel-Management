<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Employee_type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmployeeTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $employeeTypes = Employee_type::where('is_active', 1)
                                            ->paginate(20);
            return response()->json($employeeTypes);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees Type.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $employeeType = Employee_type::create($data);
        return json_encode($employeeType);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $employeeType = Employee_type::findOrFail($id);
            return response()->json($employeeType);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees Type.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        info('type'.$request->all());
//        $employeeType = Employee_type::findOrFail($id);
//        $employeeType->update($request->all());
//
//        return json_encode($employeeType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $employeeType = Employee_type::findOrFail($id);
            $employeeType->is_active = false;
            $employeeType->save();

            return response()->json(['message' => 'Employee type deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the employee type.'], 500);
        }
    }
}
