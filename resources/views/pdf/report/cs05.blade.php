<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan CS-05</title>
    <style>
        body {
            font-family: monospace;
            font-size: 12px;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th, td {
            padding: 2px 4px;
        }

        .section {
            margin-bottom: 10px;
        }

        .line {
            border-top: 1px dashed #000;
            height: 1px;
            padding: 0;
            margin: 4px 0;
        }

    </style>
</head>
<body>

    <table>
        <tr>
            <td>REPORT NAME : CS-05</td>
            <td class="text-center">PERBADANAN LABUAN<br>RECEIPTING SYSTEM</td>
            <td class="text-right">
                PRINT DATE : {{ now()->format('d/m/Y') }}<br>
                PRINT TIME : {{ now()->format('H:i:s') }}<br>
                PAGE : 1
            </td>
        </tr>
    </table>

    <div class="text-center section">
        <strong>CS05 - SENARAI AUDIT MENGIKUT JENIS BAYARAN (SUMMARY)</strong><br>
        BAGI PUSAT {{ $collection_center }}
    </div>

    <div class="section">
        KAUNTER : {{ $counter ?? 1 }}<br>
        TARIKH DARI : {{ $start_date }} &nbsp;&nbsp;&nbsp; TARIKH HINGGA : {{ $end_date }}
    </div>

    @php
        $paymentList = explode(',', $paymentTypeString);
        $paymentTypes = \App\Models\PaymentType::whereIn('description', $paymentList)->get()->keyBy('description');

        $grandTotalAmount = 0;
        $grandTotalCount = 0;
    @endphp

    @foreach($paymentList as $payment)
        <div class="section">
            <strong>JENIS BAYARAN : {{ strtoupper($payment ?? '') }}</strong>
        </div>

        <table>
            <thead>
                <tr>
                    <th class="text-left" style="width: 80%;">SISTEM</th>
                    <th class="text-right" style="width: 10%;">AMAUN</th>
                    <th class="text-right" style="width: 10%;">RESIT</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="3" class="line"></td>
                </tr>

                @php
                    $receipts = \App\Models\Receipt::whereDate('date', '>=', \Carbon\Carbon::parse($start_date)->format('Y-m-d'))
                        ->whereDate('date', '<=', \Carbon\Carbon::parse($end_date)->format('Y-m-d'))
                        ->where('collection_center_id', \App\Models\CollectionCenter::where('code', $collection_center)->first()->id)
                        ->where('counter_id', \App\Models\Counter::where('name', $counter)->first()->id)
                        ->where('payment_type', $paymentTypes[$payment]->name ?? null)
                        ->with('incomeCode')
                        ->get();

                    $subtotalAmount = $receipts->sum('total_amount');
                    $subtotalCount = $receipts->count();

                    // Add to grand total
                    $grandTotalAmount += $subtotalAmount;
                    $grandTotalCount += $subtotalCount;
                @endphp

                @php
                    $grouped = $receipts->groupBy('service')->map(function ($items, $service) {
                        return [
                            'incomeCode' => $items->first()->incomeCode->code ?? '',
                            'service' => $service ?? 'N/A',
                            'amount' => $items->sum('total_amount'),
                            'count' => $items->count(),
                        ];
                    });
                @endphp

                @foreach ($grouped as $item)
                    <tr>
                        <td>{{ $item['incomeCode'] }} {{ $item['service'] !== '' ? $item['service'] : 'N/A' }}</td>
                        <td class="text-right">{{ number_format($item['amount'], 2, '.', ',') }}</td>
                        <td class="text-right">{{ $item['count'] }}</td>
                    </tr>
                @endforeach

                <tr class="bold">
                    <td>JUMLAH</td>
                    <td class="text-right">{{ number_format($subtotalAmount, 2, '.', ',') }}</td>
                    <td class="text-right">{{ $subtotalCount }}</td>
                </tr>
            </tbody>
        </table>
    @endforeach

    <table style="margin-top: 30px;">
        <tr class="bold">
            <td  style="width: 80%;"><strong>JUMLAH BESAR</strong></td>
            <td class="text-right"  style="width: 10%;"><strong>{{ number_format($grandTotalAmount, 2, '.', ',') }}</strong></td>
            <td class="text-right"  style="width: 10%;"><strong>{{ $grandTotalCount }}</strong></td>
        </tr>
    </table>

</body>
</html>
