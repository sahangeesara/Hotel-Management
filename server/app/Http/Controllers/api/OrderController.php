<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $order = Order::create($data);
        return json_encode($order);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $orders = Order::findOrFail($id);
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

//        info($request->request->all());
//        info($id);

        $data = json_decode($request->form, true);
        $order = Order::findOrFail($id);
        $order->update($data);

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
