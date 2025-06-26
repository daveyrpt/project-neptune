<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan CS-08</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
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
            height: 1px;
        }

        .section {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-08</td>
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
        CS08 - SENARAI BAYARAN MENGIKUT KOD HASIL<br>
        BAGI PUSAT {{ $center ?? 'PL4' }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter ?? 1 }}<br>
        KOD HASIL DARI : {{ $incomeCodeString }}<br>
        TARIKH DARI : {{ $start_date->format('d/m/Y') }} &nbsp;&nbsp; TARIKH HINGGA : {{ $end_date->format('d/m/Y') }}
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-left">BIL</th>
                <th class="text-left">TARIKH<br>MASA<br>PENGGUNA</th>
                <th class="text-left">BATAL</th>
                <th class="text-left">NO RESIT</th>
                <th class="text-left">JENIS LESEN<br>NO RESIT AM</th>
                <th class="text-left">CARA BAYARAN<br>JENIS BANK</th>
                <th class="text-left">JENIS</th>
                <th class="text-right">AMAUN</th>
            </tr>
            <tr><td colspan="8" class="line"></td></tr>
        </thead>
        <tbody>
        @php
            // Convert code string to array
            $codeList = explode(',', $incomeCodeString);

            // Load all relevant income codes once
            $incomeCodes = \App\Models\IncomeCode::whereIn('code', $codeList)->get()->keyBy('code');
        @endphp

        @foreach($codeList as $code)
            @php
                $incomeCode = $incomeCodes[$code] ?? null;
                $matchingEntries = collect($entries)->filter(function ($entry) use ($incomeCode) {
                    return $incomeCode && $entry['service'] === $incomeCode->name;
                });
            @endphp

            <tr>
                <td colspan="8">
                    KOD HASIL {{ $code }} &nbsp;&nbsp; {{ $incomeCode->name ?? 'N/A' }}
                </td>
            </tr>

            @foreach($matchingEntries as $entry)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>
                        {{ \Carbon\Carbon::parse($entry['date'])->format('d/m/Y') }} <br>
                        {{ \Carbon\Carbon::parse($entry['date'])->format('h:i:s a') }} <br>
                        {{ \App\Models\User::find($entry['user_id'])->name ?? '-' }}
                    </td>
                    <td>N</td>
                    <td>{{ $entry['receipt_number'] ?? '' }}</td>
                    <td></td>
                    <td>TUNAI</td>
                    <td></td>
                    <td class="text-right">{{ number_format($entry['total_amount'], 2) }}</td>
                </tr>
            @endforeach

            <tr class="bold">
                <td colspan="7">JUMLAH</td>
                <td class="text-right">{{ number_format($matchingEntries->sum('total_amount'), 2) }}</td>
            </tr>
        @endforeach
        
        <tr class="bold">
            <td colspan="7">JUMLAH BESAR</td>
            <td class="text-right">{{ number_format($entries->sum('total_amount'), 2) }}</td>
        </tr>

        </tbody>
    </table>

</body>
</html>
