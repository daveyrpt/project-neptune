import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Droplet,
    AlertTriangle,
    Clock,
    MapPin,
    FileText,
    Wrench,
    CheckCircle,
    Eye,
    Badge,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from '@/Components/ui/sheet';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/Components/ui/select'
import { Button } from '@/Components/ui/button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { Textarea } from '@/Components/ui/textarea'
import React, { useState } from 'react';
const hydrants = [
  {
    id: 'KK-001',
    lokasi: 'Jalan Gaya',
    latlng: '5.9810, 116.0735',
    alamat: 'Hadapan Restoran Fook Yuen, Jalan Gaya, 88000 Kota Kinabalu, Sabah',
    status: 'Aktif',
    tekanan: 'Normal',
    jenis: 'Pillar',
    pemeriksaan: '15/12/2024',
    nota: '',
  },
  {
    id: 'KK-002',
    lokasi: 'Suria Sabah',
    latlng: '5.9833, 116.0711',
    alamat: 'Pintu Masuk Utama, Suria Sabah Shopping Mall, 88000 KK',
    status: 'Aktif',
    tekanan: 'Tinggi',
    jenis: 'Underground',
    pemeriksaan: '10/12/2024',
    nota: '',
  },
  {
    id: 'KK-003',
    lokasi: 'Sutera Harbour',
    latlng: '5.9762, 116.0689',
    alamat: 'Berhampiran Bangunan Magellan, Sutera Harbour, 88100 KK',
    status: 'Rosak',
    tekanan: 'Tiada',
    jenis: 'Pillar',
    pemeriksaan: '01/12/2024',
    nota: '',
  },
  {
    id: 'KK-004',
    lokasi: 'Api-Api Centre',
    latlng: '5.9825, 116.0750',
    alamat: 'Jalan Coastal, Api-Api Centre, 88000 Kota Kinabalu',
    status: 'Penyelenggaraan',
    tekanan: 'Rendah',
    jenis: 'Wall Mount',
    pemeriksaan: '20/12/2024',
    nota: 'Sedang dalam penyelenggaraan rutin',
  },
  {
    id: 'KK-005',
    lokasi: 'Tanjung Aru',
    latlng: '5.9851, 116.0794',
    alamat: 'Jalan Mat Salleh, bersebelahan SMK Tanjung Aru, 88100 KK',
    status: 'Aktif',
    tekanan: 'Normal',
    jenis: 'Pillar',
    pemeriksaan: '18/12/2024',
    nota: '',
  },
]


const statusColors = {
    Aktif: 'text-green-600 bg-green-100',
    Rosak: 'text-red-600 bg-red-100',
    Penyelenggaraan: 'text-yellow-700 bg-yellow-100',
};

const tekananColors = {
    Normal: 'text-green-600',
    Tinggi: 'text-green-700',
    Rendah: 'text-yellow-600',
    Tiada: 'text-red-600',
};

