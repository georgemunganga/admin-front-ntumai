"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  PiMapPinBold,
  PiMagnifyingGlassBold,
  PiPlusBold,
  PiScooterBold,
} from "react-icons/pi";
import {
  manualDispatchOrderHrefByBooking,
  manualDispatchTrackingHrefByBooking,
} from "@/components/admin/ops-workflow-links";
import { assignDispatchJob, reassignDispatchJob } from "@/repositories/admin/dispatch";
import PageHeader from "@/components/admin/page-header";
import StatusBadge from "@/components/admin/status-badge";
import { Modal } from "@/components/modal";
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
  assignedTasker?: string;
};

type NearbyTasker = {
  id: string;
  name: string;
  vehicle: string;
  distance: string;
  eta: string;
  rating: string;
  zone: string;
  availability: string;
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
    assignedTasker: "Alick Mumba",
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
    assignedTasker: "Titus Kunda",
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

const nearbyTaskersByDispatchId: Record<string, NearbyTasker[]> = {
  "MD-2104": [
    {
      id: "TSK-1108",
      name: "Chola Sampa",
      vehicle: "Motorbike",
      distance: "0.8 km away",
      eta: "5 min to pickup",
      rating: "4.9",
      zone: "CBD South",
      availability: "Ready now",
    },
    {
      id: "TSK-1041",
      name: "Alick Mumba",
      vehicle: "Motorbike",
      distance: "1.1 km away",
      eta: "7 min to pickup",
      rating: "4.8",
      zone: "Cairo Road",
      availability: "On standby",
    },
    {
      id: "TSK-1199",
      name: "Mwila Daka",
      vehicle: "Small van",
      distance: "2.4 km away",
      eta: "11 min to pickup",
      rating: "4.7",
      zone: "Longacres",
      availability: "Available after dropoff",
    },
  ],
  "MD-2111": [
    {
      id: "TSK-1214",
      name: "Faith Chisanga",
      vehicle: "Motorbike",
      distance: "0.6 km away",
      eta: "4 min to pickup",
      rating: "4.9",
      zone: "Longacres",
      availability: "Preferred merchant runner",
    },
    {
      id: "TSK-1075",
      name: "Joseph Bwalya",
      vehicle: "Motorbike",
      distance: "1.5 km away",
      eta: "8 min to pickup",
      rating: "4.8",
      zone: "Government route",
      availability: "Ready now",
    },
    {
      id: "TSK-1310",
      name: "Sharon Mwewa",
      vehicle: "Hatchback",
      distance: "2.1 km away",
      eta: "10 min to pickup",
      rating: "4.8",
      zone: "Makeni hub",
      availability: "Can cover peak lane",
    },
  ],
  "MD-2120": [
    {
      id: "TSK-1360",
      name: "Peter Zulu",
      vehicle: "Motorbike",
      distance: "1.2 km away",
      eta: "6 min to pickup",
      rating: "4.6",
      zone: "Airport inbound",
      availability: "Ready now",
    },
    {
      id: "TSK-1090",
      name: "Lillian Bowa",
      vehicle: "Sedan",
      distance: "2.8 km away",
      eta: "13 min to pickup",
      rating: "4.8",
      zone: "Airport corridor",
      availability: "Queued for next assignment",
    },
  ],
  "MD-2127": [
    {
      id: "TSK-1417",
      name: "Titus Kunda",
      vehicle: "Van",
      distance: "0.9 km away",
      eta: "5 min to pickup",
      rating: "4.9",
      zone: "B2B lane",
      availability: "Reserved fleet",
    },
    {
      id: "TSK-1455",
      name: "Derrick Lungu",
      vehicle: "Van",
      distance: "1.8 km away",
      eta: "9 min to pickup",
      rating: "4.7",
      zone: "Cresta corridor",
      availability: "Can swap route",
    },
  ],
  "MD-2133": [
    {
      id: "TSK-1512",
      name: "Rabecca Phiri",
      vehicle: "Motorbike",
      distance: "1.7 km away",
      eta: "8 min to pickup",
      rating: "4.8",
      zone: "Woodlands",
      availability: "High-risk specialist",
    },
    {
      id: "TSK-1519",
      name: "Kennedy Siame",
      vehicle: "Motorbike",
      distance: "2.5 km away",
      eta: "12 min to pickup",
      rating: "4.6",
      zone: "Chilenje branch",
      availability: "Available after cancel review",
    },
  ],
  "MD-2140": [
    {
      id: "TSK-1611",
      name: "Ruth Hachipuka",
      vehicle: "Motorbike",
      distance: "1.0 km away",
      eta: "6 min to pickup",
      rating: "4.9",
      zone: "Mass Media",
      availability: "Ready now",
    },
    {
      id: "TSK-1650",
      name: "Brian Sinyangwe",
      vehicle: "Pickup",
      distance: "3.4 km away",
      eta: "15 min to pickup",
      rating: "4.7",
      zone: "Industrial spur",
      availability: "Can take bulky load",
    },
  ],
};

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
  const searchParams = useSearchParams();
  const [rows, setRows] = useState(manualDispatchSeed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [overrideType, setOverrideType] = useState("all");
  const [assigningItem, setAssigningItem] = useState<ManualDispatchItem | null>(null);
  const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);
  const [prefillHandled, setPrefillHandled] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const prefilledOrderId = searchParams.get("orderId")?.trim() ?? "";
  const prefilledAssignmentId = searchParams.get("assignmentId")?.trim() ?? "";
  const isReassignFlow = Boolean(prefilledAssignmentId);

  useEffect(() => {
    const focusTerms = [prefilledOrderId, prefilledAssignmentId].filter(Boolean);
    if (!focusTerms.length) return;
    setQuery(focusTerms.join(" "));
  }, [prefilledAssignmentId, prefilledOrderId]);

  useEffect(() => {
    if (prefillHandled) return;
    if (!prefilledOrderId && !prefilledAssignmentId) return;

    const matchedRow = rows.find((row) => {
      if (prefilledOrderId && (row.booking === prefilledOrderId || row.id === prefilledOrderId)) {
        return true;
      }
      if (prefilledAssignmentId && row.id === prefilledAssignmentId) {
        return true;
      }
      return false;
    });

    if (matchedRow) {
      setAssigningItem(matchedRow);
      setSelectedTaskerId(null);
    }

    setPrefillHandled(true);
  }, [prefillHandled, prefilledAssignmentId, prefilledOrderId, rows]);

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return rows.filter((row) => {
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
  }, [overrideType, query, rows, status]);

  const taskerOptions = assigningItem ? nearbyTaskersByDispatchId[assigningItem.id] ?? [] : [];

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
      {
        accessorKey: "owner",
        header: "Owner / Tasker",
        cell: ({ row }) => (
          <div>
            <Text className="text-sm font-medium text-gray-700">{row.original.owner}</Text>
            <Text className="text-xs text-gray-500">
              {row.original.assignedTasker ?? "Unassigned"}
            </Text>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "updatedAt", header: "Updated" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const trackingHref = manualDispatchTrackingHrefByBooking[row.original.booking] ?? routes.logistics.tracking;
          const orderHref = manualDispatchOrderHrefByBooking[row.original.booking];

          return (
            <div className="flex flex-wrap justify-end gap-4">
              <Button
                variant="text"
                className="h-auto p-0 text-primary"
                onClick={() => {
                  setAssigningItem(row.original);
                  setSelectedTaskerId(null);
                }}
              >
                Assign
              </Button>
              <Link href={trackingHref}>
                <Button variant="text" className="h-auto p-0 text-primary">
                  Track
                </Button>
              </Link>
              {orderHref ? (
                <Link href={orderHref}>
                  <Button variant="text" className="h-auto p-0 text-primary">
                    Order
                  </Button>
                </Link>
              ) : null}
              <Link href={routes.supportDesk.inbox}>
                <Button variant="text" className="h-auto p-0 text-primary">
                  Support
                </Button>
              </Link>
            </div>
          );
        },
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
        {prefilledOrderId || prefilledAssignmentId ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
            <div className="space-y-1">
              <Text className="text-sm font-semibold text-gray-900">
                Live map dispatch focus
              </Text>
              <Text className="text-xs text-gray-600">
                This queue is focused from the live map selection so staff can continue reassignment without searching again.
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {prefilledOrderId ? (
                <Badge variant="flat" className="rounded-2xl bg-white px-3 py-1.5 text-gray-700">
                  Order {prefilledOrderId}
                </Badge>
              ) : null}
              {prefilledAssignmentId ? (
                <Badge variant="flat" className="rounded-2xl bg-white px-3 py-1.5 text-gray-700">
                  Assignment {prefilledAssignmentId}
                </Badge>
              ) : null}
              {assigningItem ? (
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  Matching override opened
                </Badge>
              ) : (
                <Badge variant="flat" className="rounded-2xl bg-secondary/10 px-3 py-1.5 text-secondary">
                  Review queue focused
                </Badge>
              )}
            </div>
          </div>
        ) : null}

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

      <Modal
        isOpen={assigningItem !== null}
        onClose={() => {
          setAssigningItem(null);
          setSelectedTaskerId(null);
        }}
        size="lg"
        rounded="xl"
      >
        {assigningItem ? (
          <div className="rounded-[28px] bg-white p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  {isReassignFlow ? "Reassign tasker" : "Assign nearest tasker"}
                </Text>
                <Text className="mt-2 text-2xl font-semibold text-gray-900">
                  {assigningItem.booking} · {assigningItem.rider}
                </Text>
                <Text className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  {isReassignFlow
                    ? "Pick the replacement tasker for this active assignment. The shortlist is ordered around pickup proximity and lane fit."
                    : "Pick the nearest available tasker for this manual dispatch job. The shortlist is ordered around pickup proximity and lane fit."}
                </Text>
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-2xl px-4"
                onClick={() => {
                  setAssigningItem(null);
                  setSelectedTaskerId(null);
                }}
              >
                Close
              </Button>
            </div>

            <div className="mt-5 grid gap-4 rounded-3xl border border-gray-100 bg-gray-50/80 p-4 md:grid-cols-3">
              <ModalMeta label="Corridor" value={assigningItem.corridor} />
              <ModalMeta label="Override type" value={assigningItem.overrideType} />
              <ModalMeta label="Supply state" value={assigningItem.supply} />
              {prefilledAssignmentId ? (
                <ModalMeta label="Assignment" value={prefilledAssignmentId} />
              ) : null}
            </div>

            <div className="mt-6 space-y-3">
              {taskerOptions.map((tasker) => {
                const isSelected = selectedTaskerId === tasker.id;

                return (
                  <button
                    key={tasker.id}
                    type="button"
                    onClick={() => setSelectedTaskerId(tasker.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 bg-white hover:border-primary/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <PiScooterBold className="h-5 w-5" />
                        </div>
                        <div>
                          <Text className="font-semibold text-gray-900">{tasker.name}</Text>
                          <Text className="mt-1 text-sm text-gray-500">
                            {tasker.vehicle} · {tasker.zone}
                          </Text>
                        </div>
                      </div>
                      <Badge
                        variant="flat"
                        className={`rounded-2xl px-3 py-1.5 ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {tasker.availability}
                      </Badge>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-4">
                      <TaskerStat label="Distance" value={tasker.distance} />
                      <TaskerStat label="ETA" value={tasker.eta} />
                      <TaskerStat label="Rating" value={tasker.rating} />
                      <TaskerStat label="Tasker ID" value={tasker.id} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <PiMapPinBold className="h-4 w-4 text-primary" />
                Nearest taskers are ranked from the pickup zone first.
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-11 rounded-2xl px-4"
                  onClick={() => {
                    setAssigningItem(null);
                    setSelectedTaskerId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 rounded-2xl bg-primary px-5 text-white hover:bg-primary/90"
                  disabled={!selectedTaskerId}
                  onClick={async () => {
                    const selectedTasker = taskerOptions.find((tasker) => tasker.id === selectedTaskerId);
                    if (!selectedTasker || !assigningItem) return;
                    // Optimistic UI update
                    setRows((currentRows) =>
                      currentRows.map((row) =>
                        row.id === assigningItem.id
                          ? {
                              ...row,
                              assignedTasker: selectedTasker.name,
                              supply: `${selectedTasker.vehicle} assigned`,
                              updatedAt: "Just now",
                              status: "live",
                            }
                          : row,
                      ),
                    );
                    setAssigningItem(null);
                    setSelectedTaskerId(null);
                    // Live API call (non-blocking, optimistic update already applied)
                    if (prefilledAssignmentId) {
                      reassignDispatchJob(prefilledAssignmentId, {
                        newDriverId: selectedTasker.id,
                        reason: "Manual reassignment from live dispatch map",
                      }).catch(() => {/* silent — optimistic update preserved */});
                      return;
                    }
                    assignDispatchJob({
                      orderId: assigningItem.booking,
                      driverId: selectedTasker.id,
                      note: `Manual assignment by admin`,
                    }).catch(() => {/* silent — optimistic update preserved */});
                  }}
                >
                  {isReassignFlow ? "Confirm reassignment" : "Confirm assignment"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function ModalMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</Text>
      <Text className="mt-2 font-semibold text-gray-900">{value}</Text>
    </div>
  );
}

function TaskerStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </Text>
      <Text className="mt-1 font-medium text-gray-900">{value}</Text>
    </div>
  );
}
