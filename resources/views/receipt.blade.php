<!DOCTYPE html>
<html lang="ms">

<head>
    <meta charset="UTF-8">
    <title>Resit Rasmi</title>
    <style>
        body {
            margin: 0px;
            padding: 0cm;
            margin-right: 10px;
            margin-left: 10px;
        }

        body {
            font-family: "Lucida Grande", Verdana, Arial, Tahoma, sans-serif;
        }

        .font-std {
            font-size: 11px;
        }

        .font-disabled {
            font-size: 11px;
            color: #000000;
        }

        .font-std-medium {
            font-size: 14px;
        }

        .font-menu {
            font-size: 14px;
        }

        .font-highlight {
            color: blue; //3B5998
        }

        .font-small {
            font-size: 8px;
        }

        .font-footer {
            font-size: 10px;
            color: #808080;
        }

        .font-print {
            font-family: "Courier";
            font-size: 8px;
        }

        .font-big {
            font-size: 20px;
        }

        .font-std-big {
            font-size: 18px;
        }

        .font-error {
            color: #FF0000;
            font-weight: bold;
        }

        .btn-std {
            width: 70px;
            font-size: 11px;
            padding: 1px 10px;
        }

        .btn-navi {
            width: 40px;
            font-size: 11px;
            padding: 1px 10px;
        }

        .btn-integration {
            width: 180px;
            font-size: 11px;
            padding: 1px 10px;
        }

        .btn-export {
            width: 200px;
            font-size: 11px;
            padding: 1px 10px;
        }

        div.scroll {
            width: 1000px;
            height: 125px;
            overflow: scroll;
        }

        div.scroll-small {
            width: 1000px;
            height: 80px;
            overflow: scroll;
        }

        .table-header {
            background-color: #FFFFFF;
            font-size: 10px;
            font-weight: bold;
            color: #A52A2A;
        }

        .table-row {
            background-color: #FFFFFF;
        }

        .table-row-alt {
            background-color: #DDDDDD;
        }

        .table-row-selected {
            background-color: #99FF99;
        }

        .table-data {
            border-collapse: collapse;
            font-size: 8px;
            margin: auto;
            /*table center*/
        }

        .table-data td {
            border-collapse: collapse;
            border-right: 1px solid;
            border-left: 1px solid;
            border-top: 1px solid;
            border-bottom: 1px solid;
            padding: 3px;
            border-spacing: 0;
        }

        .td-data {
            border-collapse: collapse;
            border-right: 1px solid;
            border-left: 1px solid;
            border-top: 1px solid;
            border-bottom: 1px solid;
            padding: 3px;
            border-spacing: 0;
        }

        .td-empty {
            border-collapse: collapse;
            padding: 3px;
            border-spacing: 0;
        }

        .ok {
            display: block;
            background-image: url(image/terima.jpg);
            background-repeat: no-repeat;
            background-position: 8px 10px;
            padding-left: 25px;
            padding-top: 7px;
            width: 140px;
            height: 25px;
        }

        .footer {
            position: fixed;
            left: 0px;
            bottom: 2px;
            height: 30px;
            width: 100%;
        }

        div#divLoading {
            position: absolute;
            top: 200px;
            left: 0;
            width: 100%;
        }

        .progress-label {
            font-weight: bold;
        }

        fieldset {
            border: 1px solid #D8D8D8;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
        }

        .fieldset {
            background-color: white;
        }

        @page {
            size: A4;
            margin: 0cm;
            padding: 0cm;
        }

    </style>
</head>

@php
function convertSenToWords($amount) {

    $ones = array(
        0 => 'Kosong',
        1 => 'Satu',
        2 => 'Dua',
        3 => 'Tiga',
        4 => 'Empat',
        5 => 'Lima',
        6 => 'Enam',
        7 => 'Tujuh',
        8 => 'Lapan',
        9 => 'Sembilan',
        10 => 'Sepuluh',
        11 => 'Sebelas',
        12 => 'Dua Belas',
        13 => 'Tiga Belas',
        14 => 'Empat Belas',
        15 => 'Lima Belas',
        16 => 'Enam Belas',
        17 => 'Tujuh Belas',
        18 => 'Lapan Belas',
        19 => 'Sembilan Belas'
    );

    $tens = array(
        2 => 'Dua Puluh',
        3 => 'Tiga Puluh',
        4 => 'Empat Puluh',
        5 => 'Lima Puluh',
        6 => 'Enam Puluh',
        7 => 'Tujuh Puluh',
        8 => 'Lapan Puluh',
        9 => 'Sembilan Puluh'
    );

    // Extract decimal part
    $decimal = round(($amount - floor($amount)) * 100);

    if ($decimal == 0) {
        return '';
    } elseif ($decimal < 20) {
        return strtoupper($ones[$decimal] . ' Sen');
    } else {
        $tens_digit = (int) ($decimal / 10);
        $ones_digit = $decimal % 10;

        $result = $tens[$tens_digit];
        if ($ones_digit > 0) {
            $result .= ' ' . $ones[$ones_digit];
        }

        return strtoupper($result . ' Sen');
    }
}

