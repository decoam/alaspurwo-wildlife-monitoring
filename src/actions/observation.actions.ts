"use server";

import { auth } from "@/auth";
import { connectDB } from "@/app/lib/mongodb";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { Observation } from "@/models/Observation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

type ActionResult = {
  success: boolean;
  message: string;
};

export type SerializedObservation = {
  _id: string;
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  tanggalPengamatan: string;
  shift: "Pagi" | "Sore";
  kondisiCuaca: string;
  aktivitasSatwa: string;
  foto: string;
  catatan: string;
  namaPetugas: string;
  posPengamatan: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type ObservationListParams = {
  search?: string;
  shift?: string;
  category?: string;
  date?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

const observationSchema = z.object({
  namaSatwa: z.string().trim().min(1, "Nama satwa wajib diisi."),
  kategori: z.string().trim().min(1, "Kategori wajib diisi."),
  jumlah: z.coerce.number().int().min(1, "Jumlah minimal 1."),
  lokasi: z.string().trim().min(1, "Lokasi wajib diisi."),
  tanggalPengamatan: z.string().trim().min(1, "Tanggal wajib diisi."),
  shift: z.enum(["Pagi", "Sore"]),
  kondisiCuaca: z.string().trim().min(1, "Kondisi cuaca wajib diisi."),
  aktivitasSatwa: z.string().trim().min(1, "Aktivitas satwa wajib diisi."),
  foto: z.string().trim().min(1, "Foto wajib diunggah.").url("Foto wajib berupa URL Cloudinary."),
  catatan: z.string().trim().optional().default(""),
});

function parseObservationFormData(formData: FormData) {
  return {
    namaSatwa: formData.get("namaSatwa")?.toString() ?? "",
    kategori: formData.get("kategori")?.toString() ?? "",
    jumlah: formData.get("jumlah")?.toString() ?? "",
    lokasi: formData.get("lokasi")?.toString() ?? "",
    tanggalPengamatan: formData.get("tanggalPengamatan")?.toString() ?? "",
    shift: formData.get("shift")?.toString() ?? "",
    kondisiCuaca: formData.get("kondisiCuaca")?.toString() ?? "",
    aktivitasSatwa: formData.get("aktivitasSatwa")?.toString() ?? "",
    foto: formData.get("foto")?.toString() ?? "",
    catatan: formData.get("catatan")?.toString() ?? "",
  };
}

function serializeObservation(observation: Record<string, unknown>): SerializedObservation {
  const value = observation as Record<string, unknown> & Partial<SerializedObservation>;

  return {
    _id: value._id ? String(value._id) : "",
    namaSatwa: typeof value.namaSatwa === "string" ? value.namaSatwa : "",
    kategori: typeof value.kategori === "string" ? value.kategori : "",
    jumlah: typeof value.jumlah === "number" ? value.jumlah : Number(value.jumlah ?? 0),
    lokasi: typeof value.lokasi === "string" ? value.lokasi : "",
    tanggalPengamatan: value.tanggalPengamatan ? new Date(value.tanggalPengamatan as string | Date).toISOString() : "",
    shift: value.shift === "Sore" ? "Sore" : "Pagi",
    kondisiCuaca: typeof value.kondisiCuaca === "string" ? value.kondisiCuaca : "",
    aktivitasSatwa: typeof value.aktivitasSatwa === "string" ? value.aktivitasSatwa : "",
    foto: typeof value.foto === "string" ? value.foto : "",
    catatan: typeof value.catatan === "string" ? value.catatan : "",
    namaPetugas: typeof value.namaPetugas === "string" ? value.namaPetugas : "",
    posPengamatan: typeof value.posPengamatan === "string" ? value.posPengamatan : "",
    createdBy: value.createdBy ? String(value.createdBy) : "",
    createdAt: value.createdAt ? new Date(value.createdAt as string | Date).toISOString() : "",
    updatedAt: value.updatedAt ? new Date(value.updatedAt as string | Date).toISOString() : "",
  };
}

function buildObservationFilter(params: ObservationListParams) {
  const filter: Record<string, unknown> = {};
  const search = params.search?.trim();

  if (search) {
    filter.$or = [
      { namaSatwa: { $regex: search, $options: "i" } },
      { lokasi: { $regex: search, $options: "i" } },
      { namaPetugas: { $regex: search, $options: "i" } },
    ];
  }

  if (params.shift) {
    filter.shift = params.shift;
  }

  if (params.category) {
    filter.kategori = params.category;
  }

  if (params.date) {
    const start = new Date(params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(params.date);
    end.setHours(23, 59, 59, 999);
    filter.tanggalPengamatan = { $gte: start, $lte: end };
  }

  return filter;
}

export async function getObservations(params: ObservationListParams = {}) {
  try {
    await connectDB();

    const page = Number(params.page ?? 1);
    const limit = Number(params.limit ?? 10);
    const skip = (page - 1) * limit;
    const filter = buildObservationFilter(params);
    const sortOption: Record<string, 1 | -1> = params.sort === "name"
      ? { namaSatwa: 1 }
      : params.sort === "asc"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const [observations, total] = await Promise.all([
      Observation.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      Observation.countDocuments(filter),
    ]);

    return {
      success: true,
      observations: observations.map((observation) => serializeObservation(observation as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (error) {
    console.error("Get observations error", error);
    return {
      success: false,
      observations: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      message: error instanceof Error ? error.message : "Gagal memuat data pengamatan.",
    };
  }
}

export async function searchObservation(params: ObservationListParams) {
  return getObservations({ ...params, search: params.search });
}

export async function filterObservation(params: ObservationListParams) {
  return getObservations(params);
}

export async function getObservationById(id: string) {
  try {
    await connectDB();
    const observation = await Observation.findById(id).select("-__v").lean();

    if (!observation) {
      return { success: false, message: "Data pengamatan tidak ditemukan.", observation: null };
    }

    return { success: true, observation: serializeObservation(observation as Record<string, unknown>) };
  } catch (error) {
    console.error("Get observation by id error", error);
    return { success: false, message: "Gagal memuat detail pengamatan.", observation: null };
  }
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
      { runValidators: true, returnDocument: "after" }
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
    await connectDB();

    const observation = await Observation.findById(id);

    if (!observation) {
      return { success: false, message: "Data pengamatan tidak ditemukan." };
    }

    if (observation.foto) {
      await deleteFromCloudinary(observation.foto).catch((error) => {
        console.warn("Cloudinary delete skipped", error);
      });
    }

    await Observation.findByIdAndDelete(id);
    revalidatePath("/dashboard/observations");
    revalidatePath(`/dashboard/observations/${id}`);
    redirect("/dashboard/observations?success=delete");
  } catch (error) {
    console.error("Delete observation error", error);
    return { success: false, message: error instanceof Error ? error.message : "Gagal menghapus data pengamatan." };
  }
}
