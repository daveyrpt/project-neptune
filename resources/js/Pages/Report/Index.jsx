import React, { useState, useEffect, useRef } from 'react'
import {
    Flame,
    Clock,
    MessageCircle,
    User2,
    Camera,
    Eye,
    UserPlus,
    Phone,
    Save,
    Sparkles,
    Map as MapIcon,
} from 'lucide-react'
import { Link, usePage } from '@inertiajs/react';
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/Components/ui/select'
import { Textarea } from '@/Components/ui/textarea'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import axios from 'axios'
/* ------------------------------------------------------------------ */
/* 1)  initial incidents … (keep the KK ones you already have)        */
/* ------------------------------------------------------------------ */
const initialIncidents = [
    {
        id: 101,
        lokasi: 'Jalan Gaya, Kota Kinabalu',
        tahap: 'Responding',             // New | Responding | Resolved
        status: 'Critical',              // Low | Moderate | Critical
        message:
            'Kedai dua tingkat terbakar. Api merebak ke bumbung bangunan sebelah. Orang ramai panik di kawasan sekitar.',
        masa: '17:05',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        name: 'Lim Wei Kiat',
        phone: '+60138881234',
        address: 'No. 23, Jalan Gaya, 88000 Kota Kinabalu, Sabah',
        foto: 3,
        gps: '5.9850, 116.0737',
        tugasan: 'Balai Bomba Kota Kinabalu',
    },
    {
        id: 102,
        lokasi: 'Sutera Harbour, Kota Kinabalu',
        tahap: 'New',
        status: 'Moderate',
        message:
            'Asap kelihatan dari kawasan stor marina. Tiada api kelihatan tetapi bau hangit kuat.',
        masa: '16:40',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        name: 'Nurul Afiqah',
        phone: '+60172223344',
        address: 'Jalan Coastal, Sutera Harbour, 88100 Kota Kinabalu',
        foto: 1,
        gps: '5.9688, 116.0611',
        tugasan: '',
    },
    {
        id: 103,
        lokasi: 'Universiti Malaysia Sabah (UMS), Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message:
            'Kebakaran kecil di makmal kimia berjaya dipadamkan oleh pasukan keselamatan kampus.',
        masa: '15:20',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        name: 'Dr. Jasni Rahman',
        phone: '+60125556677',
        address: 'Jalan UMS, 88400 Kota Kinabalu',
        foto: 0,
        gps: '6.0362, 116.1184',
        tugasan: '',
    },
    {
        id: 104,
        lokasi: 'Inanam, Kota Kinabalu',
        tahap: 'New',
        status: 'Critical',
        message:
            'Gudang perabot terbakar. Api marak cepat dan ada risiko letupan bahan mudah bakar.',
        masa: '14:55',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        name: 'Mohd Azlan',
        phone: '+60199887766',
        address: 'Lorong Kiansom, Inanam, 88450 Kota Kinabalu',
        foto: 2,
        gps: '5.9942, 116.1153',
        tugasan: '',
    },
    {
        id: 105,
        lokasi: 'Kepayan, Kota Kinabalu',
        tahap: 'Responding',
        status: 'Moderate',
        message:
            'Kebakaran rumput di lot kosong berhampiran perumahan. Angin sederhana dari arah laut.',
        masa: '14:30',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        name: 'Jessie Chong',
        phone: '+60131231234',
        address: 'Jalan Kepayan, 88300 Kota Kinabalu',
        foto: 0,
        gps: '5.9393, 116.0598',
        tugasan: 'Balai Bomba Penampang',
    },
    {
        id: 106,
        lokasi: 'Tanjung Aru, Kota Kinabalu',
        tahap: 'New',
        status: 'Moderate',
        message:
            'Asap keluar dari bilik stor restoran berhampiran pantai. Terdapat bau plastik terbakar.',
        masa: '13:50',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        name: 'Roslan Mat',
        phone: '+60136778899',
        address: 'Jalan Mat Salleh, Tanjung Aru, 88100 Kota Kinabalu',
        foto: 1,
        gps: '5.9581, 116.0446',
        tugasan: '',
    },
    {
        id: 107,
        lokasi: 'Likas, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message:
            'Penduduk melaporkan asap dari bilik meter elektrik. Tiada api dikesan semasa pasukan tiba.',
        masa: '12:20',
        tarikh: '26/06/2025',
        sumber: 'WhatsApp',
        name: 'Fazilah Ismail',
        phone: '+60134442211',
        address: 'Jalan Tuaran Bypass, Likas, 88400 Kota Kinabalu',
        foto: 0,
        gps: '6.0078, 116.1004',
        tugasan: '',
    },
    {
        id: 109,
        lokasi: 'Bandar Sierra, Kota Kinabalu',
        tahap: 'New',
        status: 'Moderate',
        message:
            'Terdapat percikan api dari suis utama rumah. Penghuni berjaya keluar dengan selamat.',
        masa: '11:20',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        name: 'Aina Rahim',
        phone: '+60189997777',
        address: 'Lorong Sierra 5, Bandar Sierra, 89500 Kota Kinabalu',
        foto: 1,
        gps: '5.8962, 116.0773',
        tugasan: '',
    },
    {
        id: 110,
        lokasi: 'Putatan, Kota Kinabalu',
        tahap: 'Resolved',
        status: 'Low',
        message:
            'Kebakaran kecil di tempat buangan sampah. Tiada kerosakan dilaporkan.',
        masa: '10:50',
        tarikh: '26/06/2025',
        sumber: 'Phone',
        name: 'Yusof Idris',
        phone: '+60138889911',
        address: 'Jalan Putatan, 88200 Kota Kinabalu',
        foto: 0,
        gps: '5.8951, 116.0506',
        tugasan: '',
    },
]
/* ------------------------------------------------------------------ */
/* 2)  helper to create a random KK incident                          */
/* ------------------------------------------------------------------ */
function createRandomIncident() {
    const locations = [
        {
            lokasi: 'Asia City, Kota Kinabalu',
            gps: '5.9773, 116.0721',
            address: 'Block C, Lorong Centre Point, 88000 KK',
        },
        {
            lokasi: 'Pasar Filipina, Kota Kinabalu',
            gps: '5.9837, 116.0769',
            address: 'Jalan Tun Fuad Stephens, 88000 KK',
        },
        {
            lokasi: 'One Borneo Hypermall, KK',
            gps: '6.0435, 116.1181',
            address: 'Jalan Sulaman, 88400 KK',
        },
    ]
    const pick = locations[Math.floor(Math.random() * locations.length)]

    return {
        id: nanoid(6),                // e.g. "Vd12aB"
        lokasi: pick.lokasi,
        tahap: 'New',
        status: 'Moderate',
        message: 'Orang awam melaporkan asap tebal dan bau hangit.',
        masa: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        tarikh: new Date().toLocaleDateString('ms-MY'),
        sumber: 'WhatsApp',
        name: 'Pelapor Anonim',
        phone: '',
        address: pick.address,
        foto: 0,
        gps: pick.gps,
        tugasan: '',
    }
}

