<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS04 - S. Audit Mengikut Jenis Bayaran</title>
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
            margin-bottom: 10px;
        }

        th, td {
            padding: 2px 4px;
        }

        .section {
            margin-bottom: 10px;
        }

        .line {
            border-top: 1px dashed #000;
            height: 1px;
            padding: 0;
            margin: 4px 0;
        }

    </style>
</head>
@php
    if(is_array($payment_type)){
        $payment_type_string = implode(', ', $payment_type);
    } else {
        $payment_type_string = strtoupper($payment_type);
    }
@endphp
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-04</td>
            <td class="text-center">PERBADANAN LABUAN<br>RECEIPTING SYSTEM</td>
            <td class="text-right">
                PRINT DATE : {{ now()->format('d/m/Y') }}<br>
                PRINT TIME : {{ now()->format('H:i:s') }}<br>
                PAGE : 1
            </td>
        </tr>
    </table>

    <div class="text-center section">
        <strong>CS04 - SENARAI AUDIT MENGIKUT JENIS BAYARAN</strong><br>
        BAGI PUSAT {{ $collection_center }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter ?? 1 }}<br>
        TARIKH DARI : {{ $start_date }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $end_date }}
    </div>

    <div class="section">
        <strong>JENIS BAYARAN : {{  $payment_type_string }}</strong>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-left">SISTEM</th>
                <th class="text-right">AMAUN</th>
                <th class="text-right">RESIT</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="3" class="line"></td>
            </tr>

            @foreach ($entries as $item)
                <tr>
                    <td>{{ $item['service'] ?? 'N/A' }}</td>
                    <td class="text-right">{{ number_format($item['total_amount'], 2) }}</td>
                    <td class="text-right">{{ '1' }}</td>
                </tr>
            @endforeach

            <tr class="bold">
                <td>JUMLAH</td>
                <td class="text-right">{{ number_format($entries->sum('amount'), 2) }}</td>
                <td class="text-right">{{ $entries->count('id') }}</td>
            </tr>

            <tr class="bold">
                <td>JUMLAH BESAR</td>
                <td class="text-right">{{ number_format($entries->sum('amount'), 2) }}</td>
                <td class="text-right">{{ $entries->count('id') }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
