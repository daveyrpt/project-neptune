<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Deposit Bank - Terperinci</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .section {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th, td {
            padding: 4px;
            text-align: left;
        }

        table.data-table th,
        table.data-table td {
            border-bottom: 1px dotted #000;
        }

        .totals {
            font-weight: bold;
        }
    </style>
</head>
<body>

    <table style="width: 100%; font-family: monospace; font-size: 12px; margin-bottom: 10px;">
        <tr>
            <td>SENARAI {{ strtoupper($payment_type)}}</td>
            <td style="text-align: center;">SLIP DEPOSIT BANK - TERPERINCI</td>
            <td style="text-align: right;">{{ now()->format('d/m/Y H:i:s') }}</td>
        </tr>
    </table>

    <div class="section">
        <strong>JURUWANG :</strong> {{ auth()->user()->name ?? 'N/A' }} &nbsp;&nbsp; {{ $items->count() > 0 ? $items->first()->code : '' }}
    </div>

    <div class="section">
        <strong>NOMBOR SLIP DEPOSIT BANK :</strong> {{ $bankDepositSlip->slip_number ?? 'N/A' }}<br>
        <strong>KUMPULAN RESIT :</strong> {{ $bankDepositSlip->collection_center->code ?? 'PL1' }}
    </div>

    <div class="section">
        <strong>PERBADANAN LABUAN</strong><br>
        Wisma Perbadanan Labuan<br>
        Peti Surat 81245<br>
        87022 Wilayah Persekutuan Labuan
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>NO. KAUNTER</th>
                <th>NO. RESIT</th>
                <th style="text-align: right;">AMAUN</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
                <tr>
                    <td>{{ $item->counter_id }}</td>
                    <td>{{ $item->receipt_number }}</td>
                    <td style="text-align: right;">{{ number_format($item->amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div><strong>BILANGAN TUNAI :</strong> {{ $items->count() }}</div>
        <div><strong>JUMLAH AMAUN :</strong> {{ number_format($items->sum('amount'), 2) }}</div>
    </div>

</body>
</html>
