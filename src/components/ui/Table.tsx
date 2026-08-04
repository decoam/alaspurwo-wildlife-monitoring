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
  tableClassName = "min-w-full divide-y divide-border-default text-sm text-text-body",
  theadClassName = "bg-surface-subtle text-left text-text-secondary",
  tbodyClassName = "divide-y divide-border-default",
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
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={rowKey(item, index)}
                className={`transition hover:bg-hover-bg ${onRowClick ? "cursor-pointer" : ""} ${trClassName ? trClassName(item, index) : ""}`}
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
