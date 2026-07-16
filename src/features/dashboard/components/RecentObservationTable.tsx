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
    <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#0c1914]/90 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
      <div className="border-b border-emerald-900/60 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Recent Observation</h2>
        <p className="mt-1 text-sm text-slate-400">Aktivitas satwa liar terbaru yang tercatat hari ini.</p>
      </div>

      <div className="overflow-x-auto">
        {observations.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            Belum ada pengamatan yang sesuai pencarian saat ini.
          </div>
        ) : (
        <table className="min-w-full divide-y divide-emerald-900/60 text-sm">
          <thead className="bg-emerald-950/50 text-left text-slate-300">
            <tr>
              <th className="px-5 py-3 font-medium">Foto</th>
              <th className="px-5 py-3 font-medium">Nama Satwa</th>
              <th className="px-5 py-3 font-medium">Lokasi</th>
              <th className="px-5 py-3 font-medium">Shift</th>
            </tr>
            
          </thead>
          <tbody className="divide-y divide-emerald-900/50 bg-[#0f2218] text-slate-200">
            {observations.map((item) => (
              <tr key={item._id} className="transition hover:bg-emerald-950/40">
                <td className="px-5 py-4">
                  {item.foto ? (
                    <img src={item.foto} alt={item.namaSatwa} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/70 text-lg">
                      🐾
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-white">{item.namaSatwa}</td>
                <td className="px-5 py-4">{item.lokasi}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.shift === "Pagi"
                        ? "bg-amber-900/50 text-amber-200 border border-amber-700/50"
                        : "bg-indigo-900/50 text-indigo-200 border border-indigo-700/50"
                    }`}
                  >
                    {item.shift || "-"}
                  </span>
                </td>              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
