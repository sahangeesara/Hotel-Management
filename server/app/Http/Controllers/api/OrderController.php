<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use App\Models\Order;
use App\Models\OrderItems;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            $orders = Order::with(['room','guest','orderStatus','OrderItems.order'])
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
     * @throws \Throwable
     */
    public function store(Request $request)
    {
        $data = json_decode($request->form, true);
        $foods = json_decode($request->food, true);

        $validator = Validator::make($data, [
            'r_id' => 'nullable|exists:rooms,id',
            'guest_id' => 'required|exists:guests,id',
            'order_date' => 'required|date',
            'order_amount' => 'required|numeric',
            'order_status_id' => 'required|exists:order_statuses,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $today = Carbon::today();
        $orderDate = Carbon::parse($data['order_date']);

        if (!$orderDate->isSameDay($today)) {
            return response()->json([
                'message' => 'Orders can only be placed for today.'
            ], 422);
        }

        foreach ($foods as $item) {

            $food = FoodItem::find($item['id']);

            if (!$food) {
                return response()->json([
                    'message' => 'Food item not found.'
                ], 404);
            }

            if ($food->quantity < $item['quantity']) {
                return response()->json([
                    'message' => $food->name . ' stock is not available.'
                ], 422);
            }
        }

        DB::beginTransaction();

        try {

            $nextId = (Order::max('id') ?? 0) + 1;

            $orderNo = 'ODN' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $order = new Order();
            $order->order_no = $orderNo;
            $order->r_id = $data['r_id'] ?? null;
            $order->guest_id = $data['guest_id'];
            $order->order_date = $data['order_date'];
            $order->order_amount = $data['order_amount'];
            $order->order_status_id = $data['order_status_id'];
            $order->is_active = 1;
            $order->save();

            foreach ($foods as $item) {

                $food = FoodItem::find($item['id']);

                $orderItem = new OrderItems();
                $orderItem->order_id = $order->id;
                $orderItem->food_id = $food->id;
                $orderItem->quantity = $item['quantity'];
                $orderItem->order_amount = $item['quantity'] * $item['food_amount'];
                $orderItem->is_active = 1;
                $orderItem->save();

                $food->quantity -= $item['quantity'];
                $food->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully.',
                'order' => Order::with('room', 'guest', 'orderStatus')
                    ->find($order->id)
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while creating the order.',
                'error' => $e->getMessage()
            ], 500);
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
     * @throws \Throwable
     */
    public function update(Request $request, string $id)
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

        DB::beginTransaction();
        try {
            if($orderDate->equalTo($today)) {
                $order =Order::findOrFail($id);
                $order->r_id = $data['r_id'] ?? null;
                $order->guest_id = $data['guest_id'];
                $order->order_date = $data['order_date'];
                $order->order_amount = $data['order_amount'];
                $order->order_status_id = $data['oder_status_id'];
                $order->order_no = $data['order_no'];
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
                DB::commit();
                return json_encode($order);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving order.'], 500);
        }
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