function convertIntegerToWords($amount) {
    $amount = floor($amount); // Remove decimal

    if ($amount == 0) return '';

    $ones = array(
        0 => '',
        1 => 'SATU',
        2 => 'DUA',
        3 => 'TIGA',
        4 => 'EMPAT',
        5 => 'LIMA',
        6 => 'ENAM',
        7 => 'TUJUH',
        8 => 'LAPAN',
        9 => 'SEMBILAN',
        10 => 'SEPULUH',
        11 => 'SEBELAS',
        12 => 'DUA BELAS',
        13 => 'TIGA BELAS',
        14 => 'EMPAT BELAS',
        15 => 'LIMA BELAS',
        16 => 'ENAM BELAS',
        17 => 'TUJUH BELAS',
        18 => 'LAPAN BELAS',
        19 => 'SEMBILAN BELAS'
    );

    $tens = array(
        2 => 'DUA PULUH',
        3 => 'TIGA PULUH',
        4 => 'EMPAT PULUH',
        5 => 'LIMA PULUH',
        6 => 'ENAM PULUH',
        7 => 'TUJUH PULUH',
        8 => 'LAPAN PULUH',
        9 => 'SEMBILAN PULUH'
    );

    $magnitudes = ['', 'RIBU', 'JUTA', 'BILION', 'TRILION'];

    $words = '';
    $i = 0;

    while ($amount > 0) {
        $chunk = $amount % 1000;

        if ($chunk > 0) {
            $chunkWords = '';

            $hundreds = floor($chunk / 100);
            $remainder = $chunk % 100;

            if ($hundreds > 0) {
                $chunkWords .= $ones[$hundreds] . ' RATUS ';
            }

            if ($remainder > 0) {
                if ($remainder < 20) {
                    $chunkWords .= $ones[$remainder] . ' ';
                } else {
                    $tensDigit = floor($remainder / 10);
                    $onesDigit = $remainder % 10;

                    $chunkWords .= $tens[$tensDigit] . ' ';
                    if ($onesDigit > 0) {
                        $chunkWords .= $ones[$onesDigit] . ' ';
                    }
                }
            }

            $words = $chunkWords . $magnitudes[$i] . ' ' . $words;
        }

        $amount = floor($amount / 1000);
        $i++;
    }

    return trim(preg_replace('/\s+/', ' ', strtoupper($words)))." RINGGIT";
}

@endphp



@php
    $client_name = "Wisma Perbadanan Labuan";
    $client_address1 = "Peti Surat 81245";
    $client_address2 = "87022 Wilayah Persekutuan Labuan";
    $client_phone = "087 408600, 408601";
    $client_fax = "087 428997, 419400, 426803";
    $client_web = "www.pl.gov.my";
    $client_mail = "webmaster@pl.gov.my";

    $jsonDecode = $grouped ? $receipts[0]->payment_detail : $receipt->payment_detail;
    
    $cardHolderName = $jsonDecode[0]['card_holder_name'];

    $receiptNumber = $grouped ? $receipts[0]->receipt_number : $receipt->receipt_number;
    $receiptDate = $grouped ? $receipts[0]->date : $receipt->date;
    $formattedDate  = \Carbon\Carbon::parse($receiptDate)->format('d/m/Y h:i A');
    $accountNumber = $grouped ? $receipts[0]->account_number : $receipt->account_number;
    $paymentType = $grouped ? $receipts[0]->payment_type : $receipt->payment_type;

    $totalAmount = $grouped ? $receipts[count($receipts)-1]->total_amount : $receipt->amount;
    
    $centWord = convertSenToWords($totalAmount);
    $integerWord = convertIntegerToWords($totalAmount);

    $totalAmount = number_format($totalAmount, 2);
    
