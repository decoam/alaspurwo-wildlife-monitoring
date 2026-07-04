type Observation = {
  id: number;
  photo: string;
  name: string;
  location: string;
  time: string;
  status: string;
};

const observations: Observation[] = [
  {
    id: 1,
    photo: "🦌",
    name: "Kijang Jawa",
    location: "Rawa Mangrove",
    time: "06:45",
    status: "Terkonfirmasi",
  },
  {
    id: 2,
    photo: "🐒",
    name: "Surili",
    location: "Puncak Pengamatan",
    time: "08:10",
    status: "Dipantau",
  },
  {
    id: 3,
    photo: "🦜",
    name: "Jalak Bali",
    location: "Hutan Primer",
    time: "10:25",
    status: "Menunggu Review",
  },
];

export function RecentObservationTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#0c1914]/90 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
      <div className="border-b border-emerald-900/60 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Recent Observation</h2>
        <p className="mt-1 text-sm text-slate-400">Aktivitas satwa liar terbaru yang tercatat hari ini.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-emerald-900/60 text-sm">
          <thead className="bg-emerald-950/50 text-left text-slate-300">
            <tr>
              <th className="px-5 py-3 font-medium">Foto</th>
              <th className="px-5 py-3 font-medium">Nama Satwa</th>
              <th className="px-5 py-3 font-medium">Lokasi</th>
              <th className="px-5 py-3 font-medium">Waktu</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/50 bg-[#0f2218] text-slate-200">
            {observations.map((item) => (
              <tr key={item.id} className="transition hover:bg-emerald-950/40">
                <td className="px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/70 text-lg">
                    {item.photo}
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                <td className="px-5 py-4">{item.location}</td>
                <td className="px-5 py-4">{item.time}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-emerald-700/60 bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
