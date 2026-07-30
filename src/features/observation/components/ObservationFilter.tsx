"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { useEffect, useState, useTransition } from "react";

interface ObservationFilterProps {
  initialValues: {
    search: string;
    shift: string;
    category: string;
    date: string;
    sort: string;
  };
}

export function ObservationFilter({ initialValues }: ObservationFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [date, setDate] = useState<Date | undefined>(
    initialValues.date ? new Date(initialValues.date) : undefined
  );

  useEffect(() => {
    if (initialValues.date) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(new Date(initialValues.date));
    }
  }, [initialValues.date]);

  const handleFilterChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams);

    params.set("search", formData.get("search") as string);
    params.set("shift", formData.get("shift") as string);
    params.set("category", formData.get("category") as string);
    params.set("sort", formData.get("sort") as string);
    
    // Handle date separately
   if (date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  params.set("date", formattedDate);
    }else {
      params.delete("date");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <form
      className="mt-6 grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr]"
      onSubmit={handleFilterChange}
    >
      <label className="obs-input-field">
        <Search className="obs-icon" />
        <input
          name="search"
          defaultValue={initialValues.search}
          placeholder="Cari nama satwa, lokasi, petugas"
          className="obs-input-element"
        />
      </label>

      <select
        name="shift"
        defaultValue={initialValues.shift}
        className="obs-select-field"
      >
        <option value="">Semua Shift</option>
        <option value="Pagi">Pagi</option>
        <option value="Sore">Sore</option>
      </select>

      <select
        name="category"
        defaultValue={initialValues.category}
        className="obs-select-field"
      >
        <option value="">Semua Kategori</option>
        <option value="Mamalia">Mamalia</option>
        <option value="Burung">Burung</option>
        <option value="Reptil">Reptil</option>
        <option value="Amfibi">Amfibi</option>
      </select>

      <DatePicker value={date} onChange={setDate} className="obs-select-field" />

      <select
        name="sort"
        defaultValue={initialValues.sort}
        className="obs-select-field"
      >
        <option value="desc">Tanggal terbaru</option>
        <option value="asc">Tanggal terlama</option>
      </select>

      <div className="lg:col-span-5 flex justify-end">
        <button type="submit" className="obs-btn-filter" disabled={isPending}>
          {isPending ? "Menerapkan..." : "Terapkan Filter"}
        </button>
      </div>
    </form>
  );
}
