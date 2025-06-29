<!doctype html>
<html>
<head>
  <title>LAPORAN AUDIT JABATAN BOMBA</title>
  <meta charset="utf-8">
  <style>
    body  { font-family:sans-serif; font-size:11px; }
    h1    { margin-bottom:10px; font-size:18px; }
    table { width:100%; border-collapse:collapse; margin-top: 10px; }
    th,td { border:1px solid #999; padding:6px 8px; }
    th    { background:#f0f0f0; text-align: left; }
    tr:nth-child(even) { background: #fafafa; }

        /* ------------- watermark ---------------- */
    .watermark {
      position: fixed;
      top: 40%;                /* roughly vertical center */
      left: 10%;
      width: 80%;
      text-align: center;
      opacity: 0.08;           /* faint enough for text to stay readable */
      transform: rotate(-45deg);
      font-size: 120px;
      color: gray;             /* red tint (Bomba) */
      z-index: -10;            /* sit behind all content */
    }
  </style>
</head>
<body>
  <!-- Watermark -->
  <div class="watermark">KEGUNAAN JABATAN BOMBA</div>
  <h1>Laporan Audit</h1>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Tarikh & Masa</th>
        <th>Pengguna</th>
        <th>Tindakan</th>
        <th>Sasaran</th>
        <th>Deskripsi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>26/06/2025 09:42</td>
        <td>admin</td>
        <td>Kemaskini</td>
        <td>Insiden #2001</td>
        <td>Menukar status kepada <strong>Resolved</strong></td>
      </tr>
      <tr>
        <td>2</td>
        <td>26/06/2025 08:17</td>
        <td>hasanah</td>
        <td>Tugaskan</td>
        <td>Insiden #1999</td>
        <td>Tugaskan kepada <strong>Balai Bomba Kota Kinabalu</strong></td>
      </tr>
      <tr>
        <td>3</td>
        <td>25/06/2025 23:54</td>
        <td>admin</td>
        <td>Log Masuk</td>
        <td>Auth</td>
        <td>Pengguna berjaya log masuk sistem</td>
      </tr>
      <tr>
        <td>4</td>
        <td>25/06/2025 22:40</td>
        <td>noraini</td>
        <td>Tambah</td>
        <td>Insiden #1997</td>
        <td>Insiden kebakaran dilaporkan di <strong>Taman Kingfisher</strong></td>
      </tr>
      <tr>
        <td>5</td>
        <td>25/06/2025 21:25</td>
        <td>admin</td>
        <td>Kemaskini</td>
        <td>Pengguna #12</td>
        <td>Kemaskini nombor telefon pegawai</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