/* status & tahap badge colours -------------------------------------------- */
const statusColor = {
    Critical: 'bg-red-100 text-red-700',
    Moderate: 'bg-orange-100 text-orange-700',
    Low: 'bg-lime-100 text-lime-700',
}
const tahapColor = {
    New: 'bg-blue-600 text-white',
    Responding: 'bg-orange-500 text-white',
    Resolved: 'bg-green-600 text-white',
}

export default function Index() {


    const { auth, details } = usePage().props;
    console.log(details)
    const [selected, setSelected] = useState(null) // incident currently viewed
    // const [incidents, setIncidents] = useState([
    //     ...details,          // real DB data
    //     ...initialIncidents  // fallback/test data
    // ]);
   const [incidents, setIncidents] = useState(initialIncidents);
    const { toast } = useToast()

const [lastSeenId, setLastSeenId] = useState(null);
const [newIncident, setNewIncident] = useState(null);
useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.get('/api/incidents');
            const realData = res.data;

            if (Array.isArray(realData)) {
                const merged = [
                    ...realData,
                    ...initialIncidents.filter(dummy =>
                        !realData.some(real => String(real.id) === String(dummy.id))
                    ),
                ];

                const latest = realData[0];
                if (latest && String(latest.id) !== String(lastSeenId)) {
                    // new Audio('/images/siren.mp3').play();

                    setNewIncident(latest); // 🔥 trigger modal
                    setLastSeenId(latest.id);
                }

                setIncidents(merged);
            }
        } catch (error) {
            console.error('❌ Failed to fetch incidents:', error);
        }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
}, [lastSeenId]);


  const hasInteracted = useRef(false);
  const audioRef = useRef(null);

  // 1️⃣ Track first user click anywhere on page
  useEffect(() => {
    const handleClick = () => {
      hasInteracted.current = true;
    };
    window.addEventListener('click', handleClick, { once: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 2️⃣ Prepare the audio once
  useEffect(() => {
    audioRef.current = new Audio('/images/siren.mp3'); // Ensure this file is in /public/
  }, []);

  // 3️⃣ When new incident appears and user interacted, play sound
  useEffect(() => {
    if (newIncident && hasInteracted.current && audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.warn('🔇 Sound failed:', e.message);
      });
    }
  }, [newIncident]);


    const handleSimulate = () => {
        const newIncident = createRandomIncident()
        setIncidents((prev) => [newIncident, ...prev])   // prepend to list

        toast({
            title: '🚨  Insiden baharu dilaporkan!',
            description: `${newIncident.lokasi} pada ${newIncident.masa}`,
            duration: 5000,
        })
    }
    return (
        <>
            <AuthenticatedLayout user={auth.user} currentRoute="/report">



                <h1 className="text-2xl font-bold mb-4">Senarai Kecemasan</h1>
                {/*  Simulate button  */}
                <div className="flex justify-end mb-4">
                    <Button onClick={handleSimulate} className="gap-2">
                        <Sparkles size={16} /> Simulasi Insiden
                    </Button>
                </div>
                {/* ─── Cards list ───────────────────────────────────────────── */}
                <div className="space-y-6">
                    {incidents.map((inc) => (
                        <IncidentCard
                            key={inc.id}
                            inc={inc}
                            onOpen={() => setSelected(inc)}
                        />
                    ))}
                </div>

                {/* ─── Detail sheet ─────────────────────────────────────────── */}
                <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                    <SheetContent side="right" className="sm:max-w-none w-[70vw]">
                        {selected && <IncidentDetails inc={selected} />}
                    </SheetContent>
                </Sheet>

<Dialog open={!!newIncident} onOpenChange={(open) => {
  if (!open) {
    setNewIncident(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }
}}>
  <DialogContent className="max-w-md border-2 border-red-500 bg-white animate-fade-in">
    <div className="flex items-center gap-3">
      <Flame className="text-red-600 w-6 h-6" />
      <DialogTitle className="text-xl font-bold text-red-700">Insiden Baharu Dikesan</DialogTitle>
    </div>

    <DialogDescription className="mt-2 space-y-2 text-base">
      <div className="text-gray-800">
        <strong className="block">{newIncident?.lokasi}</strong>
        <span className="text-sm text-muted-foreground">{newIncident?.tarikh} {newIncident?.masa}</span>
      </div>
      <p className="mt-1 text-gray-700">{newIncident?.message}</p>

      <div className="pt-4 flex justify-end">
        <Button
          className="bg-red-600 hover:bg-red-700 gap-1"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            setSelected(newIncident);     // open sheet
            setNewIncident(null);         // close modal
          }}
        >
          <Eye size={16} /> Lihat Sekarang
        </Button>
      </div>
    </DialogDescription>
  </DialogContent>
</Dialog>


            </AuthenticatedLayout>
        </>
    )
}

