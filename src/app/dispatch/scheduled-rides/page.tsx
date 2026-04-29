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
import {
  PiArrowClockwiseBold,
  PiCalendarPlusBold,
  PiDownloadSimpleBold,
  PiMagnifyingGlassBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import StatusBadge from "@/components/admin/status-badge";

type RideStatus =
  | "live"
  | "stable"
  | "review"
  | "monitoring"
  | "queued"
  | "at_risk";

type ScheduledRide = {
  id: string;
  rider: string;
  pickup: string;
  dropoff: string;
  lane: string;
  service: string;
  date: string;
  time: string;
  supply: string;
  owner: string;
  status: RideStatus;
  updatedAt: string;
};

const ridesSeed: ScheduledRide[] = [
  {
    id: "SCH-2184",
    rider: "Kennedy Phiri",
    pickup: "KKIA arrivals",
    dropoff: "Roma, Lusaka",
    lane: "Airport inbound",
    service: "Airport pickup",
    date: "Today",
    time: "07:45",
    supply: "Reserved driver",
    owner: "Airport desk",
    status: "stable",
    updatedAt: "2 min ago",
  },
  {
    id: "SCH-2191",
    rider: "Ciela Corporate",
    pickup: "Ciela offices",
    dropoff: "Levy Junction",
    lane: "B2B shuttle",
    service: "Corporate ride",
    date: "Today",
    time: "08:30",
    supply: "Pending lock",
    owner: "B2B dispatch",
    status: "review",
    updatedAt: "6 min ago",
  },
  {
    id: "SCH-2206",
    rider: "Martha Chola",
    pickup: "Woodlands clinic",
    dropoff: "UTH specialist wing",
    lane: "Medical recurring",
    service: "Medical transfer",
    date: "Today",
    time: "11:00",
    supply: "Reserved driver",
    owner: "Scheduling lane",
    status: "monitoring",
    updatedAt: "14 min ago",
  },
  {
    id: "SCH-2213",
    rider: "Munda Family",
    pickup: "Olympia Park",
    dropoff: "EastPark Mall",
    lane: "Evening pre-booking",
    service: "Consumer ride",
    date: "Tomorrow",
    time: "18:10",
    supply: "Open pool",
    owner: "Planning desk",
    status: "queued",
    updatedAt: "22 min ago",
  },
  {
    id: "SCH-2220",
    rider: "Mika Lodge",
    pickup: "Mika Convention Centre",
    dropoff: "KKIA departures",
    lane: "Hotel transfer",
    service: "Airport drop-off",
    date: "Tomorrow",
    time: "20:00",
    supply: "Pending lock",
    owner: "Hospitality desk",
    status: "at_risk",
    updatedAt: "29 min ago",
  },
  {
    id: "SCH-2228",
    rider: "Green Harvest Team",
    pickup: "Mass Media",
    dropoff: "Chalala depot",
    lane: "Staff shuttle",
    service: "Corporate ride",
    date: "Friday",
    time: "17:20",
    supply: "Reserve pool",
    owner: "B2B dispatch",
    status: "live",
    updatedAt: "36 min ago",
  },
];

const dayOptions = [
  { label: "All dates", value: "all" },
  { label: "Today", value: "Today" },
  { label: "Tomorrow", value: "Tomorrow" },
  { label: "Friday", value: "Friday" },
] as const;

const serviceOptions = [
  { label: "All services", value: "all" },
  ...Array.from(new Set(ridesSeed.map((row) => row.service))).map((value) => ({
    label: value,
    value,
  })),
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

export default function DispatchScheduledRidesPage() {
  const [query, setQuery] = useState("");
  const [day, setDay] = useState("all");
  const [service, setService] = useState("all");
  const [status, setStatus] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return ridesSeed.filter((row) => {
      const matchesDay = day === "all" ? true : row.date === day;
      const matchesService = service === "all" ? true : row.service === service;
      const matchesStatus = status === "all" ? true : row.status === status;
      const haystack = [
        row.id,
        row.rider,
        row.pickup,
        row.dropoff,
        row.lane,
        row.owner,
        row.supply,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesDay &&
        matchesService &&
        matchesStatus &&
        (!needle || haystack.includes(needle))
      );
    });
  }, [day, query, service, status]);

  const columns = useMemo<ColumnDef<ScheduledRide>[]>(
    () => [
      {
        accessorKey: "rider",
        header: "Ride / Rider",
        cell: ({ row }) => (
          <div>
            <Text className="font-semibold text-gray-900">
              {row.original.rider}
            </Text>
            <Text className="text-xs text-gray-500">
              {row.original.id} · {row.original.service}
            </Text>
          </div>
        ),
      },
      {
        accessorKey: "pickup",
        header: "Route",
        cell: ({ row }) => (
          <Text className="text-sm text-gray-600">
            {row.original.pickup} → {row.original.dropoff}
          </Text>
        ),
      },
      { accessorKey: "lane", header: "Lane" },
      {
        accessorKey: "time",
        header: "Schedule",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">
              {row.original.date}
            </Text>
            <Text className="text-xs text-gray-500">{row.original.time}</Text>
          </div>
        ),
      },
      { accessorKey: "supply", header: "Supply state" },
      { accessorKey: "owner", header: "Owner" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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

  const unlockedCount = filteredRows.filter(
    (row) => row.supply !== "Reserved driver",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dispatch", "Scheduled Rides"]}
        eyebrow="Dispatch Ops"
        title="Scheduled rides"
        description="Advance ride bookings coming from customer and business flows."
        badge="Planning"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiCalendarPlusBold className="me-1.5 h-[17px] w-[17px]" />
              New scheduled ride
            </Button>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_220px_180px_auto]">
          <Input
            type="search"
            placeholder="Search scheduled rides..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
          />
          <Select
            options={dayOptions as any}
            value={day}
            onChange={(option: any) => setDay(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
          <Select
            options={serviceOptions as any}
            value={service}
            onChange={(option: any) => setService(option?.value ?? "all")}
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
              setDay("all");
              setService("all");
              setStatus("all");
            }}
          >
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <Text className="text-sm text-gray-500">
            {filteredRows.length} scheduled rides
          </Text>
          <div className="flex items-center gap-2">
            <Badge
              variant="flat"
              className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary"
            >
              Ntumai mobile bookings
            </Badge>
            <Badge
              variant="flat"
              className="rounded-2xl bg-gray-100 px-3 py-1.5 text-gray-700"
            >
              {unlockedCount} need supply lock
            </Badge>
          </div>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[1180px]">
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Head key={header.id} className="bg-gray-100">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Text className="text-sm text-gray-500">
            Showing {table.getRowModel().rows.length} of {filteredRows.length} rides
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
