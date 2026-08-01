"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { formatDate } from "@/lib/date";
import { Button } from "@/components/ui/Button";

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
    <div className={`relative w-full ${className || ''}`} ref={rootRef}>
      <Button
        type="button"
        variant="secondary"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={disabled}
        className={`obs-input-field flex w-full items-center justify-start rounded-xl text-left text-sm font-normal ${
          !value ? "text-text-muted" : "text-text-body"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? formatDate(value) : <span>Pilih tanggal</span>}
      </Button>
      {isOpen && (
        <div
          role="dialog"
          aria-label="Pilih tanggal"
          className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-brand-primary/60 bg-surface-card p-3 text-text-body shadow-card animate-in fade-in zoom-in-95 duration-150"
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
              month_caption: "flex items-center justify-between px-1",
              caption_label: "text-sm font-semibold text-text-heading",
              nav: "flex items-center gap-1",
              button_previous: "inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-primary/30 hover:text-text-heading",
              button_next: "inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-primary/30 hover:text-text-heading",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "w-9 text-center text-xs font-medium text-text-muted",
              week: "mt-1 flex w-full",
              day: "h-9 w-9 p-0 text-center text-sm",
              day_button: "h-9 w-9 rounded-lg text-text-body hover:bg-brand-primary/30 hover:text-text-heading",
              selected: "bg-brand-primary text-text-heading hover:bg-brand-hover",
              today: "font-bold text-brand-text ring-1 ring-brand-primary/70",
              outside: "text-text-muted/50",
              disabled: "text-text-muted/40",
            }}
            components={{
              Chevron: ({ orientation }) => orientation === "left"
                ? <ChevronLeft className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />,
            }}
          />
        </div>
      )}
    </div>
  );
}
