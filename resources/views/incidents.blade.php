<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>LAPORAN JABATAN BOMBA</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      font-size: 13px;
      margin: 40px;
      line-height: 1.6;
      color: #222;
    }

    .watermark {
      position: fixed;
      top: 40%;
      left: 10%;
      width: 80%;
      text-align: center;
      opacity: 0.07;
      transform: rotate(-45deg);
      font-size: 120px;
      color: #b71c1c;
      z-index: -1;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #b71c1c;
    }

    h4 {
      font-size: 14px;
      margin: 20px 0 8px;
      border-bottom: 1px solid #eee;
      padding-bottom: 4px;
      color: #444;
    }

    .meta {
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 15px;
      background-color: #f9f9f9;
      margin-bottom: 20px;
    }

    .meta div {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #eee;
    }

    .meta div:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #444;
    }

    .value {
      text-align: right;
    }

    p {
      background: #fff9f9;
      border-left: 4px solid #f44336;
      padding: 10px 15px;
      margin: 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <!-- Watermark -->
  <div class="watermark">KEGUNAAN JABATAN BOMBA</div>

  <h1>Laporan Insiden #{{ $incident->id }}</h1>

  <div class="meta">
    <div><span class="label">No. Bil:</span> <span class="value">01/25</span></div>
    <div><span class="label">Lokasi:</span> <span class="value">{{ $incident->lokasi }}</span></div>
    <div><span class="label">Status:</span> <span class="value">{{ $incident->tahap }} ({{ $incident->status }})</span></div>
    <div><span class="label">Pegawai:</span> <span class="value">{{ $incident->pegawai }}</span></div>
    <div><span class="label">Telefon:</span> <span class="value">{{ $incident->phone }}</span></div>
    <div><span class="label">Alamat:</span> <span class="value">{{ $incident->address }}</span></div>
    <div><span class="label">Anggaran Kerugian:</span> <span class="value">~RM10,000</span></div>
    @php
        [$lat, $lng] = explode(',', $incident->gps);
    @endphp

    <div>
      <strong>GPS:</strong>
      <a href="https://www.google.com/maps?q={{ $lat }},{{ $lng }}" target="_blank" style="color: #0d47a1;">
        {{ $incident->gps }} (Buka di Peta)
      </a>
    </div>
    <div><span class="label">Masa Terima Panggilan:</span> <span class="value">	26/06/2025 14:45 </span></div>
    <div><span class="label">Lonceng Kecemasan Dibunyikan:</span> <span class="value">	26/06/2025 14:46</span></div>
    <div><span class="label">Jentera Keluar:</span> <span class="value">	26/06/2025 14:48</span></div>
    <div><span class="label">Sampai Lokasi:</span> <span class="value">	26/06/2025 14:55</span></div>
    <div><span class="label">Mula Operasi:</span> <span class="value">	26/06/2025 14:56</span></div>
    <div><span class="label">Tamat Operasi:</span> <span class="value">	26/06/2025 15:20</span></div>
  </div>

  <h4>Deskripsi Insiden</h4>
  <p>{{ $incident->message }}</p>
</body>
</html>
