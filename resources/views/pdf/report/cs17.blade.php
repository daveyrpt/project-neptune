<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan CS-17</title>
    <style>
        @page {
            size: A4 landscape;
        }
        
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

        td, th {
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
            <td>REPORT NAME : CS-17</td>
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
        CS17 – SENARAI BAYARAN MENGIKUT NAMA PEMBAYAR<br>
        BAGI PUSAT {{ App\Models\CollectionCenter::where('id', $collectionCenterId)->first()->code ?? ''}}
    </div>

    <div class="section">
        TARIKH DARI : {{ $startDate->format('d/m/Y') }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $endDate->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>TARIKH</th>
                <th>JENIS BAYARAN</th>
                <th>KOD HASIL</th>
                <th>PUSAT KUTIPAN</th>
                <th>NO RESIT</th>
                <th>NO AKAUN</th>
                <th>NAMA</th>
                <th class="text-right">AMAUN</th>
            </tr>
            <tr><td colspan="8" class="line"></td></tr>
        </thead>
        <tbody>

            @foreach ($entries as $entry)
                <tr>
                    <td>{{ $entry['date'] }}</td>
                    <td>{{ App\Models\PaymentType::where('name', $entry['payment_type'])->first()->description ?? 'TUNAI'}}</td>
                    <td>{{ App\Models\IncomeCode::where('name', $entry['service'])->first()->code ?? 'N/A'}}</td>
                    <td>{{ App\Models\CollectionCenter::where('id', $entry['collection_center_id'])->first()->code ?? 'N/A' }}</td>
                    <td>{{ $entry['receipt_number'] }}</td>
                    <td>{{ $entry['account_number'] }}</td>
                    <td>{{ $customer_name }}</td>
                    <td class="text-right">{{ number_format($entry['total_amount'], 2) }}</td>
                </tr>
            @endforeach

            <tr class="bold">
                <td colspan="7">JUMLAH</td>
                <td class="text-right">{{ number_format($entries->sum('total_amount'), 2) }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
