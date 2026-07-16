"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);



    try {
      // 1. Jalankan autentikasi
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setSubmitError("Username atau password salah.");
        return;
      }

      // 2. Ambil session aktif pasca login untuk membaca role dari token
      const session = await getSession();
      const userRole = session?.user?.role?.toLowerCase(); // lowercase untuk keandalan

      if (!userRole) {
        setSubmitError("Gagal mengidentifikasi hak akses akun Anda.");
        return;
      }

      // 3. Arahkan rute secara dinamis sesuai role masing-masing
      if (userRole === "manajer") {
        router.push("/dashboard/manajer");
      } else if (userRole === "petugas") {
        router.push("/dashboard");
      }

      router.refresh();

    } catch (error: any) {
      setSubmitError("Terjadi kesalahan sistem saat mencoba masuk. Silakan coba lagi.");
      console.error("Login onSubmit error:", error);
    }
  };

  return (
    <AuthCard
      title="Masuk ke akun"
      description="Gunakan username dan password petugas Anda untuk mengakses dashboard monitoring."
      footerText=""
      footerHref=""
      footerLabel=""
    >
      <form className="auth-form-space" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username" className="auth-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="auth-input-element"
            {...register("username")}
          />
          {errors.username ? (
            <p className="auth-error-text">{errors.username.message}</p>
          ) : null}
        </div>

        <div>
  <label htmlFor="password" className="auth-label">
    Password
  </label>
  <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      autoComplete="current-password"
      className="auth-input-element pr-11"
      {...register("password")}
    />
    <button
      type="button"
      tabIndex={-1}
      onClick={() => setShowPassword((v) => !v)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
    >
      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  </div>
  {errors.password ? (
    <p className="auth-error-text">{errors.password.message}</p>
  ) : null}
</div>

        {submitError ? (
          <div className="auth-alert-error">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-btn-submit"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="auth-back-wrapper">
        <Link href="/" className="auth-link-back">
          Kembali ke beranda
        </Link>
      </div>
    </AuthCard>
  );
}