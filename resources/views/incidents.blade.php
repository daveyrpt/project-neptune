<!doctype html>
<html>
<head>
    <title>LAPORAN JABATAN BOMBA</title>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; font-size: 12px; margin: 0 25px; }

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

    h1   { font-size: 18px; margin: 0 0 6px 0; }
    h4   { margin: 12px 0 4px 0; }
    .meta  { margin-bottom: 10px; }
    .meta div { margin-bottom: 2px; }
  </style>
</head>
<body>
  <!-- Watermark -->
  <div class="watermark">KEGUNAAN JABATAN BOMBA</div>

  <h1>Butiran Insiden #{{ $incident->id }}</h1>

  <div class="meta">
    <div><strong>Lokasi:</strong> {{ $incident->lokasi }}</div>
    <div><strong>Tarikh & Masa:</strong> {{ $incident->tarikh }} {{ $incident->masa }}</div>
    <div><strong>Status:</strong> {{ $incident->tahap }} ({{ $incident->status }})</div>
    <div><strong>Pegawai:</strong> {{ $incident->pegawai }}</div>
    <div><strong>Telefon:</strong> {{ $incident->phone }}</div>
    <div><strong>Alamat:</strong> {{ $incident->address }}</div>
    <div><strong>GPS:</strong> {{ $incident->gps }}</div>
  </div>

  <h4>Deskripsi Insiden:</h4>
  <p>{{ $incident->message }}</p>
</body>
</html>
