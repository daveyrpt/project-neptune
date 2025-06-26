<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Maklumat Resit</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .section {
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        th, td {
            padding: 4px;
            text-align: left;
        }

        .header-line {
            text-align: center;
        }

        .line {
            border-bottom: 1px dashed #000;
            margin: 10px 0;
        }

        .summary {
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <div class="section header-line">
        ----------------------------------------<br>
                   MAKLUMAT RESIT<br>
        ----------------------------------------
    </div>

    <div class="section">
        ID OPER.  {{ $operator_id }} {{ $operator_name }}<br>
        TARIKH    {{ $date }}<br>
        STESEN    {{ $station }}     MESIN {{ $machine }}<br>
        MUKA SURAT : {{ $page }}
    </div>

    <div class="line"></div>

    <table>
        <tbody>
            @foreach ($entries as $entry)
                <tr>
                    <td>{{ $entry['receipt_number'] }}</td>
                    <td>{{ $entry['total_amount'] }}</td>
                    <td>{{ $entry['counter_id'] }}</td>
                   <td>{{ \Carbon\Carbon::parse($entry['date'])->format('d/m/Y') }}</td>
                </tr>
                <tr>
                    <td colspan="4">A/K: {{ $entry['account_number'] }}</td>
                </tr>
                <tr>
                    <td colspan="4">BIL: {{ $entry['current_bill'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        BILG. {{ $entries->count() }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; RM {{ number_format($entries->sum('total_amount'), 2) }}
    </div>

</body>
</html>
