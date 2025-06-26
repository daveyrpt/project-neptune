import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {
  ListChecks,
  Filter,
  Users,
  Clock,
  FileDown,
} from 'lucide-react'

/* --------------------------------------------------------------------------
   DUMMY AUDIT LOG DATA
   -------------------------------------------------------------------------- */
const dummyLogs = [
  {
    id: 1,
    timestamp: '2025-06-26 14:55',
    actor: 'Siti Aminah',
    role: 'Dispatcher',
    action: 'Update',
    target_type: 'Incident',
    target_id: 203,
    description: 'Changed status to “Dispatched”',
    ip: '203.82.112.15',
  },
  {
    id: 2,
    timestamp: '2025-06-26 14:42',
    actor: 'Lim Wei Kiat',
    role: 'Admin',
    action: 'Create',
    target_type: 'Police Station',
    target_id: 'BP-03',
    description: 'Added new station Penampang',
    ip: '10.0.2.1',
  },
  {
    id: 3,
    timestamp: '2025-06-26 14:12',
    actor: 'Admin',
    role: 'Admin',
    action: 'Delete',
    target_type: 'Hydrant',
    target_id: 'KK-005',
    description: 'Removed inactive hydrant',
    ip: '10.0.2.1',
  },
  {
    id: 4,
    timestamp: '2025-06-26 13:47',
    actor: 'Hakim',
    role: 'Supervisor',
    action: 'Assign',
    target_type: 'Incident',
    target_id: 201,
    description: 'Assigned to Balai Bomba Lintas',
    ip: '182.172.11.22',
  },
  {
    id: 5,
    timestamp: '2025-06-26 12:55',
    actor: 'Jessie Chong',
    role: 'Dispatcher',
    action: 'Update',
    target_type: 'Ambulance',
    target_id: 'AMB-02',
    description: 'ETA updated to 5 min',
    ip: '203.82.112.15',
  },
  {
    id: 6,
    timestamp: '2025-06-26 12:33',
    actor: 'Bob',
    role: 'Dispatcher',
    action: 'Login',
    target_type: 'Auth',
    target_id: '-',
    description: 'User logged in',
    ip: '203.82.112.22',
  },
  {
    id: 7,
    timestamp: '2025-06-26 12:30',
    actor: 'Bob',
    role: 'Dispatcher',
    action: 'Logout',
    target_type: 'Auth',
    target_id: '-',
    description: 'User logged out',
    ip: '203.82.112.22',
  },
  {
    id: 8,
    timestamp: '2025-06-25 18:10',
    actor: 'Fazilah',
    role: 'Admin',
    action: 'Create',
    target_type: 'Hospital',
    target_id: 'HOSP-05',
    description: 'Added new hospital Luyang Medical',
    ip: '10.0.3.2',
  },
  {
    id: 9,
    timestamp: '2025-06-25 17:55',
    actor: 'Admin',
    role: 'Admin',
    action: 'Update',
    target_type: 'User',
    target_id: 32,
    description: 'Granted “Supervisor” role',
    ip: '10.0.3.2',
  },
  {
    id: 10,
    timestamp: '2025-06-25 17:20',
    actor: 'Henry Goh',
    role: 'Dispatcher',
    action: 'Assign',
    target_type: 'Incident',
    target_id: 199,
    description: 'Assigned to Balai Polis Kota Kinabalu',
    ip: '203.82.111.55',
  },
]

/* --------------------------------------------------------------------------
   STAT HELPERS
   -------------------------------------------------------------------------- */
const totalLogs = dummyLogs.length
const uniqueUsers = [...new Set(dummyLogs.map((l) => l.actor))].length
const last24h = dummyLogs.filter((l) => {
  const hours = (Date.now() - new Date(l.timestamp)) / 36e5
  return hours < 24
}).length

/* --------------------------------------------------------------------------
   MAIN PAGE
   -------------------------------------------------------------------------- */
export default function Audit({ auth }) {
  /* simple pagination demo */
  const [page, setPage] = useState(1)
  const pageSize = 5
  const pages = Math.ceil(totalLogs / pageSize)
  const logs = dummyLogs.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AuthenticatedLayout user={auth.user} currentRoute="/audit">
      <Head title="Audit Log" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Audit Log</h1>

        {/* summary */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <StatBox icon={<ListChecks />} label="Jumlah Log" value={totalLogs} color="text-blue-600" />
          <StatBox icon={<Users />} label="Pengguna Unik" value={uniqueUsers} color="text-green-600" />
          <StatBox icon={<Clock />} label="24 Jam Terakhir" value={last24h} color="text-orange-600" />
        </div>

        {/* filter row (placeholder) */}
        <div className="flex items-center gap-2">
          <input placeholder="Cari pengguna / target…" className="border px-3 py-2 rounded-md w-full sm:w-64" />
          <input
            type="date"
            className="border px-3 py-2 rounded-md"
            title="Dari"
          />
          <span>—</span>
          <input
            type="date"
            className="border px-3 py-2 rounded-md"
            title="Hingga"
          />
          <button className="flex items-center gap-1 border px-3 py-2 rounded-md">
            <Filter size={16} /> Tapis
          </button>
          <button className="flex items-center gap-1 border px-3 py-2 rounded-md"  onClick={() => window.open(route('report.auditPrint'), '_blank')}>
            <FileDown size={16} /> Export
          </button>

        </div>

        {/* table */}
<div className="overflow-x-auto rounded-lg shadow border bg-white">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-gray-100 text-gray-800 border-b">
      <tr>
        <th className="px-4 py-3 text-left">Tarikh & Masa</th>
        <th className="px-4 py-3 text-left">Pengguna</th>
        <th className="px-4 py-3 text-left">Tindakan</th>
        <th className="px-4 py-3 text-left">Target</th>
        <th className="px-4 py-3 text-left">Deskripsi</th>
      </tr>
    </thead>
    <tbody>
      {logs.map((log, idx) => (
        <tr key={log.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
          <td className="px-4 py-3 whitespace-nowrap">{log.timestamp}</td>
          <td className="px-4 py-3">{log.actor}</td>
          <td className="px-4 py-3">{log.action}</td>
          <td className="px-4 py-3">{log.target_type} #{log.target_id}</td>
          <td className="px-4 py-3">{log.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* simple pagination */}
        <div className="flex gap-2 justify-end pt-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="px-2 text-sm">{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

/* --------------------------------------------------------------------------
   Stat Box (re-use)
   -------------------------------------------------------------------------- */
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
