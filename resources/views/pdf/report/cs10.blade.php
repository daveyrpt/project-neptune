<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS10 - Senarai Audit Bayaran Kaunter</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td, th {
            padding: 2px 4px;
        }

        .line {
            border-top: 1px dashed #000;
            margin: 4px 0;
            height: 1px;
        }

        .section {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-10</td>
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
        CS10 – SENARAI AUDIT BAYARAN KAUNTER<br>
        BAGI PUSAT {{ $center ?? 'PL4' }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter ?? 1 }}<br>
        TARIKH DARI : {{ $start_date ?? '01/08/2022' }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $end_date ?? '14/01/2025' }}
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-left">TARIKH</th>
                <th class="text-left">KOD HASIL</th>
                <th class="text-left">CARA BAYARAN</th>
                <th class="text-left">BATAL?</th>
                <th class="text-left">NO AKAUN</th>
                <th class="text-left">NO BIL</th>
                <th class="text-left">NO RESIT</th>
                <th class="text-left">NAMA KETERANGAN</th>
                <th class="text-right">AMAUN (RM)</th>
            </tr>
 
                <tr>
                <td colspan="9" class="line"></td>
            </tr>
        </thead>
        <tbody>
            @foreach ($entries as $item)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($item['date'])->format('d/m/Y') }}</td>
                    <td>{{ App\Models\IncomeCode::where('name', $item['service'])->first()->code ?? 'N/A'}}</td>
                    <td>{{ App\Models\PaymentType::where('name', $item['payment_type'])->first()->description ?? 'TUNAI'}}</td>
                    <td>{{ $item['status'] == 'cancelled' ? 'Y' : 'N' }}</td>
                    <td>{{ $item['account_number'] ?? 'N/A'}}</td>
                    <td>{{ $item['details'][0]['bill_number'] ?? 'N/A' }}</td>
                    <td>{{ $item['receipt_number'] }}</td>
                    <td>{{ $item['description'] }}</td>
                    <td class="text-right">{{ number_format($item['total_amount'], 2) }}</td>
                </tr>
            @endforeach

            <tr class="bold">
                <td colspan="8">JUMLAH</td>
                <td class="text-right">{{ number_format($entries->sum('total_amount'), 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
