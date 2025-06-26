<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Laporan Tamat Hari</title>
    <style>
        body {
            font-family: monospace;
            font-size: 14px;
        }

        .header,
        .section,
        .footer {
            margin-bottom: 20px;
        }

        .line {
            border-bottom: 1px dashed #000;
            margin: 10px 0;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table td {
            padding: 4px 0;
        }

        .right {
            text-align: right;
        }

        .bold {
            font-weight: bold;
        }

        .center {
            text-align: center;
        }

    </style>
</head>
<body>

    <div class="header">
        <div class="bold">LAPORAN KELUAR</div>
        <div>{{ $location ?? 'TIADA' }}</div>
        <div>STESEN {{ $station ?? 'TIADA' }} &nbsp;&nbsp;&nbsp;
            MESIN {{ $machine ?? 'TIADA' }}</div>
        <div>TARIKH: {{ $date ?? 'TIADA' }} &nbsp;&nbsp;&nbsp; MASA:
            {{ Carbon\Carbon::parse($date)->format('H:i') ?? 'TIADA' }}</div>
    </div>

    <div class="line"></div>

    <div class="section">
        <div>OPERATOR: {{ $operatorCode ?? 'TIADA' }}
            {{ $operatorName ?? 'TIADA' }}</div>

        <table class="table">

            <tr class="bold">
                <td>CARA</td>
                <td class="right">AMAUN</td>
            </tr>
            @foreach($paymentMethods ?? [] as $method)
                <tr>
                    <td>{{ strtoupper($method['jenis_bayaran']) }}</td>
                    <td class="right">{{ $method['amount'] }}</td>
                </tr>
            @endforeach
            <tr class="bold">
                <td>JUMLAH</td>
                <td class="right">{{ number_format($totalAmount ?? 0, 2) }}</td>
            </tr>
        </table>

        <br>
        <div>RESIT AKHIR &nbsp;&nbsp;&nbsp; {{ $lastReceipt ?? '0' }}</div>
        <div>RESIT BATAL &nbsp;&nbsp;&nbsp; {{ $cancelledReceipts ?? '0' }}</div>
    </div>

    <div class="section">
        <table class="table">
            <thead>
                <tr class="bold">
                    <td>KOD</td>
                    <td>TRANS</td>
                    <td class="right">AMAUN</td>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions ?? [] as $transaction)
                    <tr>
                        <td>{{ $transaction['code'] }}</td>
                        <td>{{ $transaction['count'] }}</td>
                        <td class="right">{{ number_format($transaction['amount'], 2) }}
                        </td>
                    </tr>
                @endforeach
                <tr class="bold">
                    <td>JUMLAH</td>
                    <td>{{ $totalTransactions ?? 0 }}</td>
                    <td class="right">{{ number_format($totalTransactionAmount ?? 0, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="line"></div>

    <div class="footer center">
        <div>*** TAMAT HARI ***</div>
        <div>{{ $date ?? 'TIADA' }} &nbsp;&nbsp;&nbsp;
            {{ Carbon\Carbon::parse($date)->format('H:i') ?? 'TIADA' }}</div>
    </div>

</body>

</html>
