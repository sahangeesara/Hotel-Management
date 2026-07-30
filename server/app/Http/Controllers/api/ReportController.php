<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookingRooms;
use App\Models\HotelEvent;
use App\Models\Order;
use App\Models\OrderItems;
use App\Models\RestaurantEvent;
use App\Models\RoomBook;
use App\Models\TransportBook;
use App\Models\WeddingEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function monthlyBookingReport()
    {
        // Total Bookings
        $bookings = RoomBook::select(
            DB::raw('MONTH(booking_Date) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('booking_Date', date('Y'))
            ->where('r_book', 'Booking')
            ->groupBy(DB::raw('MONTH(booking_Date)'))
            ->pluck('total', 'month');


        $cancelled = RoomBook::select(
            DB::raw('MONTH(cancel_Date) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->whereNotNull('cancel_Date')
            ->where('r_book', 'Canceling')
            ->whereYear('cancel_Date', date('Y'))
            ->groupBy(DB::raw('MONTH(cancel_Date)'))
            ->pluck('total', 'month');

        $months = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        $totalBookings = [];
        $cancelBookings = [];

        for ($i = 1; $i <= 12; $i++) {
            $totalBookings[] = $bookings[$i] ?? 0;
            $cancelBookings[] = $cancelled[$i] ?? 0;
        }

        return response()->json([
            'labels' => $months,
            'totalBookings' => $totalBookings,
            'cancelBookings' => $cancelBookings
        ]);
    }
    public function bookingTrendReport
    ()
    {
        $data = BookingRooms::select(
            'rooms_categories.name as room_type',
            DB::raw('MONTH(room_books.booking_Date) as month'),
            DB::raw('COUNT(booking_rooms.id) as total')
        )
            ->join('room_books', 'room_books.id', '=', 'booking_rooms.booking_id')
            ->join('rooms_categories', 'rooms_categories.id', '=', 'booking_rooms.room_category_id')
            ->where('room_books.r_book', 'Booking')
            ->whereYear('room_books.booking_Date', date('Y'))
            ->groupBy(
                'rooms_categories.name',
                DB::raw('MONTH(room_books.booking_Date)')
            )
            ->orderBy('month')
            ->get();


        $months = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];


        $categories = $data->pluck('room_type')->unique();


        $datasets = [];


        foreach ($categories as $category) {

            $values = [];

            for($i=1;$i<=12;$i++){

                $record = $data
                    ->where('room_type',$category)
                    ->where('month',$i)
                    ->first();

                $values[] = $record ? $record->total : 0;
            }


            $datasets[] = [
                'label'=>$category,
                'data'=>$values
            ];
        }


        return response()->json([
            'labels'=>$months,
            'datasets'=>$datasets
        ]);
    }

    public function ordersReport()
    {
        $data = OrderItems::select(
            'item__categories.name as category',
            DB::raw('MONTH(orders.order_date) as month'),
            DB::raw('SUM(order_items.quantity) as total')
        )
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('food_items', 'food_items.id', '=', 'order_items.food_id')
            ->join('item__categories', 'item__categories.id', '=', 'food_items.item_category_id')
            ->whereYear('orders.order_date', date('Y'))
            ->where('orders.is_active', 1)
            ->groupBy(
                'item__categories.name',
                DB::raw('MONTH(orders.order_date)')
            )
            ->orderBy(DB::raw('MONTH(orders.order_date)'))
            ->get();

        $months = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        $categories = $data->pluck('category')->unique();

        $colors = [
            'rgba(255,206,86,0.8)',
            'rgba(75,192,192,0.8)',
            'rgba(255,99,132,0.8)',
            'rgba(54,162,235,0.8)',
            'rgba(153,102,255,0.8)',
            'rgba(255,159,64,0.8)',
            'rgba(201,203,207,0.8)'
        ];

        $datasets = [];
        $colorIndex = 0;

        foreach ($categories as $category) {

            $values = [];

            for ($i = 1; $i <= 12; $i++) {

                $record = $data
                    ->where('category', $category)
                    ->where('month', $i)
                    ->first();

                $values[] = $record ? (int)$record->total : 0;
            }

            $datasets[] = [
                'label' => $category,
                'data' => $values,
                'backgroundColor' => $colors[$colorIndex % count($colors)]
            ];

            $colorIndex++;
        }

        return response()->json([
            'labels' => $months,
            'datasets' => $datasets
        ]);
    }

    public function eventBookingReport()
    {
        $weddingCount = WeddingEvent::where('is_active', 1)->count();

        $hotelCount = HotelEvent::where('is_active', 1)->count();

        $restaurantCount = RestaurantEvent::where('is_active', 1)->count();

        return response()->json([
            'labels' => [
                'Wedding Events',
                'Hotel Events',
                'Restaurant Events'
            ],
            'data' => [
                $weddingCount,
                $hotelCount,
                $restaurantCount
            ]
        ]);
    }

    public function transportVehicleReport()
    {
        $data = TransportBook::select(
            'vehicle_types.name as vehicle_type',
            DB::raw('COUNT(transport_books.id) as total')
        )
            ->join('vehicle_types', 'vehicle_types.id', '=', 'transport_books.vehicle_type_id')
            ->where('transport_books.is_active', 1)
            ->groupBy('vehicle_types.name')
            ->orderBy('vehicle_types.name')
            ->get();

        return response()->json([
            'labels' => $data->pluck('vehicle_type'),
            'data'   => $data->pluck('total')
        ]);
    }

    public function travelBookingTrendReport()
    {
        $data = TransportBook::select(
            'tour_types.name as tour_type',
            DB::raw('MONTH(pickup_date) as month'),
            DB::raw('COUNT(*) as total')
        )
            ->join('tour_types', 'tour_types.id', '=', 'transport_books.tour_type_id')
            ->whereYear('pickup_date', date('Y'))
            ->where('transport_books.is_active', 1)
            ->groupBy(
                'tour_types.name',
                DB::raw('MONTH(pickup_date)')
            )
            ->orderBy('month')
            ->get();

        $months = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        $tourTypes = $data->pluck('tour_type')->unique();

        $colors = [
            '#36A2EB',
            '#FF6384',
            '#4BC0C0',
            '#00C853',
            '#9966FF',
            '#FF9F40'
        ];

        $datasets = [];

        $i = 0;

        foreach ($tourTypes as $tourType) {

            $values = [];

            for ($m = 1; $m <= 12; $m++) {

                $record = $data
                    ->where('tour_type', $tourType)
                    ->where('month', $m)
                    ->first();

                $values[] = $record ? $record->total : 0;
            }

            $datasets[] = [
                'label' => $tourType,
                'data' => $values,
                'borderColor' => $colors[$i % count($colors)],
                'backgroundColor' => $colors[$i % count($colors)],
                'fill' => false,
                'tension' => 0.4
            ];

            $i++;
        }

        return response()->json([
            'labels' => $months,
            'datasets' => $datasets
        ]);
    }

    public function incomeRevenueReport()
    {
        $months = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        $revenue = [];

        for ($i = 1; $i <= 12; $i++) {

            // Room Revenue
            $room = RoomBook::join('packages','packages.id','=','room_books.package_id')
                ->whereYear('booking_Date', date('Y'))
                ->whereMonth('booking_Date',$i)
                ->where('room_books.r_book','Booking')
                ->sum(DB::raw('packages.package_amount * room_books.number_of_room'));

            // Food Revenue
            $food = Order::whereYear('order_date',date('Y'))
                ->whereMonth('order_date',$i)
                ->sum('order_amount');

            // Travel Revenue
            $travel = TransportBook::join('vehicle_types','vehicle_types.id','=','transport_books.vehicle_type_id')
                ->join('service_types','service_types.id','=','transport_books.service_type_id')
                ->whereYear('pickup_date',date('Y'))
                ->whereMonth('pickup_date',$i)
                ->sum(DB::raw('vehicle_types.price + service_types.price'));

            $revenue[] = $room + $food + $travel;
        }

        $growth = [];

        foreach ($revenue as $key => $value){

            if($key == 0){
                $growth[] = 0;
            }else{

                $previous = $revenue[$key-1];

                if($previous == 0){
                    $growth[] = 0;
                }else{
                    $growth[] = round((($value-$previous)/$previous)*100,2);
                }

            }

        }

        return response()->json([
            'labels'=>$months,
            'revenue'=>$revenue,
            'growth'=>$growth
        ]);
    }

    public function paymentCollectionReport()
    {
        $months=[
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        $completed=[];
        $pending=[];

        for($i=1;$i<=12;$i++){

            $completed[] = Order::whereYear('order_date',date('Y'))
                ->whereMonth('order_date',$i)
                ->whereHas('orderStatus',function($q){
                    $q->where('name','Completed');
                })
                ->sum('order_amount');

            $pending[] = Order::whereYear('order_date',date('Y'))
                ->whereMonth('order_date',$i)
                ->whereHas('orderStatus',function($q){
                    $q->where('name','Pending');
                })
                ->sum('order_amount');

        }

        return response()->json([
            'labels'=>$months,
            'completed'=>$completed,
            'pending'=>$pending,
            'completedTotal'=>array_sum($completed),
            'pendingTotal'=>array_sum($pending)
        ]);
    }
}

