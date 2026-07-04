import Link from "next/link";
import {
  Trees,
  PawPrint,
  ShieldCheck,
  Binoculars,
  Leaf,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-950 via-emerald-950 to-stone-950 text-white">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/forest-bg.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-700/20 px-4 py-2 text-sm backdrop-blur">
              <Leaf className="h-4 w-4 text-lime-300" />
              Taman Nasional Alas Purwo
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-6xl">
              Wildlife
              <span className="block text-lime-300">
                Monitoring System
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-green-100">
              Platform digital untuk membantu petugas konservasi
              mencatat aktivitas pengamatan satwa liar secara cepat,
              akurat, dan terintegrasi langsung dari lapangan.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300"
              >
                Masuk
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-green-400/40 bg-white/5 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Daftar Petugas
              </Link>

            </div>

            <div className="mt-12 flex flex-wrap gap-8">

              <div>
                <h2 className="text-3xl font-bold text-lime-300">
                  42
                </h2>
                <p className="text-green-100">
                  Pos Pengamatan
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-lime-300">
                  1.256
                </h2>
                <p className="text-green-100">
                  Observasi
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-lime-300">
                  87
                </h2>
                <p className="text-green-100">
                  Spesies
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="grid gap-6">

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition hover:scale-[1.02]">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-lime-400/20 p-4">
                  <Binoculars className="text-lime-300" />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Monitoring Satwa
                  </h3>

                  <p className="text-green-100">
                    Catat hasil observasi pagi dan sore secara realtime.
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition hover:scale-[1.02]">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-lime-400/20 p-4">
                  <Trees className="text-lime-300" />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Konservasi Alam
                  </h3>

                  <p className="text-green-100">
                    Data terpusat untuk mendukung pengelolaan kawasan konservasi.
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition hover:scale-[1.02]">

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-lime-400/20 p-4">
                  <ShieldCheck className="text-lime-300" />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Akses Aman
                  </h3>

                  <p className="text-green-100">
                    Sistem autentikasi petugas dengan keamanan berbasis session.
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-lime-400/30 bg-lime-500/10 p-6 backdrop-blur">

              <div className="flex items-center gap-3">

                <PawPrint className="text-lime-300" />

                <p className="italic text-green-50">
                  "Menjaga satwa liar hari ini adalah menjaga
                  keseimbangan alam untuk generasi mendatang."
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}