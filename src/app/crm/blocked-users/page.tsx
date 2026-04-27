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

type BlockedUserRecord = {
  id: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
  owner: string;
  updatedAt: string;
};

const rows: BlockedUserRecord[] = [
  {
    id: "BLK-101",
    primary: "Suspended rider accounts",
    secondary: "Customers restricted after abuse, fraud, or severe service-policy breaches",
    tertiary: "Trust operations",
    status: "monitoring",
    owner: "Trust desk",
    updatedAt: "Apr 26, 09:08",
  },
  {
    id: "BLK-100",
    primary: "Appeal-ready restrictions",
    secondary: "Accounts with enough evidence gathered for reinstatement or permanent action",
    tertiary: "Appeals",
    status: "review",
    owner: "Case review",
    updatedAt: "Apr 26, 08:46",
  },
  {
    id: "BLK-099",
    primary: "Linked-account blocks",
    secondary: "Restrictions tied to repeated identities, devices, or suspicious payment behavior",
    tertiary: "Fraud desk",
    status: "stable",
    owner: "Fraud control",
    updatedAt: "Apr 26, 08:19",
  },
  {
    id: "BLK-098",
    primary: "Pending disposition holds",
    secondary: "Users still queued for a final trust-team decision before status changes",
    tertiary: "Governance",
    status: "queued",
    owner: "Governance",
    updatedAt: "Apr 26, 07:58",
  },
  {
    id: "BLK-097",
    primary: "Chargeback abuse review",
    secondary: "Repeated payment-dispute accounts still blocked pending final trust disposition",
    tertiary: "Payments abuse",
    status: "at_risk",
    owner: "Risk and trust",
    updatedAt: "Apr 26, 07:31",
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

export default function CrmBlockedUsersPage() {
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

  const columns = useMemo<ColumnDef<BlockedUserRecord>[]>(
    () => [
      {
        accessorKey: "primary",
        header: "Restriction lane",
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
        cell: ({ row }) => <BlockedStatus status={row.original.status} />,
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
        breadcrumb={["Home", "CRM", "Blocked Users"]}
        eyebrow="Customer CRM"
        title="Blocked users"
        description="Restrictions and appeals list."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Open Restriction
            </Button>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
          <Input
            type="search"
            placeholder="Search blocked users..."
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
          <Text className="text-sm text-gray-500">{filteredRows.length} restriction lanes</Text>
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            Trust monitored
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
            Showing {table.getRowModel().rows.length} of {filteredRows.length} restriction lanes
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

function BlockedStatus({ status }: { status: string }) {
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
