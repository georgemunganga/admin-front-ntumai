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
import { Badge, Button, Input, Select, Table, Text } from "rizzui";
import { PiDownloadSimpleBold, PiMagnifyingGlassBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";

type RiderRecord = {
  id: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
  owner: string;
  updatedAt: string;
};

const rows: RiderRecord[] = [
  {
    id: "RID-101",
    primary: "VIP retention cohort",
    secondary: "High-value riders with recent churn or ETA complaints",
    tertiary: "VIP retention",
    status: "monitoring",
    owner: "CRM desk",
    updatedAt: "Apr 26, 09:04",
  },
  {
    id: "RID-100",
    primary: "Refund dispute cluster",
    secondary: "Customers generating repeated recovery cost and unresolved complaint history",
    tertiary: "Service recovery",
    status: "review",
    owner: "Support quality",
    updatedAt: "Apr 26, 08:46",
  },
  {
    id: "RID-099",
    primary: "Healthy weekly repeat users",
    secondary: "Stable ordering cadence with no current friction signals",
    tertiary: "Lifecycle",
    status: "stable",
    owner: "Growth desk",
    updatedAt: "Apr 26, 08:18",
  },
  {
    id: "RID-098",
    primary: "Trust hold backlog",
    secondary: "Flagged profiles waiting for final trust disposition before normal treatment resumes",
    tertiary: "Trust monitoring",
    status: "queued",
    owner: "Trust team",
    updatedAt: "Apr 26, 07:56",
  },
  {
    id: "RID-097",
    primary: "Reactivation campaign users",
    secondary: "Dormant riders eligible for win-back and lifecycle outreach",
    tertiary: "Growth",
    status: "live",
    owner: "Lifecycle ops",
    updatedAt: "Apr 26, 07:31",
  },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Stable", value: "stable" },
  { label: "Live", value: "live" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
] as const;

const segmentOptions = [
  { label: "All segments", value: "all" },
  ...Array.from(new Set(rows.map((row) => row.tertiary))).map((value) => ({ label: value, value })),
];

export default function CrmRidersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [segment, setSegment] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesSegment = segment === "all" ? true : row.tertiary === segment;
      const haystack = [row.id, row.primary, row.secondary, row.tertiary, row.owner, row.status]
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesSegment && (!needle || haystack.includes(needle));
    });
  }, [query, segment, status]);

  const columns = useMemo<ColumnDef<RiderRecord>[]>(
    () => [
      {
        accessorKey: "primary",
        header: "Rider lane",
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
        cell: ({ row }) => <RiderStatus status={row.original.status} />,
      },
      { accessorKey: "updatedAt", header: "Updated" },
    ],
    [],
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
        breadcrumb={["Home", "CRM", "Riders"]}
        eyebrow="Customer CRM"
        title="Riders"
        description="Rider account list."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Rider
            </Button>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
          <Input
            type="search"
            placeholder="Search riders..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
          />
          <Select
            options={segmentOptions as any}
            value={segment}
            onChange={(option: any) => setSegment(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
          <Select
            options={statusOptions as any}
            value={status}
            onChange={(option: any) => setStatus(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
          <Button
            variant="outline"
            className="h-10 rounded-2xl px-4"
            onClick={() => {
              setQuery("");
              setSegment("all");
              setStatus("all");
            }}
          >
            Reset
          </Button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <Text className="text-sm text-gray-500">{filteredRows.length} rider lanes</Text>
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            CRM monitored
          </Badge>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[980px]">
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Head key={header.id} className="bg-gray-100">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
            Showing {table.getRowModel().rows.length} of {filteredRows.length} rider lanes
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

function RiderStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    stable: "bg-emerald-50 text-emerald-700",
    live: "bg-primary/10 text-primary",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>
      {status.replace("_", " ")}
    </span>
  );
}
