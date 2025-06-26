<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS09 - S. Bayaran Kod Hasil (Rumusan)</title>
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
            <td>REPORT NAME : CS-09</td>
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
        CS09 – S. BAYARAN KOD HASIL (RUMUSAN)<br>
        BAGI PUSAT {{ $collection_center ?? ''}}
    </div>

    <div class="section">
        KAUNTER : {{ $counter?? ''}}<br>
        KOD HASIL : {{ $incomeCodeString ?? ''}}<br>
        TARIKH DARI : {{ $start_date->format('d/m/Y') }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $end_date->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-left">KOD HASIL</th>
                <th class="text-left">KETERANGAN</th>
                <th class="text-right">AMAUN</th>
            </tr>
            <tr><td colspan="9"><hr class="line"></td></tr>
        </thead>
        <tbody>
            @forelse($entries as $index => $item)
                <tr>
                    <td class="text-left">{{ $item['code'] }}</td>
                    <td class="text-left">{{ $item['jenis_bayaran'] }}</td>
                    <td class="text-right">{{ $item['amount'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Tiada Rekod</td>
                </tr>
            @endforelse
                <tr class="bold">
                    <td colspan="2">JUMLAH</td>
                    <td class="text-right">{{ number_format(collect($entries)->sum('amount'), 2) }}</td>
                </tr>
        </tbody>
    </table>

</body>
</html>
