<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $suppliers = Supplier::with('gender')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);

            return response()->json($suppliers);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while retrieving supplier.'], 500);
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
            'company_name' => 'required',
            'gender_id' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $existingBooking = Supplier::where('nic', $data['nic'])->first();

        // If the booking exists, return an error message or handle the situation as needed
        if ($existingBooking) {  return response()->json(['error' => 'Nic already exists.']); }

        // Generate the 'r_no' based on the next auto-incremented 'id'
        $nextId = Supplier::max('id') + 1; // Get the next available ID
        $supp_no = 'SPN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'supp_no'

        try {
        $supplier =new Supplier();

        $supplier->name = $data['name'];
        $supplier->address = $data['address'];
        $supplier->email = $data['email'];
        $supplier->city = $data['city'];
        $supplier->nic = $data['nic'];
        $supplier->tel_no = $data['tel_no'];
        $supplier->company_name = $data['company_name'];
        $supplier->gender_id = $data['gender_id'];
        $supplier->supp_no =$supp_no;

        $supplier->save();

        return response()->json(['message' => 'Successfully submitted.', $supplier]);

        } catch (\Exception $e) {

            return response()->json(['error' => 'An error occurred while processing the request.', 'exception' => $e->getMessage()]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $supplier = Supplier::with('gender')
                ->findOrFail($id);
            return response()->json($supplier);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while retrieving supplier.'], 500);
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
            'company_name' => 'required',
            'gender_id' => 'required',

        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $existingNic = Supplier::where('nic', $data['nic'])
                                ->where('id', '<>', $id)
                                ->first();
        // If the Nic  exists, return an error message or handle the situation as needed
        if ($existingNic) {  return response()->json(['error' => 'Nic already exists.']); }

        try {
       $supplier =Supplier::findOrFail($id);;

        $supplier->name = $data['name'];
        $supplier->address = $data['address'];
        $supplier->email = $data['email'];
        $supplier->city = $data['city'];
        $supplier->nic = $data['nic'];
        $supplier->tel_no = $data['tel_no'];
        $supplier->company_name = $data['company_name'];
        $supplier->gender_id = $data['gender_id'];
        $supplier->supp_no =$data['supp_no'];

        $supplier->save();
            return response()->json(['message' => 'Successfully Updated.',$supplier]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing the request.', 'exception' => $e->getMessage()]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->is_active = false;
            $supplier->save();

            return response()->json(['message' => 'Supplier deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while deactivating the employee.'], 500);
        }
    }
}
