<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan</title>
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
        <h2 style="margin: 0;">Senarai Pengguna</h2>
        <div style="text-align: right; font-size: 12px; line-height: 1.4;">
            Dicetak oleh: {{ auth()->user()->name }}<br>
            {{ now()->format('d/m/Y H:i A') }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>ID Pengguna</th>
                <th>Nama Pengguna</th>
                <th>Emel</th>
                <th>Peranan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->staff_id}}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->email }}</td>
                    <td>{{ $item->role->display_name }}</td>
                    <td>{{ $item->is_active ? 'Aktif' : 'Tidak Aktif' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
