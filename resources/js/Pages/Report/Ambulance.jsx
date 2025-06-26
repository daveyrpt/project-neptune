import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
  Hospital,        // if you have an icon; else use Building2
  Building2,
  MapPin,
  BedDouble,
  Truck,
  ShieldCheck,
  Headset,
} from 'lucide-react'

/* ---- dummy hospital dataset ------------------------------------------ */
const hospitals = [
  {
    id: 'HOSP-01',
    nama: 'Hospital Queen Elizabeth',
    alamat: 'Lorong Bersatu Off Jalan Damai, 88300 Kota Kinabalu',
    telefon: '088-512555',
    kelas: 'Public',
    status: 'Operasi',
    katil: 589,
    ambulans: 8,
    koordinat: '5.9749, 116.0820',
  },
  {
    id: 'HOSP-02',
    nama: 'Hospital Wanita & Kanak-Kanak Sabah',
    alamat: 'Jalan Penampang, 88200 Kota Kinabalu',
    telefon: '088-578888',
    kelas: 'Public',
    status: 'Operasi',
    katil: 360,
    ambulans: 5,
    koordinat: '5.9286, 116.0712',
  },
  {
    id: 'HOSP-03',
    nama: 'KPJ Sabah Specialist Hospital',
    alamat: 'Lorong Bersatu 1, Off Jalan Damai, 88300 KK',
    telefon: '088-322000',
    kelas: 'Private',
    status: 'Operasi',
    katil: 245,
    ambulans: 3,
    koordinat: '5.9761, 116.0815',
  },
  {
    id: 'HOSP-04',
    nama: 'Kota Kinabalu Medical Centre',
    alamat: 'Lorong Pokok Kayu Manis, Off Jalan Damai, 88300 KK',
    telefon: '088-308000',
    kelas: 'Private',
    status: 'Operasi',
    katil: 235,
    ambulans: 2,
    koordinat: '5.9756, 116.0827',
  },
]

/* ---- colour maps ----------------------------------------------------- */
const statusColors = {
  Operasi: 'text-green-600 bg-green-100',
  TidakOperasi: 'text-red-600 bg-red-100',
}
const kelasColors = {
  Public: 'bg-indigo-100 text-indigo-700',
  Private: 'bg-amber-100 text-amber-700',
}

/* ---- main page ------------------------------------------------------- */
export default function Hospitals({ auth }) {
  const totalBeds = hospitals.reduce((t, h) => t + h.katil, 0)
  const totalAmbulans = hospitals.reduce((t, h) => t + h.ambulans, 0)

  return (
    <AuthenticatedLayout user={auth.user} currentRoute="/ambulance">
      <Head title="Senarai Hospital" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Senarai Hospital</h1>

        {/* summary */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <StatBox icon={<Building2 />} label="Jumlah Hospital" value={hospitals.length} color="text-blue-600" />
          <StatBox icon={<BedDouble />} label="Jumlah Katil" value={totalBeds} color="text-purple-600" />
          <StatBox icon={<Truck />} label="Jumlah Ambulans" value={totalAmbulans} color="text-orange-600" />
          <StatBox icon={<ShieldCheck />} label="Operasi" value={hospitals.filter(h => h.status === 'Operasi').length} color="text-emerald-600" />
        </div>

        {/* filters (static) */}
        <div className="flex flex-wrap items-center gap-4">
          <input className="border rounded-md px-4 py-2 w-full sm:w-64" placeholder="Cari hospital..." />
          <select className="border rounded-md px-3 py-2 w-40">
            <option>Semua Status</option>
            <option>Operasi</option>
            <option>Tidak Operasi</option>
          </select>
          <select className="border rounded-md px-3 py-2 w-40">
            <option>Semua Kelas</option>
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>

        {/* hospital cards */}
        <div className="space-y-4">
          {hospitals.map((h) => (
            <div key={h.id} className="bg-white border rounded-xl px-6 py-5 shadow-sm flex flex-col md:flex-row justify-between gap-4">
              {/* left side */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`p-2 rounded-lg ${kelasColors[h.kelas]}`}>
                    <Hospital size={20} />   {/* fallback: <Building2 /> */}
                  </div>
                  <h2 className="font-semibold text-lg">{h.nama}</h2>
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${statusColors[h.status]}`}>
                    {h.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{h.alamat}</p>
                <p className="text-sm text-gray-600 mb-2"><strong>Telefon:</strong> {h.telefon}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                  <div><span className="font-medium">Kelas:</span> {h.kelas}</div>
                  <div><span className="font-medium">Katil:</span> {h.katil}</div>
                  <div><span className="font-medium">Ambulans:</span> {h.ambulans}</div>
                </div>
              </div>

              {/* right: actions (only Call & Map) */}
              <div className="flex flex-col items-end gap-2 min-w-[110px]">
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  {h.status === 'Operasi' && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                  {h.status === 'TidakOperasi' && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                  {h.status}
                </div>
                <div className="flex gap-2">
                  {/* Map opens Google Maps with coords */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${h.koordinat}`}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50"
                  >
                    <MapPin size={14} /> Lokasi
                  </a>
                  {/* tel: link for direct call */}
                  <a
                    href={`tel:${h.telefon.replace(/[^0-9]/g, '')}`}
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

/* simple stat box ------------------------------------------------------- */
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
