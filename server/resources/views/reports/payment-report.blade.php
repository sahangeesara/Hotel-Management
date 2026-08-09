<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <title>Payment Report</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        h1 {
            text-align: center;
        }

        h3 {
            margin-top: 25px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
        }

        th {
            background: #eee;
        }

        .summary {
            margin-top: 20px;
        }
    </style>
</head>

<body>

<h1>Payment Report</h1>


<div class="summary">

    <p>
        <strong>Payment No:</strong>
        {{ $payment->payment_no ?? '-' }}
    </p>

    <p>
        <strong>Payment Date:</strong>
        {{ $payment->payment_date ?? '-' }}
    </p>

    <p>
        <strong>Payment Type:</strong>
        {{ ucfirst($type) }}
    </p>

    <p>
        <strong>Amount:</strong>
        {{ number_format($payment->amount ?? 0, 2) }}
    </p>

</div>


@if(count($relatedRecords['room_bookings']) > 0)

    <h3>Room Bookings</h3>

    <table>

        <thead>
        <tr>
            <th>Booking No</th>
            <th>Booking Date</th>
            <th>Rooms</th>
            <th>Amount</th>
        </tr>
        </thead>

        <tbody>

        @foreach($relatedRecords['room_bookings'] as $booking)

            <tr>

                <td>
                    {{ $booking->booking_no ?? '-' }}
                </td>

                <td>
                    {{ $booking->booking_Date ?? '-' }}
                </td>

                <td>
                    {{ $booking->number_of_room ?? 0 }}
                </td>

                <td>
                    {{ number_format($booking->total_amount ?? 0, 2) }}
                </td>

            </tr>

        @endforeach

        </tbody>

    </table>

@endif


@if(count($relatedRecords['orders']) > 0)

    <h3>Customer Orders</h3>

    <table>

        <thead>
        <tr>
            <th>Order No</th>
            <th>Order Date</th>
            <th>Amount</th>
        </tr>
        </thead>

        <tbody>

        @foreach($relatedRecords['orders'] as $order)

            <tr>

                <td>
                    {{ $order->order_no ?? '-' }}
                </td>

                <td>
                    {{ $order->order_date ?? '-' }}
                </td>

                <td>
                    {{ number_format($order->order_amount ?? 0, 2) }}
                </td>

            </tr>

        @endforeach

        </tbody>

    </table>

@endif


@if(count($relatedRecords['hotel_events']) > 0)

    <h3>Hotel Events</h3>

    <table>

        <thead>
        <tr>
            <th>Event No</th>
            <th>Event Date</th>
            <th>Amount</th>
        </tr>
        </thead>

        <tbody>

        @foreach($relatedRecords['hotel_events'] as $event)

            <tr>

                <td>
                    {{ $event->event_no ?? '-' }}
                </td>

                <td>
                    {{ $event->event_date ?? '-' }}
                </td>

                <td>
                    {{ number_format($event->total_amount ?? 0, 2) }}
                </td>

            </tr>

        @endforeach

        </tbody>

    </table>

@endif


@if(count($relatedRecords['restaurant_events']) > 0)

    <h3>Restaurant Events</h3>

    <table>

        <thead>
        <tr>
            <th>Event No</th>
            <th>Event Date</th>
            <th>Amount</th>
        </tr>
        </thead>

        <tbody>

        @foreach($relatedRecords['restaurant_events'] as $event)

            <tr>

                <td>
                    {{ $event->event_no ?? '-' }}
                </td>

                <td>
                    {{ $event->event_date ?? '-' }}
                </td>

                <td>
                    {{ number_format($event->total_amount ?? 0, 2) }}
                </td>

            </tr>

        @endforeach

        </tbody>

    </table>

@endif


@if(count($relatedRecords['wedding_events']) > 0)

    <h3>Wedding Events</h3>

    <table>

        <thead>
        <tr>
            <th>Event No</th>
            <th>Event Date</th>
            <th>Amount</th>
        </tr>
        </thead>

        <tbody>

        @foreach($relatedRecords['wedding_events'] as $event)

            <tr>

                <td>
                    {{ $event->event_no ?? '-' }}
                </td>

                <td>
                    {{ $event->event_date ?? '-' }}
                </td>

                <td>
                    {{ number_format($event->total_amount ?? 0, 2) }}
                </td>

            </tr>

        @endforeach

        </tbody>

    </table>

@endif


</body>
</html>
