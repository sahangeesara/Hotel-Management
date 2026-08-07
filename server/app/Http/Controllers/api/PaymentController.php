<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $payment = Payment::with('customer','paymentMethod','currency','paymentStatus','weddingEvent','hotelEvent','roomBook', 'restaurantEvent','order','guest','countryCode','customer')
                ->where('is_active',1)
                ->orderBy('created_at',"DESC")
                ->paginate(20);

            return response()->json($payment);
        }catch (\Exception $e){
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving payment.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * @throws \Throwable
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'payment_method_id' => 'required',
            'payment_status_id' => 'required',
            'amount' => 'required',
            'customer_id' => 'nullable',
            'guest_id' => 'nullable',
            'order_id' => 'nullable',
            'hotel_event_id' => 'nullable',
            'restaurant_event_id' => 'nullable',
            'wedding_event_id' => 'nullable',
            'room_book_id' => 'nullable',
            'payment_date' => 'required',
            'payment_type' => 'required',
            'payment_note' => 'nullable',

        ]);


        $nextId = Payment::max('id') + 1;
        $payNo = 'PYK' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        DB::beginTransaction();

        $currency_name = "LKR";

        $currency_id = Currency::where('currency', $currency_name)->value('id');


        try {

            $payment = new Payment();
            $payment->payment_no = $payNo;
            $payment->payment_method_id = $validatedData['payment_method_id'];
            $payment->payment_status_id = $validatedData['payment_status_id'];
            $payment->amount = $validatedData['amount'];
            $payment->customer_id = $validatedData['customer_id'] ?? null;
            $payment->guest_id = $validatedData['guest_id'] ?? null;
            $payment->order_id = $validatedData['order_id'] ?? null;
            $payment->hotel_event_id = $validatedData['hotel_event_id'] ?? null;
            $payment->restaurant_event_id = $validatedData['restaurant_event_id'] ?? null;
            $payment->wedding_event_id = $validatedData['wedding_event_id'] ?? null;
            $payment->room_book_id = $validatedData['room_book_id'] ?? null;
            $payment->payment_date = $validatedData['payment_date'];
            $payment->payment_type = $validatedData['payment_type'];
            $payment->currency_id = $currency_id;
            $payment->payment_note = $validatedData['payment_note'] ?? null;

            // Save the payment
            $payment->save();

            DB::commit();

            return response()->json($payment, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while creating payment.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $payment = Payment::with('customer','paymentMethod','currency','paymentStatus','weddingEvent','hotelEvent','roomBook', 'restaurantEvent','order','guest','countryCode','customer')
                                ->findOrFail($id);

            return response()->json($payment);
        }catch (\Exception $e){
            // Log the error and return an appropriate response
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving payment.'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'payment_method_id'   => 'required',
            'payment_status_id'   => 'required',
            'amount'              => 'required',
            'customer_id'         => 'nullable',
            'guest_id'            => 'nullable',
            'order_id'            => 'nullable',
            'hotel_event_id'      => 'nullable',
            'restaurant_event_id' => 'nullable',
            'wedding_event_id'    => 'nullable',
            'room_book_id'        => 'nullable',
            'payment_date'        => 'required',
            'payment_type'        => 'required',
            'payment_note'        => 'nullable',
            'payment_no'          => 'required',
            'currency_id'         => 'nullable',
        ]);

        try {
            $payment = Payment::findOrFail($id);

            // Get LKR currency ID
            $currency_id = Currency::where('name', 'LKR')->value('id');

            // Add currency_id to update data
            $validatedData['currency_id'] = $currency_id;

            $payment->update($validatedData);

            return response()->json($payment);

        } catch (\Exception $e) {

            Log::error('Payment update failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while updating payment.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->is_active = false;
            $payment->save();

            return response()->json(['message' => 'Payment destroy successfully.']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting payment.'], 500);
        }
    }
}
