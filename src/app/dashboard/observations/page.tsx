import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservations, deleteObservation } from "@/actions/observation.actions";
import { ObservationTable } from "@/components/observations/ObservationTable";

export const runtime = "nodejs";

function buildQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      if (value) params.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    }
  });
  return params.toString();
}

export default async function ObservationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const search = typeof params.search === "string" ? params.search : "";
  const shift = typeof params.shift === "string" ? params.shift : "";
  const category = typeof params.category === "string" ? params.category : "";
  const date = typeof params.date === "string" ? params.date : "";
  const sort = typeof params.sort === "string" ? params.sort : "desc";

  const result = await getObservations({
    search,
    shift,
    category,
    date,
    sort,
    page,
    limit,
  });

  const queryString = buildQueryString({
    search,
    shift,
    category,
    date,
    sort,
    page: String(page),
    limit: String(limit),
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-emerald-900/60 bg-[#07110c]/80 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="flex flex-col gap-4 border-b border-emerald-900/60 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Data Pengamatan</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Pengamatan Satwa</h1>
            <p className="mt-2 text-sm text-slate-400">Pantau, cari, dan kelola data satwa liar secara terorganisir.</p>
          </div>
          <Link href="/dashboard/observations/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
            <PlusCircle className="h-4 w-4" />
            Tambah Pengamatan
          </Link>
        </div>

        <form className="mt-6 grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr]" action="/dashboard/observations">
          <label className="flex items-center gap-2 rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-3 text-sm text-slate-400">
            <Search className="h-4 w-4" />
            <input name="search" defaultValue={search} placeholder="Cari nama satwa, lokasi, petugas" className="w-full bg-transparent outline-none" />
          </label>
          <select name="shift" defaultValue={shift} className="rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-3 text-sm text-slate-300 outline-none">
            <option value="">Semua Shift</option>
            <option value="Pagi">Pagi</option>
            <option value="Sore">Sore</option>
          </select>
          <select name="category" defaultValue={category} className="rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-3 text-sm text-slate-300 outline-none">
            <option value="">Semua Kategori</option>
            <option value="Mamalia">Mamalia</option>
            <option value="Burung">Burung</option>
            <option value="Reptil">Reptil</option>
            <option value="Amfibi">Amfibi</option>
          </select>
          <input type="date" name="date" defaultValue={date} className="rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-3 text-sm text-slate-300 outline-none" />
          <select name="sort" defaultValue={sort} className="rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-3 text-sm text-slate-300 outline-none">
            <option value="desc">Tanggal terbaru</option>
            <option value="asc">Tanggal terlama</option>
          </select>
          <div className="lg:col-span-5 flex justify-end">
            <button type="submit" className="rounded-2xl border border-emerald-900/60 bg-emerald-900/40 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/60">
              Terapkan Filter
            </button>
          </div>
        </form>

        {typeof params.success === "string" && (params.success === "create" || params.success === "edit" || params.success === "delete") ? (
          <div className="mt-6 rounded-2xl border border-emerald-800/70 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-100">
            {params.success === "create"
              ? "Data pengamatan berhasil dibuat."
              : params.success === "edit"
                ? "Data pengamatan berhasil diperbarui."
                : "Data pengamatan berhasil dihapus."}
          </div>
        ) : null}

        {!result.success && result.message ? (
          <div className="mt-6 rounded-2xl border border-rose-900/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
            {result.message}
          </div>
        ) : null}

        {result.success && result.observations.length > 0 ? (
          <div className="mt-6 space-y-4">
            <ObservationTable items={result.observations.map((item: any) => ({ ...item, _id: String(item._id), foto: item.foto || "", tanggalPengamatan: item.tanggalPengamatan ? new Date(item.tanggalPengamatan).toISOString() : "" }))} deleteAction={async (formData: FormData) => {
              "use server";
              const id = formData.get("id")?.toString();
              if (id) {
                await deleteObservation(id);
              }
            }} />

            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-900/60 bg-[#10241a] px-4 py-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
              <p>Menampilkan {result.observations.length} dari {result.total} data</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: result.totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const nextQuery = new URLSearchParams(queryString);
                  nextQuery.set("page", String(pageNumber));
                  return (
                    <Link key={pageNumber} href={`/dashboard/observations?${nextQuery.toString()}`} className={`rounded-full px-3 py-1.5 ${page === pageNumber ? "bg-emerald-600 text-white" : "border border-emerald-900/60 bg-[#0b1712] text-slate-300"}`}>
                      {pageNumber}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[24px] border border-dashed border-emerald-800/70 bg-[#0c1712] px-6 py-12 text-center">
            <p className="text-xl font-semibold text-white">Belum ada data pengamatan satwa</p>
            <p className="mt-2 text-sm text-slate-400">Mulai catat pengamatan satwa liar Anda hari ini.</p>
            <Link href="/dashboard/observations/create" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
              <PlusCircle className="h-4 w-4" />
              Tambah Pengamatan
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
