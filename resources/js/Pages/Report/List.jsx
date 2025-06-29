import React, { useState } from 'react'
import {
    Flame,
    Clock,
    MessageCircle,
    User2,
    Camera,
    UserPlus,
    Phone,
    Save,
    Sparkles,
    CheckCircle2,
    XCircle,
    Eye,
    Printer,
    Map as MapIcon,
} from 'lucide-react'

import { Card } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { useToast } from '@/Components/ui/use-toast'
import { Toaster } from '@/Components/ui/toaster'
import { nanoid } from 'nanoid'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from '@/Components/ui/sheet'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/Components/ui/select'
import { Textarea } from '@/Components/ui/textarea'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'


/* -------------------------------------------------------------------------- */
/*  Dummy data (swap with Inertia props)                                      */
/* -------------------------------------------------------------------------- */
const incidents = [
    {
        id: 301,
        lokasi: 'Pasar Filipina, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Kebakaran kecil gerai makanan berjaya dipadamkan. Tiada kecederaan.',
        masa: '18:05',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        pegawai: 'Azahari Salleh',
        phone: '+60129991100',
        address: 'Jalan Tun Fuad Stephens, 88000 KK',
        foto: 1,
        gps: '5.9837, 116.0769',
    },
    {
        id: 302,
        lokasi: 'Imago Shopping Mall, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Moderate',
        message: 'Papan tanda LED terbakar di tingkat 3. Sistem sprinkler diaktifkan.',
        masa: '17:30',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        pegawai: 'Chan Mei Ling',
        phone: '+60137776655',
        address: 'KK Times Square, 88100 KK',
        foto: 2,
        gps: '5.9649, 116.0647',
    },
    {
        id: 303,
        lokasi: 'Bandar Sierra, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Kebakaran sampah di lot kosong dipadamkan penduduk setempat.',
        masa: '16:45',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        pegawai: 'Fazilah Ismail',
        phone: '+60143446789',
        address: 'Lorong Sierra 2, 89500 KK',
        foto: 0,
        gps: '5.8962, 116.0773',
    },
    {
        id: 304,
        lokasi: 'UMS, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Moderate',
        message: 'Makmal komputer terjejas akibat litar pintas. Api dipadam oleh staf keselamatan.',
        masa: '16:10',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        pegawai: 'Dr. Zamri Hassan',
        phone: '+60128889977',
        address: 'Jalan UMS, 88400 KK',
        foto: 1,
        gps: '6.0362, 116.1184',
    },
    {
        id: 305,
        lokasi: 'Sutera Harbour Marina, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Asap dari generator kapal. Kapal sudah dipindahkan jauh dari dermaga.',
        masa: '15:40',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        pegawai: 'Lim Wei Kiat',
        phone: '+60138881234',
        address: 'Jalan Coastal, 88100 KK',
        foto: 0,
        gps: '5.9688, 116.0611',
    },
    {
        id: 306,
        lokasi: 'Likas Sports Complex, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Pendawaian papan billboard meletup, api kecil dipadamkan.',
        masa: '15:05',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        pegawai: 'Noraini Mohd',
        phone: '+60123335566',
        address: 'Lorong Kompleks Sukan, Likas, 88400 KK',
        foto: 0,
        gps: '5.9911, 116.1059',
    },
    {
        id: 307,
        lokasi: 'Pusat Kraftangan Sabah, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Bara kayu ukiran memercik, staf bertindak memadam segera.',
        masa: '14:50',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        pegawai: 'Jessie Chong',
        phone: '+60131231234',
        address: 'Jalan Tun Fuad Stephens, 88000 KK',
        foto: 0,
        gps: '5.9755, 116.0792',
    },
    {
        id: 308,
        lokasi: 'Inanam Town, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Moderate',
        message: 'Stor perabot terbakar sebahagian. Api berjaya dikawal pasukan bomba.',
        masa: '14:25',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        pegawai: 'Mohd Azlan',
        phone: '+60199887766',
        address: 'Jalan Tuaran, Inanam, 88450 KK',
        foto: 2,
        gps: '6.0164, 116.1132',
    },
    {
        id: 309,
        lokasi: 'Tanjung Aru Beach, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Api kecil dari unggun barbeque berhampiran tong sampah.',
        masa: '14:00',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        pegawai: 'Roslan Mat',
        phone: '+60136778899',
        address: 'Jalan Mat Salleh, 88100 KK',
        foto: 1,
        gps: '5.9581, 116.0446',
    },
    {
        id: 310,
        lokasi: 'City Mall, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message: 'Penggera asap palsu pada salah satu kedai. Tiada api ditemui.',
        masa: '13:35',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        pegawai: 'Henry Goh',
        phone: '+60195551133',
        address: 'Jalan Lintas, 88300 KK',
        foto: 0,
        gps: '5.9499, 116.0933',
    },
    // … more resolved incidents …
]

/* -------------------------------------------------------------------------- */

