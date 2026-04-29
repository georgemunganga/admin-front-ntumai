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
  PiArrowClockwiseBold,
  PiCalendarPlusBold,
  PiDownloadSimpleBold,
  PiMagnifyingGlassBold,
  PiPackageBold,
  PiShoppingBagBold,
  PiStorefrontBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { Modal } from "@/components/modal";
import { routes } from "@/config/routes";

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

type BookingType = "delivery" | "errand" | "marketplace";
type CustomerMode = "existing" | "manual";

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
  const [isWizardOpen, setIsWizardOpen] = useState(false);
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
      {
        id: "actions",
        header: "",
        cell: () => (
          <div className="flex flex-wrap justify-end gap-4">
            <Link href={routes.dispatch.manualDispatch}>
              <Button variant="text" className="h-auto p-0 text-primary">
                Dispatch
              </Button>
            </Link>
            <Link href={routes.dispatch.liveMap}>
              <Button variant="text" className="h-auto p-0 text-primary">
                Live map
              </Button>
            </Link>
            <Link href={routes.supportDesk.inbox}>
              <Button variant="text" className="h-auto p-0 text-primary">
                Support
              </Button>
            </Link>
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

  const unlockedCount = filteredRows.filter(
    (row) => row.supply !== "Reserved driver",
  ).length;
  const airportCount = filteredRows.filter((row) =>
    row.service.toLowerCase().includes("airport"),
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
            <Button
              className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
              onClick={() => setIsWizardOpen(true)}
            >
              <PiCalendarPlusBold className="me-1.5 h-[17px] w-[17px]" />
              New scheduled ride
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Scheduled rides"
          value={String(filteredRows.length)}
          change="Planning board"
          tone="neutral"
          detail="Advance ride bookings coming from customer, business, and future-dated mobile flows."
        />
        <StatCard
          label="Need supply lock"
          value={String(unlockedCount)}
          change="Tasker assignment"
          tone="warning"
          detail="Scheduled rides that still need a reserved tasker or a confirmed fallback supply plan."
        />
        <StatCard
          label="Airport-linked"
          value={String(airportCount)}
          change="Travel lane"
          tone="positive"
          detail="Airport pickups and drop-offs that usually need tighter timing protection than normal rides."
        />
      </div>

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

      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        customSize={920}
        rounded="xl"
      >
        <ScheduledRideWizard onClose={() => setIsWizardOpen(false)} />
      </Modal>
    </div>
  );
}

function ScheduledRideWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<BookingType>("delivery");
  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");

  const productOptions: Array<{
    value: BookingType;
    title: string;
    detail: string;
    icon: React.ReactNode;
  }> = [
    {
      value: "delivery",
      title: "Delivery booking",
      detail: "Scheduled point-to-point delivery created from the customer app.",
      icon: <PiPackageBold className="h-5 w-5" />,
    },
    {
      value: "errand",
      title: "Errand / groceries",
      detail: "Operator-scheduled errand or grocery run aligned to Ntumai mobile errands.",
      icon: <PiShoppingBagBold className="h-5 w-5" />,
    },
    {
      value: "marketplace",
      title: "Marketplace order",
      detail: "Future-dated marketplace order that needs dispatch planning before fulfillment.",
      icon: <PiStorefrontBold className="h-5 w-5" />,
    },
  ];

  return (
    <div className="rounded-[28px] bg-white p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Scheduled ride wizard
          </Text>
          <Text className="mt-2 text-2xl font-semibold text-gray-900">
            Create scheduled booking
          </Text>
          <Text className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Follow the same simple appointment-style flow, then align the booking to the Ntumai mobile product it comes from.
          </Text>
        </div>
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {[
          { id: 1, label: "Schedule" },
          { id: 2, label: "Product" },
          { id: 3, label: "Booking details" },
          { id: 4, label: "Review" },
        ].map((item) => (
          <div
            key={item.id}
            className={`inline-flex items-center rounded-2xl px-4 py-2 text-sm font-semibold ${
              step === item.id
                ? "bg-primary text-white"
                : step > item.id
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="me-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
              {item.id}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="mt-6 min-h-[420px]">
        {step === 1 ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Pickup date" rounded="lg" defaultValue="2026-05-01" />
                <Input label="Pickup time" rounded="lg" defaultValue="08:30" />
                <Input label="Pickup window" rounded="lg" defaultValue="08:30 - 09:00" />
                <Input label="Service corridor" rounded="lg" defaultValue="Airport inbound" />
              </div>
              <TextareaBlock
                label="Scheduling note"
                value="Use this when the booking must be staged before the normal real-time dispatch flow opens."
              />
            </div>
            <WizardSideNote
              title="Step 1"
              detail="Choose the planned service window first. This mirrors how scheduled bookings are anchored before supply and product context are added."
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {productOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBookingType(option.value)}
                className={`rounded-[24px] border p-5 text-left transition ${
                  bookingType === option.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 bg-white hover:border-primary/40"
                }`}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {option.icon}
                </div>
                <Text className="mt-4 font-semibold text-gray-900">{option.title}</Text>
                <Text className="mt-2 text-sm leading-6 text-gray-500">{option.detail}</Text>
              </button>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div>
                <Text className="mb-3 text-sm font-medium text-gray-700">
                  Customer source
                </Text>
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setCustomerMode("existing")}
                    className={`rounded-[20px] border px-4 py-4 text-left transition ${
                      customerMode === "existing"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text className="font-semibold text-gray-900">
                      Existing customer
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Pick an existing customer or business account already in Ntumai.
                    </Text>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerMode("manual")}
                    className={`rounded-[20px] border px-4 py-4 text-left transition ${
                      customerMode === "manual"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text className="font-semibold text-gray-900">
                      Add details manually
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Enter booking contact details directly for a one-off scheduled ride.
                    </Text>
                  </button>
                </div>
              </div>

              {customerMode === "existing" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Customer / account" rounded="lg" defaultValue="Ciela Corporate" />
                  <Input label="Phone" rounded="lg" defaultValue="+260 977 200 118" />
                  <Input label="Pickup" rounded="lg" defaultValue="Ciela offices" />
                  <Input label="Drop-off" rounded="lg" defaultValue="Levy Junction" />
                  <Input label="Supply note" rounded="lg" defaultValue="Preferred van if available" />
                  <Input label="Owner" rounded="lg" defaultValue="B2B dispatch" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Customer name" rounded="lg" defaultValue="Martha Bwalya" />
                  <Input label="Phone" rounded="lg" defaultValue="+260 966 221 004" />
                  <Input label="Pickup" rounded="lg" defaultValue="Woodlands clinic" />
                  <Input label="Drop-off" rounded="lg" defaultValue="UTH specialist wing" />
                  <Input label="Email / reference" rounded="lg" defaultValue="manual-booking@ntumai.com" />
                  <Input label="Owner" rounded="lg" defaultValue="Scheduling lane" />
                </div>
              )}
              <TextareaBlock
                label="Operator note"
                value={
                  bookingType === "delivery"
                    ? "Customer-scheduled delivery from mobile app."
                    : bookingType === "errand"
                      ? "Errand or groceries booking aligned to the mobile errand flow."
                      : "Marketplace order requiring future dispatch coordination."
                }
              />
            </div>
            <WizardSideNote
              title="Step 3"
              detail="Capture the booking details exactly as support or operations would see them when a future-dated mobile booking needs dispatch planning."
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[24px] border border-gray-200 bg-gray-50/70 p-5">
              <Text className="text-sm font-semibold text-gray-900">Review summary</Text>
              <div className="mt-4 space-y-3">
                <ReviewRow label="Schedule" value="2026-05-01 · 08:30 - 09:00" />
                <ReviewRow
                  label="Product"
                  value={
                    bookingType === "delivery"
                      ? "Delivery booking"
                      : bookingType === "errand"
                        ? "Errand / groceries"
                        : "Marketplace order"
                  }
                />
                <ReviewRow
                  label="Customer source"
                  value={
                    customerMode === "existing"
                      ? "Existing customer / account"
                      : "Manual contact details"
                  }
                />
                <ReviewRow label="Route" value="Ciela offices → Levy Junction" />
                <ReviewRow label="Owner" value="B2B dispatch" />
              </div>
            </div>
            <WizardSideNote
              title="Ready to create"
              detail="This final step confirms the booking details before the scheduled ride is saved into the Ntumai planning board."
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <Button
          variant="outline"
          className="h-11 rounded-2xl px-4"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-11 rounded-2xl px-4">
            Save Draft
          </Button>
          {step < 4 ? (
            <Button
              className="h-11 rounded-2xl bg-primary px-5 text-white hover:bg-primary/90"
              onClick={() => setStep((current) => Math.min(4, current + 1))}
            >
              Next
            </Button>
          ) : (
            <Button className="h-11 rounded-2xl bg-primary px-5 text-white hover:bg-primary/90" onClick={onClose}>
              Create scheduled ride
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function TextareaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
      <textarea
        rows={5}
        defaultValue={value}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function WizardSideNote({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[24px] border border-gray-200 bg-gray-50/70 p-5">
      <Text className="font-semibold text-gray-900">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </div>
  );
}
