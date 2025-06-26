<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #eee;
        }
    </style>
</head>
<body>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="margin: 0;">Laporan Slip Bank Deposit ({{ ucfirst($type) }})</h2>
        <div style="text-align: right; font-size: 12px; line-height: 1.4;">
            Dicetak oleh: {{ auth()->user()->name }}<br>
            {{ now()->format('d/m/Y H:i A') }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Pusat Kutipan</th>
                <th>No. Kaunter</th>
                <th>Tarikh Penerimaan</th>
                <th>Amaun (RM)</th>
                <th>Tarikh Deposit</th>
                <th>No. Slip Bank</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->collectionCenter->name ?? 'Wisma PL' }}</td>
                    <td>{{ $item->counter->name ?? '1'}}</td>
                    <td>{{ \Carbon\Carbon::parse($item->date)->format('d/m/Y')}}</td>
                    <td>{{ $item->amount_from_receipt }}</td>
                    <td>{{ \Carbon\Carbon::parse($item->deposit_date)->format('d/m/Y') }}</td>
                    <td>{{ $item->slip_number }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
