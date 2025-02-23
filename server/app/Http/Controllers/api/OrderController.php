<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use App\Models\Order;
use App\Models\OrderItems;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Events\OrderSuccess;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $orders = Order::with('room','guest','orderStatus')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->get();

            $orderItems = OrderItems::with('order','food')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->get();

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
        $data2 = json_decode($request->food, true);
        $validatedData = Validator::make($data, [
            'r_id' => '',
            'guest_id' => 'required',
            'order_date' => 'required',
            'order_amount' => 'required',
            'oder_status_id' => 'required',
        ]);
        if ($validatedData->fails()) {
            return response()->json($validatedData->errors());
        }

        foreach ($data2 as $item) {
            $food = FoodItem::findOrFail($item['id']);
            if ($food->quantity > 0 && $food->quantity <= 10) {
                return response()->json(['error' => 'Quantity not Available']);
            }
        }

        $today = Carbon::now()->format('Y-m-d');
        $orderDate = Carbon::parse($data['order_date']);
        $today = Carbon::parse($today);


        if($orderDate->equalTo($today)) {
        $order =new Order();
        $order->r_id = $data['r_id'] ?? null;
        $order->guest_id = $data['guest_id'];
        $order->order_date = $data['order_date'];
        $order->order_amount = $data['order_amount'];
        $order->order_status_id = $data['oder_status_id'];
        $order->save();
        foreach ($data2 as $item) {
            $orderItem = new OrderItems();
            $orderItem->order_id = $order->id;
            $orderItem->food_id = $item['id'];
            $orderItem->quantity = $item['quantity'];
            $orderItem->order_amount =  $item['quantity']*$item['food_amount']; // Assuming price is provided in the request
            $orderItem->save();

            $food = FoodItem::findOrFail($item['id']);
            if ($food->quantity > 0){
                $food->quantity = $food->quantity - $item['quantity'];
            }
            $food->save();
        }
        broadcast(new OrderSuccess($order->id));
        return json_encode($order);
        }else{
            return (response()->json(['error' => 'Data not valid.']));
        }
    }

    public function countOrder()
    {
        $oneWeekAgo = Carbon::now()->subWeek();

        $orderCount = Order::with(['room', 'guest', 'orderStatus'])
            ->whereBetween('created_at', [$oneWeekAgo, Carbon::now()])
            ->where('is_active', 1)
            ->count();

        return response()->json(['orderCount' => $orderCount]);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $orders = Order::with('room','guest','orderStatus')
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

            'r_id' => '',
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

        $order->r_id = $data['r_id'] ?? null;
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

            $orderItems = OrderItems::where('order_id', $id)->get();
            foreach ($orderItems as $orderItem) {
                $orderItem->is_active = false;
                $orderItem->save();

                $food = FoodItem::findOrFail($orderItem->food_id);
                if ($food->quantity > 0){
                    $food->quantity = $food->quantity + $orderItem->quantity;
                }
                $food->save();

            }
            return response()->json(['message' => 'Order deactivated successfully.'], 200);
        } catch (\Exception $e) {
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deactivating the order.'], 500);
        }
    }
}
