<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Audit Trail</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .header, .info, .footer {
            margin-bottom: 10px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 2px 4px;
            text-align: left;
        }

        .line {
            border-bottom: 1px dashed #000;
            margin: 10px 0;
        }

        .timestamp {
            text-align: right;
        }
    </style>
</head>
<body>

    <div class="header">
        <strong>LAPORAN AUDIT TRAIL</strong>
        <div class="timestamp">
            CETAK PADA : {{ now()->format('d/m/Y') }} &nbsp;&nbsp; {{ now()->format('H:i:s') }}
        </div>
    </div>

    <div class="info">
        TARIKH DARI : {{ $start_date }} &nbsp;&nbsp;&nbsp; HINGGA : {{ $end_date }}
    </div>
<div class="line"></div>
    <table>
        <thead>
            <tr>
                <th>MASA</th>
                <th>TINDAKAN</th>
                <th>PENGGUNA</th>
            </tr>
        </thead>
        
        <tbody>
            
            @foreach($logs as $log)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($log->created_at)->format('d/m/Y H:i:s') }}</td>
                    <td>{{ $log->log_name == 'login' ? 'Log Masuk' : 'Log Keluar' }}</td>
                    <td>{{ strtoupper($log->causer->name ?? '-') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
