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
       ;
        try {
            $customers = Customer::with('user','gender')
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
        $data = json_decode($request->form, true); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'user_id' => 'required',
            'address' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $validatedData = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        try {

            $customer = new Customer();
            $customer->user_id = $data['user_id'];
            $customer->address = $data['address'];
            $customer->city = $data['city'];
            $customer->nic = $data['nic'];
            $customer->tel_no = $data['tel_no'];
            $customer->gender_id = $data['gender_id'];
            $customer->country = $data['country'];
            $customer->image = $request->file('image')->store('public/customer/images');

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
            $customer = Customer::with('user','gender')
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
        $customerCount = Customer::with(['user', 'gender'])
            ->where('is_active', 1)
            ->count();

        return response()->json(['customerCount' => $customerCount]);
    }
    public function athCustomer()
    {
        $id=  Auth::user()->id;
        try {
            $customer = Customer::with('user','gender')
                ->findOrFail($id);
            return response()->json($customer);

        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving customer.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = json_decode($request->form, true); // Decode JSON data from request

        // Validate request data
        $validatedData = Validator::make($data, [
            'user_id' => 'required',
            'address' => 'required',
            'city' => 'required',
            'nic' => 'required',
            'tel_no' => 'required',
            'gender_id' => 'required',
            'country' => 'required',
        ]);

        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $validatedData = Validator::make($request->all(), [
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        try {

            $customer =Customer::findOrFail($id);
            $customer->user_id = $data['user_id'];
            $customer->address = $data['address'];
            $customer->city = $data['city'];
            $customer->nic = $data['nic'];
            $customer->tel_no = $data['tel_no'];
            // Set guide_id to null if empty
            $customer->gender_id = $data['gender_id'];
            $customer->country = $data['country'];
            if ($request->hasFile('image')) {
                // Delete the existing image if necessary
                if ($customer->image) {
                    Storage::delete($customer->image);
                }

                $customer->image = $request->file('image')->store('public/customer/images');
            }
            $customer->save();


            return response()->json(['message' => 'Successfully submitted.', 'customer' => $customer]);
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
