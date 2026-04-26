"use client";

import StatusBadge from "@/components/admin/status-badge";
import cn from "@/utils/class-names";

type Column = {
  key: string;
  label: string;
  className?: string;
};

type Row = Record<string, React.ReactNode>;

type DataTableProps = {
  columns: Column[];
  rows: Row[];
  compact?: boolean;
};

export default function DataTable({
  columns,
  rows,
  compact = false,
}: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-gray-100">
      <div className="hidden grid-cols-[repeat(var(--columns),minmax(0,1fr))] border-b border-gray-100 bg-gray-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 md:grid">
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn("truncate", column.className)}
            style={{ ["--columns" as string]: columns.length }}
          >
            {column.label}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {rows.map((row, index) => (
          <div
            key={`row-${index}`}
            className={cn(
              "grid gap-4 px-5 py-4 md:grid-cols-[repeat(var(--columns),minmax(0,1fr))] md:items-center",
              compact ? "text-sm" : "text-[15px]",
            )}
            style={{ ["--columns" as string]: columns.length }}
          >
            {columns.map((column) => {
              const value = row[column.key];
              return (
                <div key={column.key} className={cn("min-w-0", column.className)}>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 md:hidden">
                    {column.label}
                  </div>
                  <div className="truncate text-gray-700">{value}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
