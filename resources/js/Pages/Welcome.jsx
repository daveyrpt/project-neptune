import { Head, Link } from '@inertiajs/react'
import { Flame, Zap, MapPin, PhoneCall, LayoutDashboard } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Welcome() {
  return (
    <>
      <Head title="FireMAS" />
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Flame className="text-red-600" />
          <h1 className="text-lg font-bold">
            <span className="text-red-600">Fire</span>MAS
          </h1>
        </div>
        <Link href={route('login')}>
          <Button variant="destructive">Log Masuk</Button>
        </Link>
      </header>

      <main className="bg-muted/50 min-h-screen text-center">
        {/* <div className="mb-12">
          <Flame className="mx-auto size-16 text-orange-500 mb-4" />
          <h1 className="text-4xl font-bold">
            <span className="text-red-600">Fire</span>MAS
          </h1>
          <p className="text-xl text-orange-600 font-semibold mt-2">
            Amaran Awal. Tindakan Pantas.
          </p>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Sistem FireMas membolehkan rakyat melaporkan kecemasan kebakaran melalui WhatsApp
            dan menyokong jabatan bomba dengan papan pemuka masa nyata, pemetaan hidran,
            dan laporan automatik untuk tindakan yang lebih pantas dan berkesan.
          </p>
        </div> */}
        <section className="relative bg-cover bg-center h-[480px] text-white" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1682097265453-2f1b6861019c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 max-w-4xl mx-auto text-center pt-32 px-4">
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-red-500">Fire</span>MAS
            </h1>
            <p className="text-lg mt-4">Sistem pantas untuk kecemasan kebakaran dan bantuan balai bomba.</p>
            <p className="text-xl text-orange-600 font-semibold mt-2">
              Amaran Awal. Tindakan Pantas.
            </p>
            <p className="mt-4 max-w-2xl mx-auto">
              Sistem FireMAS membolehkan rakyat melaporkan kecemasan kebakaran melalui WhatsApp
              dan menyokong jabatan bomba dengan papan pemuka masa nyata, pemetaan hidran,
              dan laporan automatik untuk tindakan yang lebih pantas dan berkesan.
            </p>
          </div>
        </section>
        <section className="py-16 bg-white text-center">
          <h2 className="text-2xl font-bold mb-4">Kenapa FireMAS?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div>
              <p className="text-4xl font-bold text-red-600">30+</p>
              <p className="text-gray-600">Balai Bomba Terhubung</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">100+</p>
              <p className="text-gray-600">Laporan Harian</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">45s</p>
              <p className="text-gray-600">Tindak Balas Purata</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">24/7</p>
              <p className="text-gray-600">Pemantauan Masa Nyata</p>
            </div>
          </div>
        </section>
        {/* ─── Feature Cards ─────────────────────────────────────────────── */}
        {/* <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto my-12">
          <FeatureCard icon={<PhoneCall />} title="Laporan WhatsApp" desc="Laporkan kecemasan kebakaran dengan mudah melalui WhatsApp." />
          <FeatureCard icon={<LayoutDashboard />} title="Papan Pemuka" desc="Dashboard masa nyata untuk pemantauan dan koordinasi operasi." />
          <FeatureCard icon={<MapPin />} title="Pemetaan Hidran" desc="Lokasi hidran dan sumber air dipetakan untuk akses pantas." />
        </div> */}

        {/* ─── CTA ─────────────────────────────────────────────────────── */}
        {/* <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-10 text-white text-center shadow-lg max-w-4xl mx-auto mt-16">
          <Zap className="size-8 mx-auto mb-2" />
          <h3 className="text-2xl font-bold mb-2">Sedia untuk Tindakan Pantas?</h3>
          <p className="mb-6">Sertai sistem FireMas untuk keselamatan awam yang lebih baik.</p>
          <Button variant="secondary" className="text-red-600 font-bold bg-white hover:bg-white/90">
            Mula Sekarang
          </Button>
        </div> */}
<section className="bg-gray-50 py-20 px-4">
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
    {/* Heading */}
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
      Hubungi Kami
    </h2>
    <p className="text-center text-gray-600 mb-8">
      Ada pertanyaan tentang sistem FireMAS? Isi borang di bawah dan kami akan menghubungi anda.
    </p>

    {/* ─── COMPACT GRID FORM ───────────────────────────────────────── */}
    <form className="grid gap-6 md:grid-cols-2">
      {/* Nama */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Nama Penuh *</label>
        <input
          type="text"
          className="w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring focus:border-red-400"
          placeholder="Nama anda"
          required
        />
      </div>

      {/* Telefon */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Nombor Telefon *</label>
        <input
          type="tel"
          className="w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring focus:border-red-400"
          placeholder="+60123456789"
          required
        />
      </div>

      {/* E-mel (spans 2 columns) */}
      <div className="md:col-span-2">
        <label className="block font-semibold text-gray-700 mb-1">Alamat E-mel *</label>
        <input
          type="email"
          className="w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring focus:border-red-400"
          placeholder="nama@contoh.com"
          required
        />
      </div>

      {/* Organisasi */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Organisasi/Jabatan</label>
        <input
          type="text"
          className="w-full border px-4 py-2.5 rounded-lg"
          placeholder="Jabatan Bomba Malaysia"
        />
      </div>

      {/* Jenis Pertanyaan */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Jenis Pertanyaan *</label>
        <select
          className="w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring focus:border-red-400"
          required
        >
          <option value="">Pilih jenis pertanyaan</option>
          <option>Maklumat Umum</option>
          <option>Teknikal</option>
          <option>Cadangan</option>
        </select>
      </div>

      {/* Mesej (spans 2) */}
      <div className="md:col-span-2">
        <label className="block font-semibold text-gray-700 mb-1">Mesej *</label>
        <textarea
          rows="3"
          className="w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring focus:border-red-400"
          placeholder="Tulis mesej anda…"
          required
        />
      </div>

      {/* Checkbox (spans 2) */}
      <div className="md:col-span-2 flex items-start gap-2">
        <input type="checkbox" id="agree" className="mt-1" required />
        <label htmlFor="agree" className="text-sm text-gray-700">
          Saya bersetuju dengan <a href="#" className="text-red-500 underline">Dasar Privasi</a> dan membenarkan FireMas menghubungi saya.
        </label>
      </div>

      {/* Submit (spans 2) */}
      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-lg font-semibold shadow hover:opacity-90 transition"
        >
          Hantar Pertanyaan
        </button>
      </div>
    </form>

    {/* ─── CONTACT INFO (optional) ─────────────────────────────────── */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-12 text-gray-700">
      <ContactInfo icon="📞" title="Telefon" text="+60 3-1234 5678" />
      <ContactInfo icon="💬" title="E-mel" text="info@firemas.gov.my" />
      <ContactInfo icon="⏰" title="Waktu Operasi" text="24/7 Kecemasan" />
    </div>
  </div>
</section>



      </main>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-red-50 text-gray-600 text-sm text-center py-10 border-t ">
        <div className="mb-2">
          <Flame className="inline-block text-red-600 mr-1" /> FireMAS oleh Agensi Bomba Malaysia
        </div>
        <div className="space-x-4">
          <Link href="#">Tentang</Link>
          <Link href="#">Hubungi</Link>
          <Link href="#">Privasi</Link>
        </div>
      </footer>
    </>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <Card className="text-left p-4 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center space-x-4">
        <div className="p-2 rounded-full bg-orange-100 text-orange-600">{icon}</div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1 text-muted-foreground">{desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

function ContactInfo({ icon, title, text }) {
  return (
    <div>
      <div className="bg-red-100 text-red-600 rounded-full p-3 inline-block mb-2 text-lg">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p>{text}</p>
    </div>
  )
}