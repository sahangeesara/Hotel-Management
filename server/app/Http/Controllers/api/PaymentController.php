<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\HotelEvent;
use App\Models\Payment;
use App\Models\RestaurantEvent;
use App\Models\RoomBook;
use App\Models\WeddingEvent;
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


    public function getPaymentByPerson(Request $request)
    {
        try {
            $type = $request->query('type'); // 'guest', 'customer', or 'organizer'
            $id = $request->query('id');

            if (!in_array($type, ['guest', 'customer', 'organizer'])) {
                return response()->json(['message' => 'Invalid type provided'], 400);
            }

            $query = Payment::with([
                'customer',
                'guest',
                'paymentMethod',
                'paymentStatus',
                'order',
                'roomBook'
            ]);

            if ($type === 'guest') {
                $query->where('guest_id', $id);
            } elseif ($type === 'customer') {
                $query->where('customer_id', $id);
            } elseif ($type === 'organizer') {
                $query->where('organizer_id', $id);
            }

            // Safe query fetch
            $payment = $query->first();

            // Calculate totals for bookings/events even if no direct payment row exists
            $totalEventOrBookingAmount = 0;
            $relatedDetails = [];

            if ($type === 'guest') {
                $roomBookings = RoomBook::where('guest_id', $id)->get();
                $totalEventOrBookingAmount += $roomBookings->sum('total_amount');
                $relatedDetails['room_bookings'] = $roomBookings;
            } elseif ($type === 'organizer') {
                $hotelEvents = HotelEvent::where('organizer_id', $id)->get();
                $restaurantEvents = RestaurantEvent::where('organizer_id', $id)->get();
                $weddingEvents = WeddingEvent::where('organizer_id', $id)->get();

                $totalEventOrBookingAmount += $hotelEvents->sum('total_amount');
                $totalEventOrBookingAmount += $restaurantEvents->sum('total_amount');
                $totalEventOrBookingAmount += $weddingEvents->sum('total_amount');

                $relatedDetails['hotel_events'] = $hotelEvents;
                $relatedDetails['restaurant_events'] = $restaurantEvents;
                $relatedDetails['wedding_events'] = $weddingEvents;
            }

            $grandTotal = ($payment ? $payment->amount : 0) + $totalEventOrBookingAmount;

            return response()->json([
                'success' => true,
                'data' => $payment,
                'calculated_totals' => [
                    'direct_payment_amount' => $payment?->amount ?? 0,
                    'bookings_events_total' => $totalEventOrBookingAmount,
                    'grand_total' => $grandTotal
                ],
                'related_records' => $relatedDetails
            ]);
        } catch (\Exception $e) {
            Log::error('getPaymentByPerson error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching person payment details.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function downloadPdf(Request $request)
    {
        try {
            $type = $request->query('type');
            $id = $request->query('id');

            $payment = Payment::with(['customer', 'guest', 'paymentMethod', 'paymentStatus'])->where("{$type}_id", $id)->first();

            // Fetch related totals based on type safely
            $roomBookings = ($type === 'guest') ? RoomBook::where('guest_id', $id)->get() : collect();
            $hotelEvents = ($type === 'organizer') ? HotelEvent::where('organizer_id', $id)->get() : collect();
            $restaurantEvents = ($type === 'organizer') ? RestaurantEvent::where('organizer_id', $id)->get() : collect();
            $weddingEvents = ($type === 'organizer') ? WeddingEvent::where('organizer_id', $id)->get() : collect();

            // Calculate Grand Total including total amounts from events/rooms
            $totalAmountSum = $payment?->amount ?? 0;
            $totalAmountSum += $roomBookings->sum('total_amount');
            $totalAmountSum += $hotelEvents->sum('total_amount');
            $totalAmountSum += $restaurantEvents->sum('total_amount');
            $totalAmountSum += $weddingEvents->sum('total_amount');

            $data = compact('payment', 'type', 'roomBookings', 'hotelEvents', 'restaurantEvents', 'weddingEvents', 'totalAmountSum');

            return response()->json(['success' => true, 'total_calculated' => $totalAmountSum, 'data' => $data]);
        } catch (\Exception $e) {
            Log::error('downloadPdf error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating PDF summary.'
            ], 500);
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
