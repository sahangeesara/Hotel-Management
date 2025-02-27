<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Employees;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $employees = Employees::with('employeeType','gender')
                                    ->where('is_active',1)
                                    ->orderBy('created_at',"DESC")
                                    ->paginate(20);

            return response()->json($employees);
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
        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
            'address' => 'required',
            'email' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'employee_type_id' => 'required',
            'gender_id' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $existingBooking = Employees::where('nic', $data['nic'])->first();

        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Nic already exists.']); }

        $nextId = Employees::max('id') + 1; // Get the next available ID
        $rNo = 'EN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'r_no'

        $employee =new Employees();

        $employee->name = $data['name'];
        $employee->address = $data['address'];
        $employee->email = $data['email'];
        $employee->city = $data['city'];
        $employee->nic = $data['nic'];
        $employee->tel_no = $data['tel_no'];
        $employee->employee_type_id = $data['employee_type_id'];
        $employee->gender_id = $data['gender_id'];
        $employee->emp_no = $rNo;

        $employee->save();
        return json_encode($employee);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $employees = Employees::with('employeeType','gender')
                                    ->findOrFail($id);
            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }

    public function searchEmployeeByName(string $eName){
        try {
            $employees = Employees::with('employeeType','gender')
                ->where('name', 'like', '%' . $eName . '%')
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }
    public function searchEmployeeByNameAndGender(string $eName,string $gen_id){
        try {
            $employees = Employees::with('employeeType','gender')
                ->where('name', 'like', '%' . $eName . '%')
                ->where('gender_id', $gen_id)
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }
    public function searchEmployeeByNameAndType(string $eName,string $type_id){
        try {
            $employees = Employees::with('employeeType','gender')
                ->where('name', 'like', '%' . $eName . '%')
                ->where('employee_type_id', $type_id)
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }
    public function searchEmployeeByNameAndTypeAndGender(string $eName,string $type_id,string $gen_id){
        try {
            $employees = Employees::with('employeeType','gender')
                ->where('name', 'like', '%' . $eName . '%')
                ->where('employee_type_id', $type_id)
                ->where('gender_id', $gen_id)
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }
    }
    public function searchEmployeeByGender(string $gen_id)
    {
        try {
            $employees = Employees::with('employeeType', 'gender')
                ->where('gender_id', $gen_id)
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }

    }

    public function searchEmployeeByEmType(string $type_id)
    {
        try {
            $employees = Employees::with('employeeType', 'gender')
                ->where('employee_type_id', $type_id)
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving employees.'], 500);
        }

    }
    public function searchEmployeeByEmTypeAndGender(string $type_id,string $gen_id)
    {
        try {
            $employees = Employees::with('employeeType', 'gender')
                ->where('employee_type_id', $type_id)
                ->where('gender_id', $gen_id)
                ->where('is_active', true)
                ->get();

            return response()->json($employees);
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

        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'name' => 'required|max:255',
            'address' => 'required',
            'email' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'employee_type_id' => 'required',
            'gender_id' => 'required',
            'emp_no' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $existingNic = Employees::where('nic', $data['nic'])
                                    ->where('id', '<>', $id)
                                    ->first();
        // If the booking exists, return an error message or handle the situation as needed
        if ($existingNic) {  return response()->json(['error' => 'Nic already exists.']); }

        $employee = Employees::findOrFail($id);

        $employee->name = $data['name'];
        $employee->address = $data['address'];
        $employee->email = $data['email'];
        $employee->city = $data['city'];
        $employee->nic = $data['nic'];
        $employee->tel_no = $data['tel_no'];
        $employee->employee_type_id = $data['employee_type_id'];
        $employee->gender_id = $data['gender_id'];
        $employee->emp_no = $data['emp_no'];

        $employee->save();

        return json_encode($employee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $employee = Employees::findOrFail($id);
            $employee->is_active = false;
            $employee->save();

            return response()->json(['message' => 'Employee deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the employee.'], 500);
        }
    }
}
