"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge, Button, Input, Table, Text, Title } from "rizzui";
import { PiDownloadSimpleBold, PiMagnifyingGlassBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import { CrudRecord } from "@/components/crud/crud-data";

type SalesEntityListPageProps = {
  breadcrumb: string[];
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  searchPlaceholder: string;
  statusBadge: string;
  countLabel: string;
  entityLabel: string;
  rows: CrudRecord[];
  stats: {
    label: string;
    value: string;
    meta: string;
  }[];
};

export default function SalesEntityListPage({
  breadcrumb,
  eyebrow,
  title,
  description,
  actionLabel,
  searchPlaceholder,
  statusBadge,
  countLabel,
  entityLabel,
  rows,
  stats,
}: SalesEntityListPageProps) {
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredRows = useMemo(() => {
    const term = query.toLowerCase();
    return rows.filter((row) =>
      [row.id, row.primary, row.secondary, row.tertiary, row.owner, row.status]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query, rows]);

  const columns = useMemo<ColumnDef<CrudRecord>[]>(
    () => [
      {
        accessorKey: "primary",
        header: entityLabel,
        cell: ({ row }) => (
          <div>
            <Text className="font-semibold text-gray-900">{row.original.primary}</Text>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      { accessorKey: "secondary", header: "Context" },
      { accessorKey: "tertiary", header: "Segment" },
      { accessorKey: "owner", header: "Owner" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <SalesStatus status={row.original.status} />,
      },
      { accessorKey: "updatedAt", header: "Updated At" },
    ],
    [entityLabel],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={breadcrumb}
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              {actionLabel}
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="mt-3 text-[28px] font-semibold tracking-tight">
              {stat.value}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">{stat.meta}</Text>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
            className="w-full max-w-md"
          />
          <div className="flex items-center gap-3">
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
              {statusBadge}
            </Badge>
            <Text className="text-sm text-gray-500">
              {filteredRows.length} {countLabel}
            </Text>
          </div>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[980px]">
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Head key={header.id} className="bg-gray-100">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Head>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Text className="text-sm text-gray-500">
            Showing {table.getRowModel().rows.length} of {filteredRows.length} {countLabel}
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
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

function SalesStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>
      {status.replace("_", " ")}
    </span>
  );
}
