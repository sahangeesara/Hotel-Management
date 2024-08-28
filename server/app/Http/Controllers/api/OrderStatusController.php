<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Order_status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $orderStatus = Order_status::where('is_active',1)
                ->paginate(20);

            return response()->json($orderStatus);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving order status.'], 500);
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
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        $orderStatus =new Order_status();
        $orderStatus->name=$data['name'];
        $orderStatus->save();

        return response()->json(['message' => 'Order status Add successfully.',$orderStatus]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $orderStatus = Order_status::findOrFail($id);
            return response()->json($orderStatus);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving order status.'], 500);
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
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $orderStatus = Order_status::findOrFail($id);
        $orderStatus->name=$data['name'];
        $orderStatus->save();

        return response()->json(['message' => 'Order status Update successfully.',$orderStatus]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $orderStatus = Order_status::findOrFail($id);
            $orderStatus->is_active = false;
            $orderStatus->save();

            return response()->json(['message' => 'Order status deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the order status.'], 500);
        }
    }
}
