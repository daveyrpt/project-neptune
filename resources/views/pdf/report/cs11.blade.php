<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS11 - Butir-butir Pungutan (Maklumat)</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 2px 4px;
        }

        .line {
            border-top: 1px dashed #000;
            margin: 4px 0;
        }

        .section {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-11</td>
            <td class="text-center">
                PERBADANAN LABUAN<br>
                RECEIPTING SYSTEM
            </td>
            <td class="text-right">
                PRINT DATE : {{ now()->format('d/m/Y') }}<br>
                PRINT TIME : {{ now()->format('H:i:s') }}<br>
                PAGE : 1
            </td>
        </tr>
    </table>

    <div class="text-center bold section">
        CS11 – BUTIR-BUTIR PUNGUTAN (DETAIL)<br>
        BAGI PUSAT {{ App\Models\CollectionCenter::where('id', $collectionCenterId)->first()->code ?? ''}}
    </div>

    <div class="section">
        KAUNTER : {{ App\Models\Counter::where('id', $counterId)->first()->name ?? ''}}<br>
        TARIKH DARI : {{ $startDate->format('d/m/Y') }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $endDate->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-left">BIL</th>
                <th class="text-left">MASA</th>
                <th class="text-left">NO RESIT</th>
                <th class="text-left">NO AKAUN</th>
                <th class="text-left">BATAL</th>
                <th class="text-left">BAYARAN</th>
                <th class="text-right">AMAUN</th>
            </tr>
            <tr><td colspan="7"><hr class="line"></td></tr>
        </thead>
        <tbody>

            @foreach ($entries as $index => $e)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $e['created_at']->format('H:i:s') }}</td>
                    <td>{{ $e['receipt_number'] }}</td>
                    <td>{{ $e['account_number'] ?? 'N/A' }}</td>
                    <td>{{ $e['status'] == 'cancelled' ? 'Y' : 'N' }}</td>
                    <td>{{ App\Models\PaymentType::where('name', $e['payment_type'])->first()->description ?? 'TUNAI'}}</td>
                    <td class="text-right">{{ number_format($e['total_amount'], 2) }}</td>
                </tr>
            @endforeach

            <tr class="bold">
                <td colspan="6">JUMLAH</td>
                <td class="text-right">{{ number_format($entries->sum('total_amount'), 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
