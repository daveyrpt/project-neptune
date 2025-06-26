<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Wang Apungan</title>
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
        }

        th {
            background-color: #eee;
        }
    </style>
</head>
<body>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="margin: 0;">Laporan Wang Apungan</h2>
        <div style="text-align: right; font-size: 12px; line-height: 1.4;">
            Dicetak oleh: {{ auth()->user()->name }}<br>
            {{ now()->format('d/m/Y H:i A') }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>ID Juruwang</th>
                <th>Pusat Kutipan</th>
                <th>No. Kaunter</th>
                <th>Jenis</th>
                <th>Tarikh</th>
                <th>Jumlah (RM)</th>
            </tr>
        </thead>
        <tbody>
        @forelse($report as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->user->name }}</td>
                <td>{{ $item->collectionCenter->name }}</td>
                <td>{{ $item->counter->name }}</td>
                <td>{{ $item->type == 'increment' ? 'Penambahan' : 'Pengurangan'}}</td>
                <td>{{ \Carbon\Carbon::parse($item->date_applied)->format('d-m-Y') }}</td>
                <td>{{ number_format($item->total  ?: 0, 2, '.', ',') ?: 0 }}</td>
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