export default function Hydrant({ auth }) {
        const [selected, setSelected] = useState(null)
    return (
        <AuthenticatedLayout user={auth.user} currentRoute="/hydrant">
            <Head title="Status Pili Bomba" />
            <div className="space-y-6">

                {/* Header */}
                <h1 className="text-2xl font-bold">Status Pili Bomba</h1>

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    <StatBox icon={<CheckCircle />} label="Aktif" value="15" color="text-green-600" />
                    <StatBox icon={<AlertTriangle />} label="Rosak" value="3" color="text-red-600" />
                    <StatBox icon={<Clock />} label="Penyelenggaraan" value="2" color="text-yellow-700" />
                    <StatBox icon={<Droplet />} label="Jumlah" value="20" color="text-blue-600" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="text"
                        placeholder="Cari lokasi pili..."
                        className="border rounded-md px-4 py-2 w-full sm:w-64"
                    />
                    <select className="border rounded-md px-3 py-2">
                        <option>Semua Status</option>
                        <option>Aktif</option>
                        <option>Rosak</option>
                        <option>Penyelenggaraan</option>
                    </select>
                    <select className="border rounded-md px-3 py-2">
                        <option>Semua Kawasan</option>
                        <option>Kota Kinabalu</option>
                    </select>
                    <div className="ml-auto flex gap-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm">
                            <MapPin size={16} /> Lihat Peta
                        </button>
                        <button className="border px-4 py-2 rounded-md flex items-center gap-1 text-sm">
                            <FileText size={16} /> Laporan
                        </button>
                    </div>
                </div>

                {/* Hydrant Cards */}
<div className="space-y-4">
    {hydrants.map((h) => (
        <div
            key={h.id}
            className="bg-white border rounded-xl px-6 py-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
            {/* Left Section: Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                        <Droplet size={20} />
                    </div>
                    <h2 className="font-semibold text-lg text-gray-900">{h.lokasi}</h2>
                    <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${statusColors[h.status]}`}>
                        {h.status}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{h.alamat}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                    <div>
                        <span className="font-medium">ID Hidran:</span> {h.id}
                    </div>
                    <div>
                        <span className="font-medium">Tekanan:</span>{' '}
                        <span className={tekananColors[h.tekanan] || ''}>{h.tekanan}</span>
                    </div>
                    <div>
                        <span className="font-medium">Jenis:</span> {h.jenis}
                    </div>
                    <div>
                        <span className="font-medium">Pemeriksaan Terakhir:</span>{' '}
                        <span className="text-gray-900 font-semibold">{h.pemeriksaan}</span>
                    </div>
                </div>

                {h.nota && (
                    <div className="mt-2 bg-gray-50 text-sm p-3 rounded-md text-gray-700">
                        <strong>Nota:</strong> {h.nota}
                    </div>
                )}
            </div>

            {/* Right Section: Status + Actions */}
            <div className="flex flex-col items-end gap-2 min-w-[120px]">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    {h.status === 'Aktif' && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    {h.status === 'Rosak' && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                    {h.status === 'Penyelenggaraan' && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
                    {h.status}
                </div>
                <div className="flex gap-2">
                    {/* <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50">
                        <MapPin size={14} /> Lokasi
                    </button> */}
                                        <Sheet>

                                            <SheetTrigger asChild onClick={() => setSelected(h)}>
                                                <Button size="sm" variant="outline" className="gap-1">
                                                    <Eye size={14} /> Lihat
                                                </Button>
                                            </SheetTrigger>

                                        </Sheet>
                    <button className="border rounded-md px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50">
                        <FileText size={14} /> Laporan
                    </button>
                    {h.status === 'Rosak' && (
                        <button className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-orange-600">
                            <Wrench size={14} /> Baiki
                        </button>
                    )}
                </div>
            </div>
        </div>
    ))}
</div>


                {/* Maintenance Schedule (Static) */}
                <div className="mt-8 bg-white rounded-xl shadow border p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        Jadual Penyelenggaraan
                    </h3>

                    <div className="space-y-3 text-sm text-gray-700">
                        {[
                            {
                                lokasi: 'Jalan Gaya (KK-001)',
                                aktiviti: 'Pemeriksaan Berkala',
                                tarikh: '28/07/2024',
                                tekanan: 'Normal',
                            },
                            {
                                lokasi: 'Tanjung Aru (KK-002)',
                                aktiviti: 'Ujian Tekanan',
                                tarikh: '01/08/2024',
                                tekanan: 'Tinggi',
                            },
                            {
                                lokasi: 'Likas Bay (KK-003)',
                                aktiviti: 'Pembaikan Injap',
                                tarikh: '05/08/2024',
                                tekanan: 'Rendah',
                            },
                            {
                                lokasi: 'Putatan (KK-004)',
                                aktiviti: 'Penyelenggaraan Paip',
                                tarikh: '10/08/2024',
                                tekanan: 'Normal',
                            },
                            {
                                lokasi: 'Inanam (KK-005)',
                                aktiviti: 'Penggantian Kepala Hidran',
                                tarikh: '15/08/2024',
                                tekanan: 'Tinggi',
                            },
                        ].map((jadual, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between items-center"
                            >
                                <div>
                                    <div className="font-semibold text-gray-900">{jadual.lokasi}</div>
                                    <div className="text-sm text-gray-600">{jadual.aktiviti}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="font-semibold text-gray-900">{jadual.tarikh}</div>
                                    <div className="text-xs inline-block border px-2 py-0.5 rounded-full text-gray-700">
                                        {jadual.tekanan}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
                            {/* ─── DETAILS SHEET ─────────────────────────────────────────── */}
                            <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                                <SheetContent
                                    side="right"
                                    className="sm:max-w-none w-[50vw] overflow-y-auto"
                                >
                                    {selected && (
                                        <>
                                            {/* <SheetHeader>
                                                <SheetTitle>
                                                    Maklumat Insiden #{selected.id}
                                                </SheetTitle>
                                            </SheetHeader> */}
            
                                            {/* reuse your existing detail component */}
                                            <IncidentDetails inc={selected} />
                                        </>
                                    )}
                                </SheetContent>
                            </Sheet>
        </AuthenticatedLayout>
    );
}

function IncidentDetails({ inc }) {
    const [lat, lng] = inc.latlng.split(',').map(Number);

    return (
        <>
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                    <Droplet className="text-blue-600" /> Butiran Pili #{inc.id}
                </SheetTitle>
                <SheetDescription className="text-base font-medium">
                    {inc.lokasi}
                </SheetDescription>
            </SheetHeader>

            <div className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2 mt-6 space-y-6 text-sm">
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <Field label="ID Hidran" value={inc.id} />
                        <Field label="Lokasi" value={inc.lokasi} />
                        <Field label="Alamat Penuh" value={inc.alamat} />
                        <Field label="Jenis" value={inc.jenis} />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <Field label="Status">
                            <Badge className={`${statusColors[inc.status]} font-medium`}>
                                {inc.status}
                            </Badge>
                        </Field>
                        <Field label="Tekanan Air">
                            <span className={tekananColors[inc.tekanan]}>{inc.tekanan}</span>
                        </Field>
                        <Field label="Tarikh Pemeriksaan">
                            {inc.pemeriksaan}
                        </Field>
                    </div>
                </div>

                {/* Optional Note */}
                {inc.nota && (
                    <Field label="Nota Penyelenggaraan">
                        <div className="bg-gray-50 text-sm p-3 rounded-md text-gray-700">
                            {inc.nota}
                        </div>
                    </Field>
                )}

                {/* Leaflet Map */}
                <Field label="Peta Lokasi GPS">
                    <MapContainer
                        center={[lat, lng]}
                        zoom={16}
                        scrollWheelZoom={false}
                        style={{ height: '200px', borderRadius: '8px', width: '100%' }}
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[lat, lng]}>
                            <Popup>{inc.lokasi}</Popup>
                        </Marker>
                    </MapContainer>
                </Field>
            </div>
        </>
    );
}


function StatBox({ icon, label, value, color }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border">
            <div className={`p-2 rounded-full bg-gray-100 ${color}`}>{icon}</div>
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

function Field({ label, value, children }) {
    return (
        <div>
            <h5 className="font-medium mb-1">{label}</h5>
            {children ? (
                children
            ) : (
                <p className="text-muted-foreground">{value || '-'}</p>
            )}
        </div>
    )
}

function SelectField({ label, placeholder, options = [] }) {
    return (
        <div>
            <label className="block mb-1 font-medium">{label}</label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
