type Observation = {
  _id: string;
  namaSatwa: string;
  lokasi: string;
  tanggalPengamatan: string;
  shift: string;
  foto: string;
  status: string;
};

type RecentObservationTableProps = {
  observations: Observation[];
};

export function RecentObservationTable({ observations }: RecentObservationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-subtle/90 shadow-card">
      <div className="border-b border-brand-primary/60 px-5 py-4">
        <h2 className="text-lg font-semibold text-text-heading">Recent Observation</h2>
        <p className="mt-1 text-sm text-text-muted">Aktivitas satwa liar terbaru yang tercatat hari ini.</p>
      </div>

      <div className="overflow-x-auto">
        {observations.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-text-muted">
            Belum ada pengamatan yang sesuai pencarian saat ini.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-brand-primary/60 text-sm">
            <thead className="bg-brand-primary/50 text-left text-text-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Foto</th>
                <th className="px-5 py-3 font-medium">Nama Satwa</th>
                <th className="px-5 py-3 font-medium">Lokasi</th>
                <th className="px-5 py-3 font-medium">Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/50 bg-surface-table text-text-body">
              {observations.map((item) => (
                <tr key={item._id} className="transition hover:bg-brand-primary/40">
                  <td className="px-5 py-4">
                    {item.foto ? (
                      <img src={item.foto} alt={item.namaSatwa} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/70 text-lg">
                        🐾
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium text-text-heading">{item.namaSatwa}</td>
                  <td className="px-5 py-4">{item.lokasi}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.shift === "Pagi"
                          ? "bg-amber-bg text-amber-text border border-amber-bg"
                          : "bg-blue-bg text-blue-text border border-blue-bg"
                      }`}
                    >
                      {item.shift || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}