"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";

import { ManagerSidebar } from "@/features/manajer/components/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/ManagerHeader";

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username minimal 3 karakter."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  fullName: z.string().trim().min(2, "Nama petugas wajib diisi."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPetugasPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setSubmitError(data.message ?? "Pendaftaran gagal.");
        return;
      }

      setSubmitSuccess("Akun petugas lapangan baru berhasil didaftarkan!");
      
      // Delay sebentar agar manajer bisa melihat alert sukses, lalu balik ke halaman utama petugas
      setTimeout(() => {
        router.push("/dashboard/manajer/petugas");
        router.refresh();
      }, 1500);
    } catch (error) {
      setSubmitError("Terjadi kesalahan jaringan.");
    }
  };

  // Profile data cadangan sementara untuk Client-side Header
  const managerProfile = {
    fullName: "Manajer Konservasi",
    role: "Manajer Konservasi",
    avatarInitials: "MK",
    email: "@manager_tnap",
  };

  return (
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased flex">
      {/* SIDEBAR FIXED (Tidak ikut bergeser saat form di-scroll) */}
      <aside className="fixed inset-y-0 left-0 w-72 z-20">
        <ManagerSidebar currentPath="/dashboard/manajer/petugas" user={managerProfile} />
      </aside>

      {/* AREA UTAMA (Scrollable) */}
      <div className="pl-72 pr-6 py-6 w-full min-h-screen overflow-y-auto">
        <main className="mx-auto max-w-2xl space-y-6">
          
          {/* HEADER */}
          <ManagerHeader user={managerProfile} />

          {/* Tombol Kembali */}
          <div>
            <Link
              href="/dashboard/manajer/petugas"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Kelola Petugas
            </Link>
          </div>

          {/* CARD FORM REGISTRASI */}
          <div className="rounded-[28px] border border-emerald-900/60 bg-[#0c1914]/85 p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-400" />
                Daftarkan Petugas Lapangan Baru
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Akun yang dibuat akan langsung memiliki hak akses sebagai Petugas Lapangan di sistem.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Field: Nama Lengkap */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Nama Lengkap Petugas
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Masukkan nama lengkap petugas"
                  className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-400 mt-0.5">{errors.fullName.message}</p>
                )}
              </div>

              {/* Field: Username */}
              <div className="space-y-1">
                <label htmlFor="username" className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Contoh: petugas_baru"
                  className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-xs text-red-400 mt-0.5">{errors.username.message}</p>
                )}
              </div>

              {/* Field: Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Password Akun
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 transition"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-400 mt-0.5">{errors.password.message}</p>
                )}
              </div>

              {/* Alert Feedback */}
              {submitError && (
                <div className="text-sm bg-red-950/40 text-red-400 p-3 rounded-xl border border-red-900/60 animate-in fade-in duration-200">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="text-sm bg-emerald-950/40 text-emerald-400 p-3 rounded-xl border border-emerald-500/30 animate-in fade-in duration-200">
                  {submitSuccess}
                </div>
              )}

              {/* Tombol Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 py-3 text-sm font-semibold text-white transition hover:from-emerald-500 hover:to-lime-500 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses Pendaftaran...
                    </>
                  ) : (
                    "Daftarkan Personel"
                  )}
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}