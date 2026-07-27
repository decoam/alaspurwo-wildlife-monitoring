"use server";

import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";
import { serializeObservation } from "./mapper";
import type { ObservationListParams } from "./types";

// Helper function untuk escape karakter khusus Regex (ReDoS Protection)
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildObservationFilter(params: ObservationListParams) {
  const filter: Record<string, unknown> = {};
  const search = params.search?.trim();

  if (search) {
    const safeSearch = escapeRegExp(search);
    filter.$or = [
      { namaSatwa: { $regex: safeSearch, $options: "i" } },
      { lokasi: { $regex: safeSearch, $options: "i" } },
      { namaPetugas: { $regex: safeSearch, $options: "i" } },
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
    const sortOption: Record<string, 1 | -1> =
      params.sort === "name"
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
      observations: observations.map((observation) =>
        serializeObservation(observation as Record<string, unknown>)
      ),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (error) {
    console.error("Get observations error:", error);
    // Kembalikan pesan generik ke client untuk mencegah kebocoran internal DB error
    return {
      success: false,
      observations: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      message: "Gagal memuat data pengamatan. Silakan coba beberapa saat lagi.",
    };
  }
}

export async function getObservationById(id: string) {
  try {
    await connectDB();
    const observation = await Observation.findById(id).select("-__v").lean();

    if (!observation) {
      return {
        success: false,
        message: "Data pengamatan tidak ditemukan.",
        observation: null,
      };
    }

    return {
      success: true,
      observation: serializeObservation(
        observation as Record<string, unknown>
      ),
    };
  } catch (error) {
    console.error("Get observation by id error:", error);
    return {
      success: false,
      message: "Gagal memuat detail pengamatan.",
      observation: null,
    };
  }
}