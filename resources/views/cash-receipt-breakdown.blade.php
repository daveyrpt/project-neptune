<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pecahan Terimaan Tunai</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
        }

        .title{
            color: #004269;
        }

        .table-wrapper {
            width: 49%;
            display: inline-block;
            vertical-align: top;
            overflow: hidden;
        }

        /* Remove margin-right on the second table */
        .table-wrapper:last-child {
            margin-right: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }

        thead {
            background-color: #004269;
            color: white;
        }

        th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ccc;
            text-align: center;
        }

        td {
            background-color: #e5f5ff;
        }

        .no-style-table {
            border: none;
            border-collapse: collapse;
            width: auto;
            font-size: inherit;
            font-family: inherit;
            margin: 0;
            padding: 0;
            background-color: :"white" !important;
        }

        .no-style-table td {
            border: none;
            padding: 0;
            margin: 0;
            vertical-align: top;
            text-align: left;
            padding-right: 20px;
            padding-bottom: 10px;
            background-color:#FFF !important;
        }

        .no-style-table tr {
            background-color:#FFF !important;
        }

    </style>
</head>
<body>


    <h3 class="title">Pecahan Terimaan Tunai</h3>

    <table class="no-style-table">
        <tr>
            <td><strong>ID Juruwang</strong></td>
            <td>:</td>
            <td>{{ $staff_id }} ( {{ $staff_name }} )</td>
        </tr>
        <tr>
            <td><strong>Pusat Kutipan</strong></td>
            <td>:</td>
            <td>{{ $collection_center_name }}</td>
        </tr>
        <tr>
            <td><strong>No. Kaunter</strong></td>
            <td>:</td>
            <td>{{ $counter_no }}</td>
        </tr>
        <tr>
            <td><strong>Tarikh Penerimaan</strong></td>
            <td>:</td>
            <td>{{ $receipt_date }}</td>
        </tr>
        <tr>
            <td><strong>Kumpulan Resit</strong></td>
            <td>:</td>
            <td>{{ $receipt_group }}</td>
        </tr>
    </table>

    <!-- Left Table -->
    <div class="table-wrapper">
        <h3 class="title">Pecahan Tunai</h3>
        <table>
            <thead>
                <tr>
                    <th>Nilai (RM)</th>
                    <th>Kuantiti</th>
                    <th>Jumlah (RM)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>100.00</td>
                    <td>{{ $rm100 }}</td>
                    <td>{{ $amt_rm100 }}</td>
                </tr>
                <tr>
                    <td>50.00</td>
                    <td>{{ $rm50 }}</td>
                    <td>{{ $amt_rm50 }}</td>
                </tr>
                <tr>
                    <td>20.00</td>
                    <td>{{ $rm20 }}</td>
                    <td>{{ $amt_rm20 }}</td>
                </tr>
                <tr>
                    <td>10.00</td>
                    <td>{{ $rm10 }}</td>
                    <td>{{ $amt_rm10 }}</td>
                </tr>
                <tr>
                    <td>5.00</td>
                    <td>{{ $rm5 }}</td>
                    <td>{{ $amt_rm5 }}</td>
                </tr>
                <tr>
                    <td>1.00</td>
                    <td>{{ $rm1 }}</td>
                    <td>{{ $amt_rm1 }}</td>
                </tr>
                <tr>
                    <td style="border-right:none"></td>
                    <td style="border-right: none; border-left:none">Jumlah: </td>
                    <td style="border-left: none">{{ $total_cash }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Right Table -->
    <div class="table-wrapper">
        <h3 class="title">Pecahan Syiling</h3>
        <table>
            <thead>
                <tr>
                    <th>Nilai (RM)</th>
                    <th>Kuantiti</th>
                    <th>Jumlah (RM)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>0.50</td>
                    <td>{{ $rm0_50 }}</td>
                    <td>{{ $amt_rm0_50 }}</td>
                </tr>
                <tr>
                    <td>0.20</td>
                    <td>{{ $rm0_20 }}</td>
                    <td>{{ $amt_rm0_20 }}</td>
                </tr>
                <tr>
                    <td>0.10</td>
                    <td>{{ $rm0_10 }}</td>
                    <td>{{ $amt_rm0_10 }}</td>
                </tr>
                <tr>
                    <td>0.05</td>
                    <td>{{ $rm0_05 }}</td>
                    <td>{{ $amt_rm0_05 }}</td>
                </tr>
                <tr>
                    <td style="border-right:none"></td>
                    <td style="border-right: none; border-left:none">Jumlah: </td>
                    <td style="border-left: none">{{ $total_coin }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div style="margin-top: 50px">

        <table class="no-style-table">
            <tr>
                <td><strong>Jumlah Ringgit</strong></td>
                <td>:</td>
                <td>{{ $total_cash }}</td>
            </tr>
            <tr>
                <td><strong>Jumlah Syiling</strong></td>
                <td>:</td>
                <td>{{ $total_coin }}</td>
            </tr>
            <tr>
                <td><strong>Jumlah Tunai Dikira</strong></td>
                <td>:</td>
                <td>{{ number_format($total ?: 0, 2, '.', ',') ?: 0 }}</td>
            </tr>
            <tr>
                <td><strong>Amaun Penerimaan</strong></td>
                <td>:</td>
                <td>{{ number_format($total ?: 0, 2, '.', ',') ?: 0 }}</td>
            </tr>
        </table>

    </div>

</body>
</html>
