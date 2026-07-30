<?php

namespace App\Exports;

use App\Models\RoomBook;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RoomBookExport implements FromCollection, WithHeadings
{

    public function collection(): \Illuminate\Support\Collection
    {
        return RoomBook::with([
            'guest',
            'bookingRooms.roomCategory'
        ])
            ->where('is_active',1)
            ->get()
            ->map(function($book){

                return [
                    'Booking No' => $book->booking_no,
                    'Guest Name' => $book->guest->name ?? '',
                    'NIC' => $book->guest->nic ?? '',
                    'Guest Count' => $book->max_guests,
                    'Room Count' => $book->number_of_room,
                    'Booking Type' => $book->r_book,
                    'Booking Date' => $book->booking_Date,
                    'Cancel Date' => $book->cancel_Date,
                ];

            });
    }


    public function headings(): array
    {
        return [
            'Booking No',
            'Guest Name',
            'NIC',
            'Guest Count',
            'Room Count',
            'Booking Type',
            'Booking Date',
            'Cancel Date'
        ];
    }
}
