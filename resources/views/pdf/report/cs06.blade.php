<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS06 - S. Audit Mengikut Jenis Pungutan</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }

        table {
            width: 100%;
            border-collapse: collapse;
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
            margin: 4px 0;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-06</td>
            <td class="text-center">PERBADANAN LABUAN<br>RECEIPTING SYSTEM</td>
            <td class="text-right">
                PRINT DATE : {{ now()->format('d/m/Y') }}<br>
                PRINT TIME : {{ now()->format('H:i:s') }}<br>
                PAGE : 1
            </td>
        </tr>
    </table>

    <div class="text-center section">
        <strong>CS06 - SENARAI AUDIT MENGIKUT JENIS PUNGUTAN</strong><br>
        BAGI PUSAT {{ $center ?? 'PL1' }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter ?? 'N/A' }}<br>
        TARIKH : {{ $start_date->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>JENIS BAYARAN</th>
                <th class="text-right">RESIT</th>
                <th class="text-right">AMAUN</th>
                <th class="text-right">RESIT</th>
                <th class="text-right">AMAUN</th>
                <th class="text-right">RESIT</th>
                <th class="text-right">AMAUN</th>
            </tr>
            <tr>
                <th></th>
                <th class="text-right" colspan="2">PUNGUTAN HARI INI</th>
                <th class="text-right" colspan="2">BULANAN TERKINI</th>
                <th class="text-right" colspan="2">TAHUNAN TERKINI</th>
            </tr>
            <tr><td colspan="7"><hr style="border-top: 1px dashed #000; border-bottom: none;"></td></tr>
        </thead>
        <tbody>
            @foreach ($entries as $item)
                <tr>
                    <td>{{ $item['service'] }}</td>
                    <td class="text-right">{{ $item['count'] }}</td>
                    <td class="text-right">{{ $item['amount'] }}</td>
                    <td class="text-right">{{ $item['month_count'] }}</td>
                    <td class="text-right">{{ $item['month_amount'] }}</td>
                    <td class="text-right">{{ $item['year_count'] }}</td>
                    <td class="text-right">{{ $item['year_amount'] }}</td>
                </tr>
            @endforeach

            <tr class="bold">
                <td>JUMLAH</td>
                <td class="text-right">{{ $entries->sum('count') }}</td>
                <td class="text-right">{{ number_format($entries->sum('amount'), 2) }}</td>
                <td class="text-right">{{ $entries->sum('month_count') }}</td>
                <td class="text-right">{{ number_format($entries->sum('month_amount'), 2) }}</td>
                <td class="text-right">{{ $entries->sum('year_count') }}</td>
                <td class="text-right">{{ number_format($entries->sum('year_amount'), 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
