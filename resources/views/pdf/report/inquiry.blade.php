<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Inquiry</title>
    <style>
        @page {
            size: A4 landscape;
        }

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
            max-width: 200px;
        }

        th {
            background-color: #eee;
        }
    </style>
</head>
<body>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="margin: 0;">Laporan Inquiry</h2>
        <div style="text-align: right; font-size: 12px; line-height: 1.4;">
            Dicetak oleh: {{ auth()->user()->name }}<br>
            {{ now()->format('d/m/Y H:i A') }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Tarikh Penerimaan</th>
                <th>Pusat Kutipan</th>
                <th>No. Kaunter</th>
                <th>Kod Hasil</th>
                <th>Nombor Akaun</th>
                <th>Rujukan</th>
                <th>Nombor Resit</th>
                <th>Jenis Bayaran</th>
                <th>Keterangan</th>
                <th>Amaun (RM)</th>
            </tr>
        </thead>
        <tbody> 
        @forelse($report as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->date }}</td>
                <td>{{ $item->collectionCenter->name }}</td>
                <td>{{ $item->counter->name }}</td>
                <td>{{ $item->service ?? 'N/A' }}</td>
                <td>{{ $item->account_number ?? 'N/A' }}</td>
                <td>{{ $item->reference_number ?? 'N/A' }}</td>
                <td>{{ $item->receipt_number }}</td>
                <td>{{ $item->paymentType->name }}</td>
                <td style="word-wrap: break-word; word-break: break-all; white-space: normal;">
                    {{ $item->description }}
                </td>
                <td>{{ number_format($item->total_amount  ?: 0, 2, '.', ',') ?: 0 }}</td>
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
