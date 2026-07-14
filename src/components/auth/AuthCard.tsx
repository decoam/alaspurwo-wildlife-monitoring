import Link from "next/link";
import { Trees, ShieldCheck, PawPrint } from "lucide-react";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLabel: string;
};

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLabel,
}: AuthCardProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-green-950 via-emerald-950 to-stone-950">

      {/* Background Forest */}
      <div className="absolute inset-0 bg-[url('/forest-bg.jpg')] bg-cover bg-center opacity-20" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Blur Effect */}
      <div className="absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">

          {/* LEFT SIDE */}
          <div className="hidden flex-1 flex-col justify-between bg-linear-to-br from-green-900/70 via-green-800/70 to-lime-700/60 p-12 lg:flex">

            <div>

              <div className="flex items-center gap-3">
                <PawPrint className="h-10 w-10 text-lime-200" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Alas Purwo
                  </h1>

                  <p className="text-lime-100">
                    Wildlife Monitoring System
                  </p>
                </div>
              </div>

              <h2 className="mt-12 text-4xl font-bold leading-tight text-white">
                Protect Wildlife,
                <br />
                Preserve Nature.
              </h2>

              <p className="mt-6 max-w-md leading-8 text-green-50/90">
                Sistem digital untuk membantu petugas konservasi mencatat
                aktivitas pengamatan satwa liar secara cepat, akurat,
                dan terintegrasi.
              </p>

            </div>

            <div className="space-y-5">

              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur">
                <Trees className="text-lime-300" />
                <div>
                  <p className="font-semibold text-white">
                    Monitoring Lapangan
                  </p>
                  <p className="text-sm text-green-100">
                    Pencatatan observasi pagi & sore.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="text-lime-300" />
                <div>
                  <p className="font-semibold text-white">
                    Data Aman
                  </p>
                  <p className="text-sm text-green-100">
                    Autentikasi petugas dan penyimpanan cloud.
                  </p>
                </div>
              </div>

              <blockquote className="rounded-xl border border-lime-400/30 bg-black/20 p-5 italic text-lime-100">
                "Melindungi satwa liar hari ini adalah menjaga keseimbangan
                alam untuk generasi mendatang."
              </blockquote>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-1 items-center justify-center bg-slate-950/70 p-10">

            <div className="w-full max-w-md">

              <h2 className="text-3xl font-bold text-white">
                {title}
              </h2>

              <p className="mt-2 text-slate-300">
                {description}
              </p>

              <div className="mt-8">
                {children}
              </div>

              <p className="mt-8 text-sm text-slate-400">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="font-semibold text-lime-400 hover:text-lime-300"
                >
                  {footerLabel}
                </Link>
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}