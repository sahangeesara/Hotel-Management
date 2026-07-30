<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookingRooms;
use App\Models\RoomBook;
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
    }}
