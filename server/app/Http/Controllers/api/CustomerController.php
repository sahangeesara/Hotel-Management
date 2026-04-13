<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $customers = Customer::with('gender','countryCode','country')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);

            return response()->json($customers);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving customer.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $data = $request->all(); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'name' => 'required',
            'address' => 'required',
            'city' => 'required',
            'nic' => 'required|unique:customers,nic',
            'email' => 'required|email',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country_id' => 'required',
            'cuntry_code_id' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $nextId = Customer::max('id') + 1; // Get the next available ID
        $cNo = 'CN' . str_pad($nextId, 5, '0', STR_PAD_LEFT); // Generate the 'custom_no'

        try {

            $customer = new Customer();
            $customer->name = $data['name'];
            $customer->address = $data['address'];
            $customer->email = $data['email'];
            $customer->city = $data['city'];
            $customer->nic = $data['nic'];
            $customer->tel_no = $data['tel_no'];
            $customer->gender_id = $data['gender_id'];
            $customer->country_id = $data['country_id'];
            $customer->cuntry_code_id = $data['cuntry_code_id'];
            $customer->custom_type = $data['custom_type'];
            $customer->custom_no = $cNo;

            $customer->save();


            return response()->json(['message' => 'Successfully submitted.', 'Customer' => $customer]);
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
            $customer = Customer::with('gender','countryCode','country')
                ->findOrFail($id);
            return response()->json($customer);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving customer.'], 500);
        }
    }

    public function countCustomer()
    {
        $customerCount = Customer::with(['gender'])
            ->where('is_active', 1)
            ->count();

        return response()->json(['customerCount' => $customerCount]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->all(); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'name' => 'required',
            'address' => 'required',
            'city' => 'required',
            'nic' => 'required|unique:customers,nic,'.$id,
            'email' => 'required|email',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country_id' => 'required',
            'cuntry_code_id' => 'required',
            'custom_no' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        try {

            $customer =Customer::findOrFail($id);
            $customer->name = $data['name'];
            $customer->address = $data['address'];
            $customer->city = $data['city'];
            $customer->nic = $data['nic'];
            $customer->tel_no = $data['tel_no'];
            // Set guide_id to null if empty
            $customer->gender_id = $data['gender_id'];
            $customer->country_id = $data['country_id'];
            $customer->cuntry_code_id = $data['cuntry_code_id'];            $customer->custom_no = $data['custom_no'];
            $customer->custom_type = $data['custom_type'];

            $customer->save();


            return response()->json(['message' => 'Successfully Updated.', 'customer' => $customer]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'An error occurred while processing the request.', 'exception' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $guest = Customer::findOrFail($id);
            $guest->is_active = false;
            $guest->save();

            return response()->json(['message' => 'Customer deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the Customer.'], 500);
        }
    }
}