/* -------------------------------------------------------------------------- */
/*  CARD COMPONENT                                                            */
/* -------------------------------------------------------------------------- */
function IncidentCard({ inc, onOpen }) {
    return (
        <Card className="p-6">
            <div className="flex gap-4">
                <div className="bg-rose-100 rounded-md p-3 h-fit">
                    <Flame className="text-rose-500" />
                </div>

                <div className="flex-1 space-y-2">
                    {/* title + pills */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">{inc.lokasi}</h3>
                        <div className="flex gap-2 flex-wrap">
                            <Badge className={`${statusColor[inc.status]} font-medium`}>{inc.status}</Badge>
                            <Badge className={`${tahapColor[inc.tahap]} font-medium`}>{inc.tahap}</Badge>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm">{inc.message?.slice(0, 90) || 'Tiada mesej'}…</p>


                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1"><Clock size={14} /> {inc.masa} – {inc.tarikh}</div>
                        <div className="flex items-center gap-1"><MessageCircle size={14} /> {inc.sumber}</div>
                        <div className="flex items-center gap-1"><User2 size={14} /> {inc.name}</div>
                        <div className="flex items-center gap-1"><Camera size={14} /> {inc.foto} foto</div>
                    </div>

                    <div className="flex gap-2 justify-end mt-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" onClick={onOpen} className="gap-1">
                                    <Eye size={16} /> Lihat
                                </Button>
                            </SheetTrigger>
                        </Sheet>
                        {inc.tahap === 'New' && (
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 gap-1">
                                <UserPlus size={16} /> Tugaskan
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}

/* -------------------------------------------------------------------------- */
/*  DETAILS PANEL                                                             */
/* -------------------------------------------------------------------------- */
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
                        <Field label="Pelapor" value={inc.name || '-'} />
                        <Field label="Telefon" value={inc.contact_number || '-'} />
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


