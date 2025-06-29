import { useState, useEffect } from 'react'
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

/* ------------------------------------------------------------------ */
/*  custom hydrant icon                                               */

const hazardIcons = {
  Fire: new L.Icon({
    iconUrl: '/images/firehazard.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  Flood: new L.Icon({
    iconUrl: '/images/flood.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  Animal: new L.Icon({
    iconUrl: '/images/animal.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  Chemical: new L.Icon({
    iconUrl: '/images/chemical.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
}

const ambulanceIcon = new L.Icon({
  iconUrl: '/images/ambulance.svg',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

const truckIcon = new L.Icon({
  iconUrl: '/images/firetruck.svg',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

const stationIcon = new L.Icon({
  iconUrl: '/images/station.svg',   // ← drop any PNG/SVG in /public/images
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

const policeIcon = new L.Icon({
  iconUrl: '/images/police.svg',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

const hydrantRed = new L.Icon({
  iconUrl: '/images/hydrant.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

const hydrantGreen = new L.Icon({
  iconUrl: '/images/hydrant.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})
function getLevelBar(level) {
  const n = parseInt(level)
  if (n >= 80) return '🟩🟩🟩'
  if (n >= 40) return '🟨🟨⬜'
  return '🟥⬜⬜'
}
const hydrants = [
  {
    latlng: [5.9810, 116.0735],
    label: 'Hidran #1 - Jalan Gaya',
    active: true,
    level: '80%',
  },
  {
    latlng: [5.9825, 116.0750],
    label: 'Hidran #2 - Api-Api Centre',
    active: false,
    level: '30%',
  },
  {
    latlng: [5.9785, 116.0705],
    label: 'Hidran #3 - KK Times Square',
    active: true,
    level: '100%',
  },
  {
    latlng: [5.9833, 116.0711],
    label: 'Hidran #4 - Suria Sabah',
    active: true,
    level: '65%',
  },
  {
    latlng: [5.9762, 116.0689],
    label: 'Hidran #5 - Sutera Harbour',
    active: false,
    level: '0%',
  },
  {
    latlng: [5.9851, 116.0794],
    label: 'Hidran #6 - Signal Hill',
    active: true,
    level: '90%',
  },
]
/* ------------------------------------------------------------------ */
/*  helper component that drops N random markers                      */
function RandomHydrants({ count = 20 }) {
  const map = useMap()
  const [hydrants, setHydrants] = useState([])

  useEffect(() => {
    // run once after map is ready
    const { _southWest: sw, _northEast: ne } = map.getBounds()

    // const randomWithin = (min, max) => Math.random() * (max - min) + min

    // const markers = Array.from({ length: count }).map(() => ({
    //   lat: randomWithin(sw.lat, ne.lat),
    //   lng: randomWithin(sw.lng, ne.lng),
    // }))

    const hydrants = [
      { latlng: [5.9810, 116.0735], label: 'Hidran #1', active: true, level: '80%' },
      { latlng: [5.9825, 116.0750], label: 'Hidran #2', active: false, level: '30%' },
      { latlng: [5.9785, 116.0705], label: 'Hidran #3', active: true, level: '0%' },
    ]
    setHydrants(markers)
  }, [map, count])

  return (
    <>
      {hydrants.map(({ lat, lng }, idx) => (
        <Marker
          key={idx}
          position={[lat, lng]}
          icon={idx % 2 === 0 ? hydrantGreen : hydrantRed} // alternate status
        >
          <Popup>
            <strong>{hydrant.label}</strong><br />
            Status: {hydrant.active ? 'Aktif' : 'Tidak Aktif'}<br />
            Tahap Air: {hydrant.level}
          </Popup>
        </Marker>
      ))}
    </>
  )
}
/* ─── DATA: Fire stations ─────────────────────────────────────────── */
const stations = [
  {
    latlng: [5.9601, 116.0904],
    nama: 'Balai Bomba Kota Kinabalu',
    kelas: 'Urban',
    telefon: '088-223344',
    anggota: 62,
    jentera: 6,
    coverage: 3000,        // ← 3 km radius
  },
  {
    latlng: [5.9266, 116.0489],
    nama: 'Balai Bomba KKIA',
    kelas: 'Airport',
    telefon: '088-556677',
    anggota: 28,
    jentera: 2,
    coverage: 3000,        // ← 3 km radius
  },
]

const policeUnits = [
  {
    id: 'POL-01',
    latlng: [5.9829, 116.0742],
    status: 'Patrolling',
    officer: 'Sgt. Amir',
    station: 'IPD Kota Kinabalu',
    eta: '5 min',
  },
  {
    id: 'POL-02',
    latlng: [5.9781, 116.0777],
    status: 'Responding',
    officer: 'Cpl. Liew',
    station: 'Balai Luyang',
    eta: '2 min',
  },
]

const hazards = [
  {
    latlng: [5.9818, 116.0780],
    type: 'Fire',
    label: 'Kebakaran – Suria Sabah',
    severity: 'Critical',
    time: '18:05',
  },
  {
    latlng: [5.9695, 116.0620],
    type: 'Flood',
    label: 'Banjir – Sutera Harbour',
    severity: 'Moderate',
    time: '17:32',
  },
  {
    latlng: [5.9702, 116.0810],
    type: 'Animal',
    label: 'Serangan Binatang – Likas',
    severity: 'Mild',
    time: '16:20',
  },
  {
    latlng: [5.9721, 116.0655],
    type: 'Chemical',
    label: 'Tumpahan Bahan Kimia – Sembulan',
    severity: 'Moderate',
    time: '15:55',
  },
]

const hazardMap = Object.fromEntries(
  hazards.map((h) => [h.id, h.latlng])
)

const trucks = [
  {
    id: 'JK01',
    latlng: [5.9752, 116.0733],
    label: 'Jentera 01',
    status: 'En Route',
    station: 'Balai Bomba Kota Kinabalu',
    destLatLng: [5.9702, 116.0810],          // no target
    eta: '7 min',
  },
  {
    id: 'JK02',
    latlng: [5.9838, 116.0790],
    label: 'Jentera 02',
    status: 'On Scene',
    incidentId: 'A102',        // link to hazard below
    eta: null
  },
  {
    id: 'IN01',
    latlng: [6.0020, 116.1115],
    label: 'Jentera 03',
    status: 'Returning',
    destLatLng: [5.9601, 116.0904], // home station coords
    eta: '30 min',
  },
]

const ambulances = [
  {
    id: 'AMB-01',
    latlng: [5.9811, 116.0801],
    status: 'Available',
    crew: 2,
    hospital: 'Hospital Queen Elizabeth',
    eta: '2 min',
  },
  {
    id: 'AMB-02',
    latlng: [5.9701, 116.0655],
    status: 'On Scene',
    crew: 3,
    hospital: 'KPJ Sabah',
    eta: '—',
  },
]
/* ------------------------------------------------------------------ */
/*  main exported map component                                       */
export default function Map({ center = [5.9804, 116.0735], zoom = 13 }) {
  return (
    <MapContainer
      center={[5.9804, 116.0735]} // Kota Kinabalu
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: '700px', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {hydrants.map((hydrant, idx) => (
        <Marker
          key={idx}
          position={hydrant.latlng}
          icon={hydrant.active ? hydrantGreen : hydrantRed}
        >
          <Popup>
            <strong>{hydrant.label}</strong><br />
            Status: {hydrant.active ? 'Aktif' : 'Tidak Aktif'}<br />
            Tahap Air: {hydrant.level} {getLevelBar(hydrant.level)}
          </Popup>
        </Marker>
      ))}

      {/* Fire stations */}
      {stations.map((s, i) => (
        <React.Fragment key={`station-${i}`}>
          <Marker position={s.latlng} icon={stationIcon}>
            <Popup>
              <strong>{s.nama}</strong><br />
              Kelas: {s.kelas}<br />
              Anggota: {s.anggota}<br />
              Jentera: {s.jentera}<br />
              Tel: {s.telefon}
            </Popup>
          </Marker>

          {/* coverage circle */}
          <Circle
            center={s.latlng}
            radius={s.coverage}                // metres
            pathOptions={{                      // styling
              color: '#2563eb',                 // stroke
              weight: 1,
              fillColor: '#60a5fa',
              fillOpacity: 0.15,
            }}
          />
        </React.Fragment>
      ))}

      {hazards.map((h, idx) => (
        <React.Fragment key={`hazard-${idx}`}>
          <Marker
            position={h.latlng}
            icon={hazardIcons[h.type] || hazardIcons.Fire} // fallback
          >
            <Popup>
              <strong>{h.label}</strong><br />
              Jenis: {h.type}<br />
              Keterukan: {h.severity}<br />
              Masa: {h.time}
            </Popup>
          </Marker>

          {/* Optional: impact zone */}
          <Circle
            center={h.latlng}
            radius={h.severity === 'Critical' ? 600 : 300}
            pathOptions={{
              color:
                h.type === 'Fire'
                  ? '#dc2626'
                  : h.type === 'Flood'
                    ? '#2563eb'
                    : h.type === 'Chemical'
                      ? '#9333ea'
                      : '#f59e0b', // Animal
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
        </React.Fragment>
      ))}

      {/* Fire-trucks and heading lines */}
      {trucks.map((t) => {
        const dest =
          t.destLatLng ??
          (t.incidentId ? hazardMap[t.incidentId] : null)

        return (
          <React.Fragment key={`truck-${t.id}`}>
            <Marker position={t.latlng} icon={truckIcon}>
              {/* ETA balloon (always visible) */}
              {t.eta && (
                <Tooltip
                  direction="top"
                  offset={[0, -14]}   // lift tooltip a bit
                  permanent           // always show, not just on hover
                  className="!bg-red-600 !text-white !px-2 !py-0.5 !rounded-md !border-none !text-xs"
                >
                  {t.eta}
                </Tooltip>
              )}

              {/* standard popup */}
              <Popup>
                <strong>{t.label}</strong><br />
                Status: {t.status}<br />
                ETA: {t.eta || '—'}
              </Popup>
            </Marker>

            {/* dashed line if we have a destination */}
            {dest && (
              <Polyline
                positions={[t.latlng, dest]}
                pathOptions={{
                  color: '#ef4444',        // red line
                  dashArray: '6 6',
                  weight: 2,
                  opacity: 0.8,
                }}
              />
            )}
          </React.Fragment>
        )
      })}

{ambulances.map((a) => (
  <Marker key={`amb-${a.id}`} position={a.latlng} icon={ambulanceIcon}>
    <Tooltip
      direction="top"
      offset={[0, -14]}
      permanent
      className="!bg-sky-600 !text-white !text-xs !px-2 !py-0.5 !rounded-md !border-none"
    >
      {a.eta || '—'}
    </Tooltip>
    <Popup>
      <strong>{a.id}</strong><br />
      Status: {a.status}<br />
      Krew: {a.crew}<br />
      Hospital: {a.hospital}<br />
      ETA: {a.eta || '—'}
    </Popup>
  </Marker>
))}

{policeUnits.map((unit) => (
  <Marker key={`pol-${unit.id}`} position={unit.latlng} icon={policeIcon}>
    <Tooltip
      direction="top"
      offset={[0, -14]}
      permanent
      className="!bg-indigo-600 !text-white !text-xs !px-2 !py-0.5 !rounded-md !border-none"
    >
      {unit.eta}
    </Tooltip>
    <Popup>
      <strong>{unit.id}</strong><br />
      Status: {unit.status}<br />
      Pegawai: {unit.officer}<br />
      Balai: {unit.station}<br />
      ETA: {unit.eta}
    </Popup>
  </Marker>
))}


    </MapContainer>
  )
}
