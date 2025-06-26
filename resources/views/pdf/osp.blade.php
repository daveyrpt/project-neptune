<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Senarai OSP</title>
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
        <h2 style="margin: 0;">Senarai OSP</h2>
        <div style="text-align: right; font-size: 12px; line-height: 1.4;">
            Dicetak oleh: {{ auth()->user()->name }}<br>
            {{ now()->format('d/m/Y H:i A') }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Jenis Import</th>
                <th>Pusat Kutipan</th>
                <th>Terminal</th>
                <th>Tarikh Kutipan</th>
                <th>No. Akaun</th>
                <th>No. Resit OSP</th>
                <th>Pemegang Akaun</th>
                <th>Amaun (RM)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($osp as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->import_type ?? 'N/A'}}</td>
                    <td>{{ $item->collectionCenter->name ?? 'N/A'}}</td>
                    <td>{{ $item->counter->name ?? 'N/A'}}</td>
                    <td>{{ $item->collection_date ?? 'N/A'}}</td>
                    <td>{{ $item->account_number ?? 'N/A'}}</td>
                    <td>{{ $item->osp_receipt_number ?? 'N/A'}}</td>
                    <td>{{ $item->account_holder_name ?? 'N/A'}}</td>
                    <td>{{ $item->amount ?? 'N/A'}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
