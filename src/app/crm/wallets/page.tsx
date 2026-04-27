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

type WalletRecord = {
  id: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
  owner: string;
  updatedAt: string;
};

const rows: WalletRecord[] = [
  {
    id: "WAL-101",
    primary: "Manual credit queue",
    secondary: "Customer balance corrections still needing finance confirmation",
    tertiary: "Manual adjustments",
    status: "review",
    owner: "Finance ops",
    updatedAt: "Apr 26, 09:09",
  },
  {
    id: "WAL-100",
    primary: "Failed reversal cases",
    secondary: "Payment-side refunds completed but wallet balances still lagging behind",
    tertiary: "Refund reconciliation",
    status: "monitoring",
    owner: "Payments care",
    updatedAt: "Apr 26, 08:44",
  },
  {
    id: "WAL-099",
    primary: "Growth wallet grants",
    secondary: "Campaign and referral credits prepared for release",
    tertiary: "Promo credits",
    status: "stable",
    owner: "Growth desk",
    updatedAt: "Apr 26, 08:15",
  },
  {
    id: "WAL-098",
    primary: "Abuse freeze review",
    secondary: "Wallet accounts still paused pending risk investigation",
    tertiary: "Fraud and abuse",
    status: "queued",
    owner: "Risk control",
    updatedAt: "Apr 26, 07:53",
  },
  {
    id: "WAL-097",
    primary: "High-touch debit corrections",
    secondary: "Support-led balance fixes requiring audit trail completion",
    tertiary: "Manual adjustments",
    status: "at_risk",
    owner: "Governance",
    updatedAt: "Apr 26, 07:27",
  },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
] as const;

const segmentOptions = [
  { label: "All segments", value: "all" },
  ...Array.from(new Set(rows.map((row) => row.tertiary))).map((value) => ({ label: value, value })),
];

export default function CrmWalletsPage() {
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

  const columns = useMemo<ColumnDef<WalletRecord>[]>(
    () => [
      {
        accessorKey: "primary",
        header: "Wallet lane",
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
        cell: ({ row }) => <WalletStatus status={row.original.status} />,
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
        breadcrumb={["Home", "CRM", "Wallets"]}
        eyebrow="Customer CRM"
        title="Wallets"
        description="Wallet operations list."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Open Wallet Action
            </Button>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
          <Input
            type="search"
            placeholder="Search wallets..."
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
          <Text className="text-sm text-gray-500">{filteredRows.length} wallet lanes</Text>
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            Wallets monitored
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
            Showing {table.getRowModel().rows.length} of {filteredRows.length} wallet lanes
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

function WalletStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
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
