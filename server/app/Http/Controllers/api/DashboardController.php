<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Guest;
use App\Models\HotelEvent;
use App\Models\Order;
use App\Models\RestaurantEvent;
use App\Models\RoomBook;
use App\Models\TransportBook;
use App\Models\WeddingEvent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function countGuest(){
        $guestsCount = Guest::with(['guide', 'gender'])
            ->where('is_active', 1)
            ->count();

        return response()->json(['guestsCount' =>$guestsCount]);
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

    public function countCustomer()
    {
        $customerCount = Customer::with(['gender'])
            ->where('is_active', 1)
            ->count();

        return response()->json(['customerCount' => $customerCount]);
    }

    public function countRoomBooking(){
        $roomBookingCount = RoomBook::where('is_active', 1)
            ->count();

        return response()->json(['roomBookingCount' =>$roomBookingCount]);
    }


    public function bookingChart(Request $request)
    {
        $type = $request->get('type', 'Month');

        switch ($type) {

            case 'Day':
                $length = Carbon::now()->daysInMonth;
                $field = 'DAY(created_at)';
                break;

            case 'Year':
                $years = range(Carbon::now()->year - 4, Carbon::now()->year);
                return response()->json([
                    'labels' => $years,
                    'datasets' => [
                        [
                            'label' => 'Room Booking',
                            'data' => $this->yearlyData(RoomBook::class, $years),
                        ],
                        [
                            'label' => 'Transport Booking',
                            'data' => $this->yearlyData(TransportBook::class, $years),
                        ],
                        [
                            'label' => 'Hotel Event',
                            'data' => $this->yearlyData(HotelEvent::class, $years),
                        ],
                        [
                            'label' => 'Wedding Event',
                            'data' => $this->yearlyData(WeddingEvent::class, $years),
                        ],
                        [
                            'label' => 'Restaurant Event',
                            'data' => $this->yearlyData(RestaurantEvent::class, $years),
                        ],
                    ]
                ]);

            default:
                $length = 12;
                $field = 'MONTH(created_at)';
                break;
        }

        return response()->json([
            'labels' => $type == 'Day'
                ? range(1, $length)
                : [
                    'Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec'
                ],

            'datasets' => [
                [
                    'label' => 'Room Booking',
                    'data' => $this->chartData(RoomBook::class, $field, $length, $type),
                ],
                [
                    'label' => 'Transport Booking',
                    'data' => $this->chartData(TransportBook::class, $field, $length, $type),
                ],
                [
                    'label' => 'Hotel Event',
                    'data' => $this->chartData(HotelEvent::class, $field, $length, $type),
                ],
                [
                    'label' => 'Wedding Event',
                    'data' => $this->chartData(WeddingEvent::class, $field, $length, $type),
                ],
                [
                    'label' => 'Restaurant Event',
                    'data' => $this->chartData(RestaurantEvent::class, $field, $length, $type),
                ]
            ]
        ]);
    }

    private function chartData($model, $field, $length, $type)
    {
        $query = $model::query();

        if ($type == 'Day') {
            $query->whereMonth('created_at', now()->month);
        } else {
            $query->whereYear('created_at', now()->year);
        }

        $data = $query
            ->selectRaw("$field as period, COUNT(*) total")
            ->groupBy('period')
            ->pluck('total', 'period');

        $result = array_fill(1, $length, 0);

        foreach ($data as $period => $total) {
            $result[$period] = $total;
        }

        return array_values($result);
    }

    private function yearlyData($model, $years)
    {
        $data = $model::selectRaw('YEAR(created_at) year, COUNT(*) total')
            ->groupBy('year')
            ->pluck('total', 'year');

        $result = [];

        foreach ($years as $year) {
            $result[] = $data[$year] ?? 0;
        }

        return $result;
    }

    public function bookingIncome()
    {
        // Room Revenue
        $room = RoomBook::join('packages', 'packages.id', '=', 'room_books.package_id')
            ->whereYear('booking_Date', Carbon::now()->year)
            ->where('room_books.r_book', 'Booking')
            ->sum(DB::raw('packages.package_amount * room_books.number_of_room'));

        // Transport Revenue
        $transport = TransportBook::whereYear('pickup_date', Carbon::now()->year)
            ->sum('total_amount');

        // Hotel Event Revenue
        $hotel = HotelEvent::whereYear('event_date', Carbon::now()->year)
            ->sum('total_amount');

        // Wedding Event Revenue
        $wedding = WeddingEvent::whereYear('event_date', Carbon::now()->year)
            ->sum('total_amount');

        // Restaurant Revenue
        $restaurant = RestaurantEvent::whereYear('event_date', Carbon::now()->year)
            ->sum('total_amount');

        $total = $room + $transport + $hotel + $wedding + $restaurant;

        return response()->json([
            'room' => round($room, 2),
            'transport' => round($transport, 2),
            'hotel' => round($hotel, 2),
            'wedding' => round($wedding, 2),
            'restaurant' => round($restaurant, 2),

            'roomPercent' => $total > 0 ? round(($room / $total) * 100, 2) : 0,
            'transportPercent' => $total > 0 ? round(($transport / $total) * 100, 2) : 0,
            'hotelPercent' => $total > 0 ? round(($hotel / $total) * 100, 2) : 0,
            'weddingPercent' => $total > 0 ? round(($wedding / $total) * 100, 2) : 0,
            'restaurantPercent' => $total > 0 ? round(($restaurant / $total) * 100, 2) : 0,

            'totalIncome' => round($total, 2)
        ]);
    }

}
