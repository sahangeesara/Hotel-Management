<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $orders = Order::with('room','guest','oderStatus','food')
                ->where('is_active',1)
                ->paginate(20);

            return response()->json($orders);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving orders.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'r_id' => 'required',
            'guest_id' => 'required',
            'order_date' => 'required',
            'order_amount' => 'required',
            'oder_status_id' => 'required',
            'food_id' => 'required',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $order =new Order();
        $order->r_id = $data['r_id'];
        $order->guest_id = $data['guest_id'];
        $order->order_date = $data['order_date'];
        $order->order_amount = $data['order_amount'];
        $order->oder_status_id = $data['oder_status_id'];
        $order->food_id = $data['food_id'];
        $order->save();

        return json_encode($order);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $orders = Order::with('room','guest','oderStatus','food')
                            ->findOrFail($id);
            return response()->json($orders);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving order.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $data = json_decode($request->form, true);
        $validatedData = Validator::make($data, [

            'r_id' => 'required',
            'guest_id' => 'required',
            'order_date' => 'required',
            'order_amount' => 'required',
            'oder_status_id' => 'required',
            'food_id' => 'required',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }
        $order =Order::findOrFail($id);

        $order->r_id = $data['r_id'];
        $order->guest_id = $data['guest_id'];
        $order->order_date = $data['order_date'];
        $order->order_amount = $data['order_amount'];
        $order->oder_status_id = $data['oder_status_id'];
        $order->food_id = $data['food_id'];
        $order->save();

        return json_encode($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->is_active = false;
            $order->save();

            return response()->json(['message' => 'Order deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the order.'], 500);
        }
    }
}
