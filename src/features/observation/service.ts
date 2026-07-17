"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { Observation } from "@/models/Observation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getObservations } from "./repository";
import { parseObservationFormData } from "./mapper";
import { observationSchema } from "./validation";
import type { ActionResult, ObservationListParams } from "./types";

export async function searchObservation(params: ObservationListParams) {
  return getObservations({ ...params, search: params.search });
}

export async function filterObservation(params: ObservationListParams) {
  return getObservations(params);
}

export async function createObservation(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "Sesi Anda tidak valid." };
    }

    await connectDB();

    const rawData = parseObservationFormData(formData);
    const parsed = observationSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Validasi gagal.",
      };
    }

    await Observation.create({
      ...parsed.data,
      jumlah: Number(parsed.data.jumlah),
      tanggalPengamatan: new Date(parsed.data.tanggalPengamatan),
      foto: parsed.data.foto,
      namaPetugas: session.user.fullName || session.user.name || "Petugas",
      posPengamatan: parsed.data.lokasi,
      createdBy: session.user.id,
    });
  } catch (error) {
    console.error("Create observation error", error);
    return { success: false, message: error instanceof Error ? error.message : "Gagal membuat data pengamatan." };
  }

  revalidatePath("/dashboard/observations");
  return { success: true, message: "Data pengamatan berhasil disimpan." };
}

export async function updateObservation(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")?.toString();

  if (!id) {
    return { success: false, message: "ID pengamatan tidak valid." };
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "Sesi Anda tidak valid." };
    }

    await connectDB();

    const existing = await Observation.findById(id);

    if (!existing) {
      return { success: false, message: "Data pengamatan tidak ditemukan." };
    }

    const rawData = parseObservationFormData(formData);
    const parsed = observationSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Validasi gagal.",
      };
    }

    const updatePayload = {
      namaSatwa: parsed.data.namaSatwa,
      kategori: parsed.data.kategori,
      jumlah: Number(parsed.data.jumlah),
      lokasi: parsed.data.lokasi,
      tanggalPengamatan: new Date(parsed.data.tanggalPengamatan),
      shift: parsed.data.shift,
      kondisiCuaca: parsed.data.kondisiCuaca,
      aktivitasSatwa: parsed.data.aktivitasSatwa,
      foto: parsed.data.foto || existing.foto,
      catatan: parsed.data.catatan,
      namaPetugas: existing.namaPetugas,
      posPengamatan: existing.posPengamatan,
      createdBy: existing.createdBy,
    };

    const updatedObservation = await Observation.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedObservation) {
      return { success: false, message: "Data pengamatan gagal diperbarui." };
    }
  } catch (error) {
    console.error("Update observation error", error);
    return { success: false, message: error instanceof Error ? error.message : "Gagal memperbarui data pengamatan." };
  }

  revalidatePath("/dashboard/observations");
  revalidatePath(`/dashboard/observations/${id}`);
  return { success: true, message: "Data pengamatan berhasil diperbarui." };
}

export async function deleteObservation(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "Sesi Anda tidak valid." };
    }

    await connectDB();

    const observation = await Observation.findById(id);

    if (!observation) {
      return { success: false, message: "Data pengamatan tidak ditemukan." };
    }

    // Cek kepemilikan — hanya pemilik yang boleh menghapus
    if (String(observation.createdBy) !== String(session.user.id)) {
      return { success: false, message: "Anda tidak memiliki izin untuk menghapus data ini." };
    }

    // Soft delete — hanya tandai deletedAt, tidak benar-benar dihapus
    await Observation.findByIdAndUpdate(id, {
      $set: { deletedAt: new Date() },
    });

    revalidatePath("/dashboard/observations");
    revalidatePath(`/dashboard/observations/${id}`);
    redirect("/dashboard/observations?success=delete");
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Delete observation error", error);
    return { success: false, message: error instanceof Error ? error.message : "Gagal menghapus data pengamatan." };
  }
}