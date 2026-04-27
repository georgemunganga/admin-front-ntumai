"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Checkbox, Input, Table, Text } from "rizzui";
import { PiDotsThreeOutlineVerticalFill, PiFunnel, PiMagnifyingGlassBold } from "react-icons/pi";
import StatusBadge from "@/components/admin/status-badge";
import PageHeader from "@/components/admin/page-header";
import { CrudRecord } from "@/components/crud/crud-data";

type Props = {
  title: string;
  breadcrumb: string[];
  searchPlaceholder: string;
  rows: CrudRecord[];
};

export default function PinningListPage({
  title,
  breadcrumb,
  searchPlaceholder,
  rows,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select", "primary"],
    right: ["actions"],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const columns = useMemo<ColumnDef<CrudRecord>[]>(
    () => [
      {
        id: "select",
        size: 60,
        header: ({ table }) => (
          <Checkbox
            className="ps-2"
            aria-label="Select all rows"
            checked={table.getIsAllPageRowsSelected()}
            onChange={() => table.toggleAllPageRowsSelected()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="ps-2"
            aria-label="Select row"
            checked={row.getIsSelected()}
            onChange={() => row.toggleSelected()}
          />
        ),
      },
      {
        accessorKey: "primary",
        header: "Name",
        size: 280,
        cell: ({ row }) => (
          <div>
            <Text className="font-semibold text-gray-900">{row.original.primary}</Text>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      {
        accessorKey: "secondary",
        header: "Context",
        size: 220,
      },
      {
        accessorKey: "tertiary",
        header: "Segment",
        size: 180,
      },
      {
        accessorKey: "owner",
        header: "Owner",
        size: 180,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 180,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 160,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        size: 90,
        header: "",
        cell: () => (
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800">
            <PiDotsThreeOutlineVerticalFill className="h-4 w-4" />
          </button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      globalFilter,
      rowSelection,
      columnPinning,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const haystack = [
        row.original.id,
        row.original.primary,
        row.original.secondary,
        row.original.tertiary,
        row.original.owner,
        row.original.status,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(String(filterValue).toLowerCase());
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader breadcrumb={breadcrumb} title={title} />

      <div className="table-filter mb-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onClear={() => setGlobalFilter("")}
            onChange={(event) => setGlobalFilter(event.target.value)}
            inputClassName="h-9"
            clearable
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          />
        </div>

        <div className="ms-4 flex flex-shrink-0 items-center">
          <Button variant="outline" className="me-2.5 h-9 pe-3 ps-2.5">
            <PiFunnel className="me-1.5 h-[18px] w-[18px]" strokeWidth={1.7} />
            Filters
          </Button>
          <Button variant="outline" className="h-9 px-3">
            Columns
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-muted bg-white p-4 shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[1050px]">
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const pinned = header.column.getIsPinned();
                    return (
                      <Table.Head
                        key={header.id}
                        className="bg-gray-100"
                        style={getPinningStyles(pinned, header.column.getSize(), header.column.getStart("left"), header.column.getAfter("right"))}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </Table.Head>
                    );
                  })}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const pinned = cell.column.getIsPinned();
                    return (
                      <Table.Cell
                        key={cell.id}
                        style={getPinningStyles(pinned, cell.column.getSize(), cell.column.getStart("left"), cell.column.getAfter("right"))}
                        className="last:border-b-transparent"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Text className="text-sm text-gray-500">
            Showing {table.getRowModel().rows.length} of {rows.length} records
          </Text>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 px-3"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Text className="text-sm text-gray-500">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </Text>
            <Button
              variant="outline"
              className="h-9 px-3"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPinningStyles(
  pinned: false | "left" | "right",
  width: number,
  left?: number,
  right?: number,
): React.CSSProperties {
  if (!pinned) return { width };
  return {
    position: "sticky",
    width,
    left: pinned === "left" ? left : undefined,
    right: pinned === "right" ? right : undefined,
    zIndex: 2,
    background: "white",
  };
}
