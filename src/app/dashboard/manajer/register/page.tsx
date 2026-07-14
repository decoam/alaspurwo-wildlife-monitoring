// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { AuthCard } from "@/components/auth/AuthCard";

// const registerSchema = z.object({
//   username: z.string().trim().min(3, "Username minimal 3 karakter."),
//   password: z.string().min(6, "Password minimal 6 karakter."),
//   fullName: z.string().trim().min(2, "Nama petugas wajib diisi."),
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// export default function RegisterPage() {
//   const router = useRouter();
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       username: "",
//       password: "",
//       fullName: "",
//     },
//   });

//   const onSubmit = async (values: RegisterFormValues) => {
//     setSubmitError(null);

//     const response = await fetch("/api/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(values),
//     });

//     const data = (await response.json()) as { message?: string };

//     if (!response.ok) {
//       setSubmitError(data.message ?? "Pendaftaran gagal.");
//       return;
//     }

//     router.push("/login");
//   };

//   return (
//     <AuthCard
//       title="Buat akun petugas"
//       description="Daftarkan petugas baru untuk mengelola pengamatan."
//       footerText="Sudah punya akun?"
//       footerHref="/login"
//       footerLabel="Masuk"
//     >
//       <form className="auth-form-space" onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label htmlFor="username" className="auth-label">
//             Username
//           </label>
//           <input
//             id="username"
//             type="text"
//             autoComplete="username"
//             className="auth-input-element"
//             {...register("username")}
//           />
//           {errors.username ? (
//             <p className="auth-error-text">{errors.username.message}</p>
//           ) : null}
//         </div>

//         <div>
//           <label htmlFor="password" className="auth-label">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             autoComplete="new-password"
//             className="auth-input-element"
//             {...register("password")}
//           />
//           {errors.password ? (
//             <p className="auth-error-text">{errors.password.message}</p>
//           ) : null}
//         </div>

//         <div>
//           <label htmlFor="fullName" className="auth-label">
//             Nama Petugas
//           </label>
//           <input
//             id="fullName"
//             type="text"
//             autoComplete="name"
//             className="auth-input-element"
//             {...register("fullName")}
//           />
//           {errors.fullName ? (
//             <p className="auth-error-text">{errors.fullName.message}</p>
//           ) : null}
//         </div>

//         {submitError ? (
//           <div className="auth-alert-error">
//             {submitError}
//           </div>
//         ) : null}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="auth-btn-submit"
//         >
//           {isSubmitting ? "Memproses..." : "Daftar"}
//         </button>
//       </form>
//     </AuthCard>
//   );
// }