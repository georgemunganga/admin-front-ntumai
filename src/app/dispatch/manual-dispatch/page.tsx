"use client";

import Link from "next/link";
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
import {
  PiDownloadSimpleBold,
  PiMagnifyingGlassBold,
  PiNotePencilBold,
  PiPlusBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import StatusBadge from "@/components/admin/status-badge";
import { routes } from "@/config/routes";

type ManualDispatchItem = {
  id: string;
  booking: string;
  rider: string;
  corridor: string;
  overrideType: string;
  owner: string;
  status: "live" | "stable" | "review" | "monitoring" | "queued" | "at_risk";
  priority: "critical" | "priority" | "standard";
  etaRisk: string;
  supply: string;
  updatedAt: string;
};

const manualDispatchSeed: ManualDispatchItem[] = [
  {
    id: "MD-2104",
    booking: "ORD-50318",
    rider: "Natasha Phiri",
    corridor: "Lusaka CBD to Kabulonga",
    overrideType: "Manual reassignment",
    owner: "Ops control",
    status: "live",
    priority: "priority",
    etaRisk: "Contained",
    supply: "Backup driver locked",
    updatedAt: "2 min ago",
  },
  {
    id: "MD-2111",
    booking: "ORD-50344",
    rider: "QuickBite Kitchens",
    corridor: "Longacres merchant lane",
    overrideType: "Priority merchant protection",
    owner: "Merchant ops",
    status: "review",
    priority: "critical",
    etaRisk: "High",
    supply: "Preferred rider requested",
    updatedAt: "6 min ago",
  },
  {
    id: "MD-2120",
    booking: "ORD-50379",
    rider: "Brian Tembo",
    corridor: "Airport corridor",
    overrideType: "Auto-match recovery",
    owner: "Dispatch pod",
    status: "monitoring",
    priority: "priority",
    etaRisk: "Rising",
    supply: "Open pool fallback",
    updatedAt: "11 min ago",
  },
  {
    id: "MD-2127",
    booking: "ORD-50403",
    rider: "Ciela Corporate",
    corridor: "B2B office shuttle",
    overrideType: "Batch override",
    owner: "B2B dispatch",
    status: "stable",
    priority: "priority",
    etaRisk: "Low",
    supply: "Reserved van",
    updatedAt: "18 min ago",
  },
  {
    id: "MD-2133",
    booking: "ORD-50426",
    rider: "Mercy Chola",
    corridor: "Woodlands express lane",
    overrideType: "Force-cancel review",
    owner: "Resolution desk",
    status: "at_risk",
    priority: "critical",
    etaRisk: "Severe",
    supply: "No fit supply",
    updatedAt: "24 min ago",
  },
  {
    id: "MD-2140",
    booking: "ORD-50448",
    rider: "Green Harvest Team",
    corridor: "Mass Media corridor",
    overrideType: "VIP customer protection",
    owner: "Realtime desk",
    status: "queued",
    priority: "standard",
    etaRisk: "Medium",
    supply: "Awaiting override approval",
    updatedAt: "31 min ago",
  },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Stable", value: "stable" },
  { label: "Live", value: "live" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
] as const;

const overrideOptions = [
  { label: "All override types", value: "all" },
  ...Array.from(new Set(manualDispatchSeed.map((row) => row.overrideType))).map((value) => ({
    label: value,
    value,
  })),
];

export default function DispatchManualDispatchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [overrideType, setOverrideType] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return manualDispatchSeed.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesType = overrideType === "all" ? true : row.overrideType === overrideType;
      const haystack = [
        row.id,
        row.booking,
        row.rider,
        row.corridor,
        row.overrideType,
        row.owner,
        row.supply,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesType && (!needle || haystack.includes(needle));
    });
  }, [overrideType, query, status]);

  const columns = useMemo<ColumnDef<ManualDispatchItem>[]>(
    () => [
      {
        accessorKey: "rider",
        header: "Booking / Rider",
        cell: ({ row }) => (
          <div>
            <Text className="font-semibold text-gray-900">{row.original.rider}</Text>
            <Text className="text-xs text-gray-500">
              {row.original.booking} · {row.original.id}
            </Text>
          </div>
        ),
      },
      {
        accessorKey: "corridor",
        header: "Corridor",
        cell: ({ row }) => (
          <Text className="text-sm text-gray-600">{row.original.corridor}</Text>
        ),
      },
      { accessorKey: "overrideType", header: "Override type" },
      { accessorKey: "supply", header: "Supply state" },
      { accessorKey: "owner", header: "Owner" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "updatedAt", header: "Updated" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="text" className="h-auto p-0 text-primary">
              Open
              <PiNotePencilBold className="ms-1 h-4 w-4" />
            </Button>
          </div>
        ),
      },
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
        breadcrumb={["Home", "Dispatch", "Manual Dispatch"]}
        eyebrow="Dispatch Ops"
        title="Manual dispatch"
        description="Manual override list for dispatch-controlled bookings, reassignment decisions, and protected trips."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Link href={routes.dispatch.liveMap}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                New override
              </Button>
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px_220px_auto]">
          <Input
            type="search"
            placeholder="Search overrides, bookings, riders..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
          />
          <Select
            options={overrideOptions as any}
            value={overrideType}
            onChange={(option: any) => setOverrideType(option?.value ?? "all")}
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
              setOverrideType("all");
              setStatus("all");
            }}
          >
            Reset
          </Button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <Text className="text-sm text-gray-500">
            {filteredRows.length} manual dispatch overrides
          </Text>
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            Dispatch controlled
          </Badge>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[1100px]">
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
            Showing {table.getRowModel().rows.length} of {filteredRows.length} overrides
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
