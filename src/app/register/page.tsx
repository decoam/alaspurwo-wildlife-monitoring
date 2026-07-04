"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username minimal 3 karakter."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  fullName: z.string().trim().min(2, "Nama petugas wajib diisi."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
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

    router.push("/login");
  };

  return (
    <AuthCard
      title="Buat akun petugas"
      description="Daftarkan petugas baru untuk mengelola pengamatan."
      footerText="Sudah punya akun?"
      footerHref="/login"
      footerLabel="Masuk"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
            {...register("username")}
          />
          {errors.username ? (
            <p className="mt-1 text-sm text-rose-400">{errors.username.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-200">
            Nama Petugas
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="mt-1 text-sm text-rose-400">{errors.fullName.message}</p>
          ) : null}
        </div>

        {submitError ? (
          <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Memproses..." : "Daftar"}
        </button>
      </form>
    </AuthCard>
  );
}
