<!DOCTYPE html>

<html>

<head>

    <style>

        table{
            width:100%;
            border-collapse:collapse;
        }

        table,th,td{
            border:1px solid black;
        }

        th,td{
            padding:8px;
        }

    </style>


</head>


<body>

<h2 align="center">
    Room Booking Report
</h2>


<table>

    <thead>

    <tr>

        <th>No</th>
        <th>Booking No</th>
        <th>Guest</th>
        <th>NIC</th>
        <th>Rooms</th>
        <th>Booking Date</th>

    </tr>

    </thead>


    <tbody>


    @foreach($roomsBooks as $key=>$book)

        <tr>

            <td>{{ $key+1 }}</td>

            <td>
                {{ $book->booking_no }}
            </td>


            <td>
                {{ $book->guest->name ?? '' }}
            </td>


            <td>
                {{ $book->guest->nic ?? '' }}
            </td>


            <td>
                {{ $book->number_of_room }}
            </td>


            <td>
                {{ $book->booking_Date }}
            </td>


        </tr>


    @endforeach


    </tbody>


</table>


</body>

</html>
