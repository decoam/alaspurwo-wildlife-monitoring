import React from "react";

interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (item: T, index: number) => string | number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  wrapperClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: (item: T, index: number) => string;
}

export function Table<T>({
  data,
  columns,
  rowKey,
  emptyMessage = "Tidak ada data.",
  onRowClick,
  wrapperClassName = "overflow-x-auto",
  tableClassName = "min-w-full divide-y divide-emerald-900/60 text-sm text-slate-300",
  theadClassName = "bg-emerald-950/50 text-left text-slate-200",
  tbodyClassName = "divide-y divide-emerald-900/60",
  trClassName,
}: TableProps<T>) {
  return (
    <div className={wrapperClassName}>
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-semibold ${col.headerClassName || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={rowKey(item, index)}
                className={`transition hover:bg-emerald-950/30 ${onRowClick ? "cursor-pointer" : ""} ${trClassName ? trClassName(item, index) : ""}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.cellClassName || ""}`}>
                    {col.cell(item, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