@endphp



<body>
    @foreach(['ASAL', 'PENDUA'] as $copyType)
    <table width="90%" border="0" class="font-small" align="center">
        <tr>
            <td>&nbsp;</td>
            <td></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td></td>
        </tr>
        <tr class="font-std">
            <td height="70" width="30%" align="center" valign="top">
                <img src="{{ public_path('images/Labuan.jpg') }}" width="100">
            </td>
            <td width="55%" valign="top">
                <b>
                    PERBADANAN LABUAN
                </b>
                <br>
                {{ $client_name }}
                <br>
                {{ $client_address1 }}
                <br>
                {{ $client_address2 }}
                <br>
                Tel : {{ $client_phone }} &nbsp;&nbsp;&nbsp; Fax : {{ $client_fax }}
                <br>
                Laman Web : {{ $client_web }} &nbsp;&nbsp;&nbsp; E-mail : {{ $client_mail }}
            </td>
            <td width="15%" align="right" valign="top"><b>ASAL</b></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td></td>
        </tr>
        <tr class="font-std">
            <td colspan="2"><b>Juruwang : {{ $juruwang }} ({{ $counter }}) {{ $collection_center }} </b></td>
            <td rowspan="2" width="10%" align="right" class="font-std-big"><b>{{ $receiptNumber }}</b></td>
        </tr>
        <tr class="font-std">
            <td colspan="2"><b>Tarikh : {{ $formattedDate }}</b></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3">
                <table width="100%" cellpadding="0" cellspacing="0" class="font-std">
                    <tr align="center" class="font-std">
                        <td colspan="3" height="12" class="td-data"><b>RESIT RASMI</b></td>
                    </tr>
                    <tr align="center" class="font-std">
                        <td height="12" width="44%" class="td-data"><b>PEMBAYAR</b></td>
                        <td width="38%" class="td-data"><b>MAKLUMAT PEMBAYARAN</b></td>
                        <td width="12%" class="td-data"></td>
                    </tr>
                    <tr>
                        <td height="45" class="td-data" valign="top">
                            {{ $cardHolderName }}<br>
                            No. Akaun {{ $accountNumber }}
                        </td>
                        <td height="33" class="td-data" valign="top">
                            Jenis Bayaran : {{ $paymentType }}<br>
                            @if($grouped)
                            @foreach($receipts as $item)
                            No. Rujukan: {{ $item->reference_number }}<br>
                            @endforeach
                            @else
                            No. Rujukan: {{ $receipt->reference_number }}
                            @endif
                        </td>
                        <td height="33" class="td-data" valign="top">
                            @if($grouped)
                            @foreach($receipts as $receipt)
                            Kod :{{ optional($receipt->details->first())->income_code ?? $receipt->service }}<br>
                            @endforeach
                            @else
                            Kod :{{ optional($receipt->details->first())->income_code ?? $receipt->service }}
                            @endif
                        </td>
                    </tr>
                    <tr align="center" class="font-std">
                        <td colspan="2" height="12" class="td-data"><b>PERKARA</b></td>
                        <td class="td-data"><b>RM</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" height="60" class="td-data" valign="top" style="word-wrap: break-word; word-break: break-all; white-space: normal;">
                            @if($grouped)
                            @foreach($receipts as $item)
                            {{ $item->description }}<br>
                            @endforeach
                            @else
                            {{ $receipt->description }}
                            @endif
                        </td>
                        <td class="td-data" valign="top" align="right">
                            @if($grouped)
                            @foreach($receipts as $item)
                            {{ $item->amount }}<br>
                            @endforeach
                            @else
                            {{ $receipt->amount }}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="15" style="border-bottom: 1px solid;">{{ $integerWord }} {{ $centWord }} SAHAJA</td>
                        <td style="border-bottom: 1px solid;" align="right"><b>Jumlah Besar</b></td>
                        <td style="border-bottom: 3px double;" align="right"><b>{{ $totalAmount }}</b></td>
                    </tr>
                    <tr>
                        <td colspan="3">
                        <i>Resit ini tidak memerlukan tandatangan kerana dicetak oleh komputer.</i></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    @if($copyType === 'ASAL')
        <br><br>
        <table class="font-small" width="100%">
            <tr>
                <td align="center">
                    ........................................................................................................................................................Potong di sini........................................................................................................................................................
                </td>
            </tr>
        </table>
        <br><br>
    @endif
    @endforeach
</body>

</html>
