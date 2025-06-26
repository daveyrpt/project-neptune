<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS13 - Senarai Terperinci Bayaran Kaunter</title>
    <style>
        @page {
            size: A4 landscape;
        }

        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .section {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td, th {
            padding: 2px 4px;
        }

        .text-center {
            text-align: center;
        }

        .bold {
            font-weight: bold;
        }

        .line {
            border-bottom: 1px dashed #000;
            margin: 5px 0;
        }

        .summary {
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-13</td>
            <td class="text-center">PERBADANAN LABUAN<br>RECEIPTING SYSTEM</td>
            <td class="text-right">
                PRINT DATE : {{ now()->format('d/m/Y') }}<br>
                PRINT TIME : {{ now()->format('H:i:s') }}<br>
                PAGE : 1
            </td>
        </tr>
    </table>

    <div class="text-center section">
        <strong>CS13 - SENARAI TERPERINCI BAYARAN KAUNTER</strong><br>
        BAGI PUSAT {{ $collection_center }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter }}<br>
        KOD HASIL : {{ $income_code }} <br>
        TARIKH DARI : {{ $start_date->format('d/m/Y') }} &nbsp;&nbsp; TARIKH HINGGA : {{ $end_date->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>BIL</th>
                <th>TARIKH<br>MASA<br>PENGGUNA</th>
                <th>NO RESIT<br>NO AKAUN<br>KOD HASIL</th>
                <th>NO BIL<br>JENIS LESEN<br>NO RESIT AM</th>
                <th>KEMASKINI<br>BATAL</th>
                <th>SEMASA<br>SEWAAN<br>DISKAUN</th>
                <th>TUNGGAKAN<br>LAIN-LAIN<br>ADJUST</th>
                <th>FAEDAH NOTIS</th>
                <th>CARA BAYARAN<br>JENIS BANK</th>
                <th>JUMLAH</th>
            </tr>
            <tr><td colspan="10" class="line"></td></tr>
        </thead>
        <tbody>
            
            @foreach($entries as $i => $entry)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td class="text-center">
                        {{ \Carbon\Carbon::parse($entry['date'])->format('d/m/Y') }} <br>
                        {{ \Carbon\Carbon::parse($entry['date'])->format('h:i:s a') }} <br>
                        {{ App\Models\User::where('id', $entry['user_id'])->first()->name ?? '-' }}
                    </td>
                    <td class="text-center">
                        {{ $entry['receipt_number'] ?? '-' }} <br>
                        NO. {{ $entry['account_number'] ?? '-' }} <br>
                        {{ $income_code }}
                    </td>
                    <td class="text-center">
                        NO. {{ $entry['details']['bill_number'] ?? '-' }} <br>
                        NO. {{ $entry['details']['bill_number'] ?? '-' }} <br>
                        {{ $entry['receipt_number'] ?? '-' }}
                    </td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                    <td class="text-center">{{ App\Models\PaymentType::where('name', $entry['payment_type'])->first()->description ?? 'TUNAI'}}</td>
                    <td class="text-center">{{ number_format($entry['amount'], 2) }}</td>
                </tr>

            @endforeach
        </tbody>
    </table>

    <div class="summary text-right">
        JUMLAH : {{ number_format($entries->sum('total_amount'), 2) }}
    </div>

</body>
</html>
