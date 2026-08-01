import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getObservations } from "@/features/observation/repository";
import { deleteObservation } from "@/features/observation/service";
import { ObservationTable } from "@/features/observation";
import { ObservationFilter } from "@/features/observation/components/ObservationFilter";

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
        
          {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-brand-primary/60 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">Data Pengamatan</p>
            <h1 className="mt-2 text-2xl font-semibold text-text-heading">Pengamatan Satwa</h1>
            <p className="mt-2 text-sm text-text-muted">Pantau, cari, dan kelola data satwa liar secara terorganisir.</p>
          </div>
          <Link href="/dashboard/observations/create" className="obs-btn-primary">
            <PlusCircle className="obs-icon" />
            Tambah Pengamatan
          </Link>
        </div>

        <ObservationFilter 
          initialValues={{ search, shift, category, date, sort }}
        />

        {typeof params.success === "string" && ["create", "edit", "delete"].includes(params.success) && (
          <div className="obs-alert-success">
            {params.success === "create"
              ? "Data pengamatan berhasil dibuat."
              : params.success === "edit"
                ? "Data pengamatan berhasil diperbarui."
                : "Data pengamatan berhasil dihapus."}
          </div>
        )}

        {!result.success && result.message && (
          <div className="obs-alert-error">
            {result.message}
          </div>
        )}

        {result.success && result.observations.length > 0 ? (
          <div className="mt-6 space-y-4">
            <ObservationTable
              items={result.observations.map((item) => ({
                ...item,
                _id: String(item._id),
                foto: item.foto || "",
                tanggalPengamatan: item.tanggalPengamatan ? new Date(item.tanggalPengamatan).toISOString() : "",
                createdBy: String(item.createdBy ?? ""),
              }))}
              currentUserId={session.user.id}
              deleteAction={async (formData: FormData) => {
                "use server";
                const id = formData.get("id")?.toString();
                if (id) {
                  await deleteObservation(id);
                }
              }}
            />

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
          <div className="obs-empty-state">
            <p className="text-xl font-semibold text-text-heading">Belum ada data pengamatan satwa</p>
            <p className="mt-2 text-sm text-text-muted">Mulai catat pengamatan satwa liar Anda hari ini.</p>
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
