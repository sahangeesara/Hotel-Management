<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\HotelEvent;
use App\Models\Order;
use App\Models\Payment;
use App\Models\RestaurantEvent;
use App\Models\RoomBook;
use App\Models\WeddingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;


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


    public function getPaymentByPerson($type, $id)
    {
        try {
            if (!in_array($type, ['guest', 'customer', 'organizer'])) {
                return response()->json(['message' => 'Invalid type provided'], 400);
            }

            $totalAmount = 0;
            $relatedDetails = [];

            $query = Payment::with(['paymentStatus', 'paymentMethod', 'currency']);

            if ($type === 'guest') {
                $query->where('guest_id', $id);
                $roomBookings = RoomBook::with(['hotel', 'package'])->where('guest_id', $id)->get();
                $totalAmount += $roomBookings->sum('total_amount');
                $relatedDetails['room_bookings'] = $roomBookings;
            } elseif ($type === 'organizer') {
                $query->where('organizer_id', $id);
                $hotelEvents = HotelEvent::with(['hotel', 'package'])->where('organizer_id', $id)->get();
                $restaurantEvents = RestaurantEvent::with(['hotel', 'package'])->where('organizer_id', $id)->get();
                $weddingEvents = WeddingEvent::with(['hotel', 'package'])->where('organizer_id', $id)->get();

                $totalAmount += $hotelEvents->sum('total_amount');
                $totalAmount += $restaurantEvents->sum('total_amount');
                $totalAmount += $weddingEvents->sum('total_amount');

                $relatedDetails['hotel_events'] = $hotelEvents;
                $relatedDetails['restaurant_events'] = $restaurantEvents;
                $relatedDetails['wedding_events'] = $weddingEvents;
            } elseif ($type === 'customer') {
                $query->where('customer_id', $id);
                $orders = Order::with(['room', 'orderStatus'])->where('customer_id', $id)->get();
                $totalAmount += $orders->sum('order_amount');
                $relatedDetails['orders'] = $orders;
            }

            $payment = $query->first();

            return response()->json([
                'success' => true,
                'data' => $payment ? $payment : [
                    'payment_no' => 'PAY-' . strtoupper($type) . '-' . str_pad($id, 4, '0', STR_PAD_LEFT),
                    'payment_date' => now(),
                    'amount' => $totalAmount,
                ],
                'related_records' => $relatedDetails
            ]);
        } catch (\Exception $e) {
            Log::error('getPaymentByPerson error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function downloadPaymentPdf(string $type, int $id)
    {
        try {

            // Get payment based on selected person
            $payment = Payment::where(function ($query) use ($type, $id) {

                if ($type === 'guest') {

                    $query->where('guest_id', $id);

                } elseif ($type === 'customer') {

                    $query->where('customer_id', $id);

                } elseif ($type === 'organizer') {

                    $query->where('organizer_id', $id);

                }

            })
                ->where('is_active', true)
                ->latest()
                ->first();


            if (!$payment) {

                return response()->json([
                    'message' => 'Payment not found.'
                ], 404);
            }


            // Get related records
            $relatedRecords = $this->getRelatedRecords(
                $type,
                $id
            );


            // Generate PDF
            $pdf = Pdf::loadView(
                'reports.payment-report',
                [
                    'payment' => $payment,
                    'relatedRecords' => $relatedRecords,
                    'type' => $type,
                    'personId' => $id
                ]
            );


            return $pdf->download(
                $type . '-payment-report.pdf'
            );

        } catch (\Exception $e) {

            Log::error(
                'Payment PDF generation failed: ' .
                $e->getMessage()
            );


            return response()->json([
                'message' => 'Failed to generate payment PDF.',
                'error' => $e->getMessage()
            ], 500);
        }
    }    /**
     * Store a newly created resource in storage.
     * @throws \Throwable
     */
    public function store(Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|exists:payment_methods,id',
            'payment_status_id' => 'required|exists:payment_statuses,id',
            'amount' => 'required|numeric',
            'discount' => 'required|numeric',
            'payment_type' => 'required|in:guest,customer,organizer',
        ]);

        try {
            $nextId = (Payment::max('id') ?? 0) + 1;
            $paymentNo = 'PAY-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $payment = new Payment();
            $payment->payment_no = $paymentNo;
            $payment->payment_date = now();
            $payment->amount = $request->amount;
            $payment->discount = $request->discount;
            $payment->payment_method_id = $request->payment_method_id;
            $payment->payment_status_id = $request->payment_status_id;
            $payment->payment_type = $request->payment_type;

            if ($request->payment_type === 'guest') {
                $payment->guest_id = $request->guest_id;
            } elseif ($request->payment_type === 'customer') {
                $payment->customer_id = $request->customer_id;
            } elseif ($request->payment_type === 'organizer') {
                $payment->organizer_id = $request->organizer_id;
            }

            $payment->is_active = true;
            $payment->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment created successfully.',
                'data' => $payment
            ], 201);

        } catch (\Exception $e) {
            Log::error('Payment store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error saving payment.',
                'error' => $e->getMessage()
            ], 500);
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
            'discount'              => 'required',
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
