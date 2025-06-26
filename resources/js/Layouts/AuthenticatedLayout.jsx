import { Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    FileText,
    Droplet,
    Building,
    History,
    LogOut,
    CheckCircle,
    Flame,
    Hospital,
    Shield,
    Siren,
} from 'lucide-react';
import { Toaster } from '@/Components/ui/toaster'
export default function AuthenticatedLayout({ user, children, currentRoute }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Toaster />
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4 space-y-6">
                {/* brand */}
                <div className="text-2xl font-bold flex items-center gap-2">
                    <Flame className="text-orange-600 size-6" />
                    <h1 className="text-lg font-bold">
                        <span className="text-red-600">Fire</span>MAS
                    </h1>
                </div>

                {/* user card */}
                <div className="flex items-center gap-3 bg-gray-50 border px-3 py-3 rounded-lg">
                    {/* avatar circle */}
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-semibold">
                        {getInitials(auth.user.name)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-gray-600">
                            {auth.user.role.display_name}
                        </p>
                    </div>
                </div>
                <nav className="space-y-2">
                    <NavItem href="/dashboard" label="Peta Insiden" icon={<MapPin size={18} />} currentRoute={currentRoute} />
                    <NavItem href="/report" label="Kecemasan" icon={<Siren size={18} />} currentRoute={currentRoute} badge="3" />
                    <NavItem href="/hydrant" label="Status Pili Bomba" icon={<Droplet size={18} />} currentRoute={currentRoute} />
                    <NavItem href="/station" label="Balai Bomba " icon={<Building size={18} />} currentRoute={currentRoute} />
                    <NavItem href="/ambulance" label="Hospital " icon={<Hospital size={18} />} currentRoute={currentRoute} />
                    <NavItem href="/police" label="Balai Polis " icon={<Shield size={18} />} currentRoute={currentRoute} />
                    <NavItem href="/list" label="Laporan" icon={<CheckCircle size={18} />} currentRoute={currentRoute} badge="11"/>
                    <NavItem href="/audit" label="Audit & Sejarah" icon={<History size={18} />} currentRoute={currentRoute} />
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
                <div className="text-sm text-green-600 font-semibold">● Sistem Aktif</div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                >
                    <LogOut size={16} />
                    Log Keluar
                </Link>
                </header>

                <main className="p-6 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, label, icon, currentRoute, badge = 0 }) {
  const isActive = currentRoute === href

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
        isActive ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}

      {/* badge (only if > 0) */}
      {badge > 0 && (
        <span className="ml-auto inline-flex items-center justify-center text-[10px] font-semibold text-white bg-red-600 rounded-full h-5 min-w-[1.25rem] px-1.5">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

function getInitials(name = '') {
    return name
        .split(' ')
        .map(p => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
}