export default function Completed({ auth }) {
    const [selected, setSelected] = useState(null)

    const [jenis, setJenis] = useState('');
    // Approve / Reject — replace with real routes
    const approve = (id) => router.post(route('incidents.approve', id))
    const reject = (id) => router.post(route('incidents.reject', id))

    const waiting = incidents.filter((i) => i.tahap === 'Resolved')

    return (
        <>
            <AuthenticatedLayout user={auth.user} currentRoute="/list">
                <h1 className="text-2xl font-bold mb-6">
                    Insiden Selesai — Menunggu Kelulusan
                </h1>

                {waiting.length === 0 ? (
                    <p className="text-muted-foreground">Tiada insiden untuk diluluskan.</p>
                ) : (
                    <div className="space-y-6">
                        {waiting.map((inc) => (
                            <Card key={inc.id} className="p-6">
                                <div className="flex flex-col gap-2">
                                    {/* header */}
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h3 className="text-lg font-semibold">{inc.lokasi}</h3>
                                        <Badge className="bg-green-600 text-white">Selesai</Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {inc.message}
                                    </p>

                                    {/* meta */}
                                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {inc.masa} – {inc.tarikh}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle size={14} /> {inc.sumber}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User2 size={14} /> {inc.pegawai}
                                        </span>
                                    </div>

                                    {/* actions */}
                                    <div className="flex flex-wrap gap-2 justify-end mt-4">
                                        {/* ─── Lihat sheet trigger ───────────────────────── */}
                                        <Sheet>

                                            <SheetTrigger asChild onClick={() => setSelected(inc)}>
                                                <Button size="sm" variant="outline" className="gap-1">
                                                    <Eye size={14} /> Lihat
                                                </Button>
                                            </SheetTrigger>

                                        </Sheet>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1"
                                            onClick={() => window.open(route('incidents.pdf', inc.id), '_blank')}
                                        >
                                            <Printer size={14} /> Cetak
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => reject(inc.id)}
                                            className="gap-1 bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <XCircle size={14} /> Tolak
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white gap-1"
                                            onClick={() => approve(inc.id)}
                                        >
                                            <CheckCircle2 size={14} /> Luluskan
                                        </Button>


                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ─── DETAILS SHEET ─────────────────────────────────────────── */}
                <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                    <SheetContent
                        side="right"
                        className="sm:max-w-none w-[50vw] overflow-y-auto"
                    >
                        {selected && (
                            <>
                                <SheetHeader>
                                    <SheetTitle>
                                        Maklumat Insiden #{selected.id}
                                    </SheetTitle>
                                </SheetHeader>

                                {/* reuse your existing detail component */}
                                <IncidentDetails inc={selected} />
                            </>
                        )}
                    </SheetContent>
                </Sheet>
            </AuthenticatedLayout>
        </>
    )
}
function IncidentDetails({ inc }) {
    return (
        <>
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                    <Flame className="text-rose-500" /> Butiran Insiden #{inc.id}
                </SheetTitle>
                <SheetDescription className="text-base font-medium">
                    {inc.lokasi} — {inc.tarikh} {inc.masa}
                </SheetDescription>
            </SheetHeader>

            {/* Scrollable container starts here */}
            <div className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2 mt-6 space-y-6">
                {/* message */}
                <div>
                    <h4 className="font-semibold mb-1">Mesej Penuh</h4>
                    <div className="bg-muted/50 p-4 rounded-md text-sm">{inc.message}</div>
                </div>

                {/* two-column grid */}
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    {/* left column */}
                    <div className="space-y-4">
                        <Field label="Pelapor" value={inc.pegawai} />
                        <Field label="Telefon" value={inc.phone} />
                        <Field label="Alamat Penuh" value={inc.address} />

                        <Field label="Foto Dilampirkan">
                            <div className="h-32 bg-muted flex items-center justify-center rounded-md">
                                <Camera className="text-muted-foreground" />
                            </div>
                        </Field>

                        <Field label="Lokasi GPS">
                            {/* parse "lat,lng" string to numbers */}
                            {(() => {
                                const [lat, lng] = inc.gps.split(',').map(Number)
                                return (
                                    <MapContainer
                                        center={[lat, lng]}
                                        zoom={15}
                                        scrollWheelZoom={false}
                                        style={{ height: '8rem', borderRadius: '0.5rem', width: '100%' }}
                                    >
                                        <TileLayer
                                            attribution="&copy; OpenStreetMap contributors"
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[lat, lng]}>
                                            <Popup>{inc.lokasi}</Popup>
                                        </Marker>
                                    </MapContainer>
                                )
                            })()}
                        </Field>
                    </div>

                    {/* right column */}
                    <div className="space-y-4">
                        <SelectField label="Status" placeholder="Baharu" 
                            options={['Baharu', 'Dalam Proses', 'Selesai']}
                        />
                        <SelectField label="Keutamaan" placeholder="Pilih Keutamaan" 
                            options={['Kritikal', 'Sederhana']}
                        />
                        <SelectField
                            label="Jenis Kecemasan"
                            placeholder="Pilih jenis"
                            options={['Khidmat Khas', 'Kebakaran', 'Khidmat Kemanusiaan']}
                        />
                        <Field label="No. Bil" value='01/25' />
                        <div>
                            <label className="block mb-1 font-medium">Anggaran Kerugian</label>
                            <Textarea placeholder="Tambah anggaran kerugian..." className="h-6" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Nota Dalaman</label>
                            <Textarea placeholder="Tambah nota untuk pasukan…" className="h-32" />
                        </div>

                        {/* buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button className="bg-red-600 hover:bg-red-700 gap-1">
                                <Save size={16} /> Simpan Perubahan
                            </Button>
                            <Button variant="outline" className="gap-1">
                                <Phone size={16} /> Hubungi Pelapor
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


/* simple text field -------------------------------------------------------- */
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

/* select field wrapper ----------------------------------------------------- */
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
