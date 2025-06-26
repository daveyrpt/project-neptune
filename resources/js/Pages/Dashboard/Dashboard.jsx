import { Head, Link } from '@inertiajs/react'
import {
  MapPin,
  FileText,
  Flame,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Droplet,
  Wind,
  CloudDrizzle,
  LogOut,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card'
import Map from '@/components/Map'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth }) {

  return (
    <>
    <AuthenticatedLayout user={auth.user} currentRoute="/dashboard">
      <Head title="Peta Insiden" />
      {/* <h1 className="text-2xl font-bold">Laman Utama</h1> */}
      {/* ─── Topbar ─────────────────────────────────────────────── */}
      {/* <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Flame className="text-orange-600 size-6" />
          <h1 className="text-lg font-bold"><span className="text-red-600">Fire</span>MAS</h1>
          <span className="text-xs border px-2 py-0.5 rounded-full font-medium">Pusat Kawalan</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 text-green-600">
            ● Sistem Aktif
          </span>
          <Link href={route('logout')} method="post" as="button" className="text-muted-foreground hover:text-black flex items-center gap-1">
            <LogOut className="size-4" />
            Log Keluar
          </Link>
        </div>
      </header> */}

      {/* ─── Layout Wrapper ─────────────────────────────────────── */}
      <div className="flex min-h-screen bg-muted/50">

        {/* ─── Sidebar ───────────────────────────────────────────── */}
        {/* <aside className="w-60 bg-white border-r p-6 space-y-4 text-sm">
          <SidebarItem icon={<MapPin />} label="Peta Insiden" active />
          <SidebarItem icon={<FileText />} label="Senarai Laporan" />
          <SidebarItem icon={<Droplet />} label="Status Pili Bomba" />
          <SidebarItem icon={<ShieldAlert />} label="Laporan Automatik" />
          <SidebarItem icon={<Clock />} label="Audit & Sejarah" />
        </aside> */}

        {/* ─── Main Content ─────────────────────────────────────── */}
        <main className="flex-1 p-10 space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-bold">Peta Insiden Masa Nyata</h2>
            <div className="flex gap-2 text-sm">
              <BadgeInfo icon={<Wind className="size-4" />} label="Angin: 15 km/j" />
              <BadgeInfo icon={<CloudDrizzle className="size-4" />} label="Kelembapan: 65%" />
            </div>
          </div>

          {/* <div className="bg-white p-10 rounded-xl shadow-md text-center text-muted-foreground">
            <MapPin className="mx-auto size-8 mb-2" />
            <p className="text-lg font-medium">Peta Interaktif</p>
            <p className="text-sm">Integrasi Leaflet/Mapbox akan dipaparkan di sini</p>
          </div> */}
          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <StatCard icon={<ShieldAlert className="text-red-600" />} label="Insiden Aktif" value="12" />
            <StatCard icon={<Clock className="text-orange-500" />} label="Menunggu" value="3" />
            <StatCard icon={<CheckCircle2 className="text-green-600" />} label="Selesai Hari Ini" value="4" />
            <StatCard icon={<Droplet className="text-blue-600" />} label="Hidran Aktif" value="87/100" />
          </div>

            <Map
            markers={[
                { latlng: [3.140853, 101.693207], label: 'Insiden 1' },
                { latlng: [3.139, 101.6869], label: 'Hidran 1' },
            ]}
            />

          {/* Summary badges */}
          <div className="flex gap-4 flex-wrap">
            <PillCount color="red" icon="●" count={4} label="Insiden Aktif" />
            <PillCount color="blue" icon="●" count={12} label="Hidran Tersedia" />
          </div>


        </main>
      </div>
      </AuthenticatedLayout>
    </>
  )
}

/* ─── Reusable UI pieces ───────────────────────────────────────────── */

function SidebarItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${active ? 'bg-red-50 text-red-600' : 'hover:bg-muted text-muted-foreground'}`}>
      {icon}
      {label}
    </div>
  )
}

function BadgeInfo({ icon, label }) {
  return (
    <div className="flex items-center gap-1 border rounded-full px-3 py-1 bg-white shadow text-xs">
      {icon} {label}
    </div>
  )
}

function PillCount({ color = 'gray', icon, count, label }) {
  return (
    <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-full text-sm shadow">
      <span className={`text-${color}-500`}>{icon}</span>
      <span>{count} {label}</span>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="text-center py-6">
      <CardHeader className="items-center">
        {icon}
        <CardTitle className="text-lg mt-2">{label}</CardTitle>
        <CardDescription className="text-2xl font-bold text-foreground">{value}</CardDescription>
      </CardHeader>
    </Card>
  )
}
