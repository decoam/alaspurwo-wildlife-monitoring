"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { formatDate } from "@/lib/date";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, className, disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full ${className || ""}`} ref={rootRef}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3.5 py-2.5 text-left text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 hover:border-emerald-700/80 focus:border-emerald-500 ${
          !value ? "text-slate-400" : "text-white"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value ? formatDate(value) : "Pilih tanggal pengamatan"}</span>
        <CalendarIcon className="h-4 w-4 shrink-0 text-emerald-400 opacity-80" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Pilih tanggal"
          className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-emerald-800/80 bg-[#07110c] p-4 text-white shadow-2xl shadow-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            locale={id}
            showOutsideDays
            classNames={{
              months: "flex flex-col",
              month: "space-y-3",
              month_caption: "flex items-center justify-between px-1 mb-2",
              caption_label: "text-sm font-semibold text-emerald-300",
              nav: "flex items-center gap-1",
              button_previous: "inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-emerald-900/50 hover:text-white transition",
              button_next: "inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-emerald-900/50 hover:text-white transition",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "w-9 text-center text-xs font-medium text-emerald-500/80",
              week: "mt-1 flex w-full",
              day: "h-9 w-9 p-0 text-center text-sm",
              day_button: "h-9 w-9 rounded-xl text-slate-200 hover:bg-emerald-800/50 hover:text-white transition flex items-center justify-center",
              selected: "bg-emerald-600 text-white font-semibold hover:bg-emerald-500 rounded-xl",
              today: "font-bold text-emerald-400 ring-1 ring-emerald-500/70 rounded-xl",
              outside: "text-slate-600 opacity-40",
              disabled: "text-slate-600 opacity-30 cursor-not-allowed",
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ),
            }}
          />
        </div>
      )}
    </div>
  );
}
