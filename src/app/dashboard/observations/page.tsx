import Link from "next/link";
import { ArrowLeft, PlusCircle, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservations, deleteObservation } from "@/actions/observation.actions";
import { ObservationTable } from "@/features/observation/components/ObservationTable";

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
    <main className="obs-main-layout">
      <div className="obs-container">
        
        {/* Top Navigation */}
        <div className="mb-4">
          <Link href="/dashboard" className="obs-btn-secondary">
            <ArrowLeft className="obs-icon" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-emerald-900/60 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Data Pengamatan</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Pengamatan Satwa</h1>
            <p className="mt-2 text-sm text-slate-400">Pantau, cari, dan kelola data satwa liar secara terorganisir.</p>
          </div>
          <Link href="/dashboard/observations/create" className="obs-btn-primary">
            <PlusCircle className="obs-icon" />
            Tambah Pengamatan
          </Link>
        </div>

        {/* Filter Form */}
        <form className="mt-6 grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr]" action="/dashboard/observations">
          <label className="obs-input-field">
            <Search className="obs-icon" />
            <input name="search" defaultValue={search} placeholder="Cari nama satwa, lokasi, petugas" className="obs-input-element" />
          </label>
          
          <select name="shift" defaultValue={shift} className="obs-select-field">
            <option value="">Semua Shift</option>
            <option value="Pagi">Pagi</option>
            <option value="Sore">Sore</option>
          </select>
          
          <select name="category" defaultValue={category} className="obs-select-field">
            <option value="">Semua Kategori</option>
            <option value="Mamalia">Mamalia</option>
            <option value="Burung">Burung</option>
            <option value="Reptil">Reptil</option>
            <option value="Amfibi">Amfibi</option>
          </select>
          
          <input type="date" name="date" defaultValue={date} className="obs-select-field" />
          
          <select name="sort" defaultValue={sort} className="obs-select-field">
            <option value="desc">Tanggal terbaru</option>
            <option value="asc">Tanggal terlama</option>
          </select>
          
          <div className="lg:col-span-5 flex justify-end">
            <button type="submit" className="obs-btn-filter">
              Terapkan Filter
            </button>
          </div>
        </form>

        {/* Success Status Notifications */}
        {typeof params.success === "string" && ["create", "edit", "delete"].includes(params.success) && (
          <div className="obs-alert-success">
            {params.success === "create"
              ? "Data pengamatan berhasil dibuat."
              : params.success === "edit"
                ? "Data pengamatan berhasil diperbarui."
                : "Data pengamatan berhasil dihapus."}
          </div>
        )}

        {/* Error Notification */}
        {!result.success && result.message && (
          <div className="obs-alert-error">
            {result.message}
          </div>
        )}

        {/* Main Content Table & Pagination */}
        {result.success && result.observations.length > 0 ? (
          <div className="mt-6 space-y-4">
            <ObservationTable 
              items={result.observations.map((item: any) => ({ 
                ...item, 
                _id: String(item._id), 
                foto: item.foto || "", 
                tanggalPengamatan: item.tanggalPengamatan ? new Date(item.tanggalPengamatan).toISOString() : "" 
              }))} 
              deleteAction={async (formData: FormData) => {
                "use server";
                const id = formData.get("id")?.toString();
                if (id) {
                  await deleteObservation(id);
                }
              }} 
            />

            {/* Pagination Panel */}
            <div className="obs-pagination-bar">
              <p>Menampilkan {result.observations.length} dari {result.total} data</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: result.totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const nextQuery = new URLSearchParams(queryString);
                  nextQuery.set("page", String(pageNumber));
                  return (
                    <Link 
                      key={pageNumber} 
                      href={`/dashboard/observations?${nextQuery.toString()}`} 
                      className={`obs-page-number ${page === pageNumber ? "obs-page-active" : "obs-page-inactive"}`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="obs-empty-state">
            <p className="text-xl font-semibold text-white">Belum ada data pengamatan satwa</p>
            <p className="mt-2 text-sm text-slate-400">Mulai catat pengamatan satwa liar Anda hari ini.</p>
            <Link href="/dashboard/observations/create" className="obs-btn-primary mt-6">
              <PlusCircle className="obs-icon" />
              Tambah Pengamatan
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}