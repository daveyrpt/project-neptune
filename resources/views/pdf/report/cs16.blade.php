<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CS-16 Audit Report</title>
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

        .text-left {
            text-align: left;
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

        .text-uppercase {
            text-transform: uppercase;
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
            <td>REPORT NAME : CS-16</td>
            <td class="text-center">PERBADANAN LABUAN<br>RECEIPTING SYSTEM</td>
            <td class="text-right">
                PRINT DATE : {{ now()->format('d/m/Y') }}<br>
                PRINT TIME : {{ now()->format('H:i:s') }}<br>
                PAGE : 1
            </td>
        </tr>
    </table>

    <div class="text-center section">
        <strong>CS16 - SENARAI AUDIT PEMPROSESAN PENGHUJUNG HARI</strong><br>
        BAGI PUSAT {{ $collection_center }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter }}<br>
        TARIKH DARI : {{ $start_date->format('d/m/Y') }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $end_date->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th>BIL</th>
                <th class="text-left">TARIKH<br>PENGGUNA</th>
                <th class="text-left">NO BIL<br>NO RESIT AM</th>
                <th class="text-left">KOD HASIL</th>
                <th class="text-left">CARA BAYARAN</th>
                <th class="text-right">JUMLAH</th>
            </tr>
            <tr><td colspan="8" class="line"></td></tr>
        </thead>
        <tbody>
            
            @foreach($entries as $i => $entry)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td class="text-left text-uppercase">
                        {{ \Carbon\Carbon::parse($entry['date'])->format('d/m/Y') }} <br>
                        {{ App\Models\User::where('id', $entry['user_id'])->first()->name ?? '-' }}
                    </td>
                    <td class="text-left">
                        NO. {{ $entry['details']['bill_number'] ?? '-' }} <br>
                        {{ $entry['receipt_number'] ?? '-' }}
                    </td>
                    <td class="text-left">{{ App\Models\IncomeCode::where('name', $entry['service'])->first()->code ?? 'N/A'}}</td>
                    <td class="text-left text-uppercase">{{ App\Models\PaymentType::where('name', $entry['payment_type'])->first()->description ?? 'TUNAI'}}</td>
                    <td class="text-right">{{ number_format($entry['amount'], 2) }}</td>
                </tr>

            @endforeach

            <tr class="bold">
                <td colspan="5  ">JUMLAH</td>
                <td class="text-right">{{ number_format($entries->sum('total_amount'), 2) }}</td>
            </tr>
        </tbody>
    </table>



</body>
</html>
