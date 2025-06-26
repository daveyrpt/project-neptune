import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
  Building2,
  MapPin,
  Users,
  CarFront,
  ShieldCheck,
  Headset,
} from 'lucide-react'

/* ---- dummy dataset for police stations ------------------------------- */
const stations = [
  {
    id: 'BP-01',
    nama: 'Balai Polis Kota Kinabalu',
    alamat: 'Jalan Kepayan, 88200 Kota Kinabalu, Sabah',
    telefon: '088-242111',
    status: 'Operasi',
    anggota: 58,
    keretaPeronda: 6,
    koordinat: '5.9645, 116.0708',
  },
  {
    id: 'BP-02',
    nama: 'Balai Polis Inanam',
    alamat: 'Jalan Tuaran Bypass, Inanam, 88450 Kota Kinabalu',
    telefon: '088-431122',
    status: 'Operasi',
    anggota: 34,
    keretaPeronda: 4,
    koordinat: '6.0174, 116.1233',
  },
  {
    id: 'BP-03',
    nama: 'Balai Polis Penampang',
    alamat: 'Jalan Penampang, Donggongon, 89500 Kota Kinabalu',
    telefon: '088-721144',
    status: 'Penyelenggaraan',
    anggota: 28,
    keretaPeronda: 3,
    koordinat: '5.9309, 116.0778',
  },
]

/* ---- color maps ------------------------------------------------------ */
const statusColors = {
  Operasi: 'text-green-600 bg-green-100',
  Penyelenggaraan: 'text-yellow-700 bg-yellow-100',
}

/* ---- main component -------------------------------------------------- */
export default function PoliceStations({ auth }) {
  const totalStations = stations.length
  const totalAnggota = stations.reduce((t, s) => t + s.anggota, 0)
  const totalKereta = stations.reduce((t, s) => t + s.keretaPeronda, 0)

  return (
    <AuthenticatedLayout user={auth.user} currentRoute="/police">
      <Head title="Senarai Balai Polis" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Senarai Balai Polis</h1>

        {/* summary cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <StatBox icon={<Building2 />} label="Jumlah Balai" value={totalStations} color="text-blue-600" />
          <StatBox icon={<Users />} label="Jumlah Pegawai" value={totalAnggota} color="text-green-600" />
          <StatBox icon={<CarFront />} label="Kereta Peronda" value={totalKereta} color="text-orange-600" />
          <StatBox icon={<ShieldCheck />} label="Operasi" value={stations.filter(s => s.status === 'Operasi').length} color="text-emerald-600" />
        </div>

        {/* station cards */}
        <div className="space-y-4">
          {stations.map((s) => (
            <div key={s.id} className="bg-white border rounded-xl px-6 py-5 shadow-sm flex flex-col md:flex-row justify-between gap-4">
              {/* left */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Building2 size={20} />
                  </div>
                  <h2 className="font-semibold text-lg">{s.nama}</h2>
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{s.alamat}</p>
                <p className="text-sm text-gray-600 mb-2"><strong>Telefon:</strong> {s.telefon}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                  <div><span className="font-medium">ID:</span> {s.id}</div>
                  <div><span className="font-medium">Pegawai:</span> {s.anggota}</div>
                  <div><span className="font-medium">Kereta Peronda:</span> {s.keretaPeronda}</div>
                </div>
              </div>

              {/* right buttons */}
              <div className="flex flex-col items-end gap-2 min-w-[110px]">
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  {s.status === 'Operasi' && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                  {s.status === 'Penyelenggaraan' && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
                  {s.status}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${s.koordinat}`}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50"
                  >
                    <MapPin size={14} /> Lokasi
                  </a>
                  <a
                    href={`tel:${s.telefon.replace(/[^0-9]/g, '')}`}
                    className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Headset size={14} /> Hubungi
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

/* small stat box -------------------------------------------------------- */
function StatBox({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border">
      <div className={`p-2 rounded-full bg-gray-100 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}
