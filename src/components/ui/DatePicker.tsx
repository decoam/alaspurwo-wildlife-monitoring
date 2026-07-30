"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { formatDate } from "@/lib/date";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
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
    <div className={`relative w-full ${className || ''}`} ref={rootRef}>
      <button
        type="button"
        className={`w-full justify-start text-left font-normal flex items-center px-3 py-2 border rounded-md text-sm ${
          !value ? "text-muted-foreground" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? formatDate(value) : <span>Pilih tanggal</span>}
      </button>
      {isOpen && (
<div className="absolute top-full mt-2 z-50 bg-[#0A1A17] p-4 rounded-xl shadow-2xl border border-emerald-900/40 text-white">          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            locale={id}
          />
        </div>
      )}
    </div>
  );
}
