import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
  Building2,
  MapPin,
  Users,
  Truck,
  ShieldCheck,
  Wrench,
  Eye,
  Headset,
} from 'lucide-react'

/* ---- dummy dataset ----------------------------------------------------- */
const stations = [
  {
    id: 'BBKK-01',
    nama: 'Balai Bomba Kota Kinabalu',
    alamat: 'Jalan Lintas, 88300 Kota Kinabalu, Sabah',
    telefon: '088-223344',
    kelas: 'Urban',
    status: 'Aktif',
    anggota: 62,
    jentera: 6,
    koordinat: '5.9601, 116.0904',
  },
  {
    id: 'BBKK-02',
    nama: 'Balai Bomba Lintas',
    alamat: 'Km 8, Jalan Lintas, 88300 KK',
    telefon: '088-231344',
    kelas: 'Urban',
    status: 'Aktif',
    anggota: 48,
    jentera: 4,
    koordinat: '5.9504, 116.0832',
  },
  {
    id: 'BBKK-04',
    nama: 'Balai Bomba Penampang',
    alamat: 'Jalan Penampang, 89500 KK',
    telefon: '088-224144',
    kelas: 'Urban',
    status: 'Aktif',
    anggota: 40,
    jentera: 4,
    koordinat: '5.9302, 116.0720',
  },
]

/* ---- colour maps ------------------------------------------------------- */
const statusColors = {
  Aktif: 'text-green-600 bg-green-100',
  Penyelenggaraan: 'text-yellow-700 bg-yellow-100',
}

const kelasColors = {
  Urban: 'bg-blue-100 text-blue-700',
  Rural: 'bg-emerald-100 text-emerald-700',
  Airport: 'bg-indigo-100 text-indigo-700',
  Auxiliary: 'bg-gray-100 text-gray-700',
}

/* ---- main page --------------------------------------------------------- */
export default function Stations({ auth }) {
  /* summary stats */
  const totalStations = stations.length
  const totalAnggota = stations.reduce((a, s) => a + s.anggota, 0)
  const totalJentera = stations.reduce((a, s) => a + s.jentera, 0)

  return (
    <AuthenticatedLayout user={auth.user} currentRoute="/station">
      <Head title="Senarai Balai Bomba" />

      <div className="space-y-6">
        {/* header */}
        <h1 className="text-2xl font-bold">Senarai Balai Bomba</h1>

        {/* summary */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <StatBox icon={<Building2 />} label="Jumlah Balai" value={totalStations} color="text-blue-600" />
          <StatBox icon={<Users />} label="Jumlah Anggota" value={totalAnggota} color="text-green-600" />
          <StatBox icon={<Truck />} label="Jumlah Jentera" value={totalJentera} color="text-orange-600" />
          <StatBox icon={<ShieldCheck />} label="Aktif" value={stations.filter(s => s.status === 'Aktif').length} color="text-emerald-600" />
        </div>

        {/* filters (static demo) */}
        <div className="flex flex-wrap items-center gap-4">
          <input className="border rounded-md px-4 py-2 w-full sm:w-64" placeholder="Cari balai..." />
          <select className="border rounded-md px-3 py-2 w-40">
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Penyelenggaraan</option>
          </select>
          <select className="border rounded-md px-3 py-2 w-40">
            <option>Semua Kelas</option>
            <option>Urban</option>
            <option>Rural</option>
            <option>Airport</option>
          </select>
        </div>

        {/* station cards */}
        <div className="space-y-4">
          {stations.map((s) => (
            <div key={s.id} className="bg-white border rounded-xl px-6 py-5 shadow-sm flex flex-col md:flex-row justify-between gap-4">
              {/* left */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`p-2 rounded-lg ${kelasColors[s.kelas]}`}>
                    <Building2 size={20} />
                  </div>
                  <h2 className="font-semibold text-lg">{s.nama}</h2>
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{s.alamat}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                  <div><span className="font-medium">ID:</span> {s.id}</div>
                  <div><span className="font-medium">Kelas:</span> {s.kelas}</div>
                  <div><span className="font-medium">Telefon:</span> {s.telefon}</div>
                  <div><span className="font-medium">Anggota:</span> {s.anggota}</div>
                  <div><span className="font-medium">Jentera:</span> {s.jentera}</div>
                </div>
              </div>

              {/* right actions */}
              <div className="flex flex-col items-end gap-2 min-w-[110px]">
                <div className="wtext-sm text-gray-700 flex items-center gap-2">
                  {s.status === 'Aktif' && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                  {s.status === 'Penyelenggaraan' && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
                  {s.status}
                </div>
                <div className="flex gap-2">
                  <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50">
                    <MapPin size={14} /> Lokasi
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50">
                    <Eye size={14} /> Lihat
                  </button>
                  <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700">
                    <Headset size={14} /> Hubungi
                  </button>
                  {s.status === 'Penyelenggaraan' && (
                    <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-orange-600">
                      <Wrench size={14} /> Baiki
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

/* reusable box ----------------------------------------------------------- */
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
