<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS12 - Butir-butir Pungutan (Rumusan)</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
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
            <td>REPORT NAME : CS-12</td>
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
        CS12 – BUTIR-BUTIR PUNGUTAN (DETAIL)<br>
        BAGI PUSAT {{ $collection_center ?? ''}}
    </div>

    <div class="section">
        KAUNTER : {{ $counter?? ''}}<br>
        TARIKH DARI : {{ !empty($start_date) ? $start_date->format('d/m/Y') : ''}} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ !empty($end_date) ? $end_date->format('d/m/Y') : ''}}
    </div>

    <table>
        <thead>
            <tr>
                <th>CARA BAYARAN</th>
                <th>JUMLAH BAYARAN</th>
                <th>TRANSAKSI</th>
            </tr>
            <tr><td colspan="9"><hr class="line"></td></tr>
        </thead>
        <tbody>
            @forelse($entries as $index => $item)
                <tr>
                    <td>{{ $item['jenis_bayaran'] }}</td>
                    <td>{{ $item['amount'] }}</td>
                    <td>{{ $item['count'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Tiada Rekod</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
