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
import { Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import {
  PiDownloadSimpleBold,
  PiMagnifyingGlassBold,
  PiNotePencilBold,
  PiPlusBold,
  PiTruckBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { shipmentOrderHrefById } from "@/components/admin/ops-workflow-links";
import DataSourceState from "@/components/admin/data-source-state";
import PageHeader from "@/components/admin/page-header";
import StatusBadge from "@/components/admin/status-badge";
import { routes } from "@/config/routes";
import type { LogisticsShipment } from "@/components/logistics/shipment-data";
import { useLogisticsShipments } from "@/repositories/admin/shipments";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Stable", value: "stable" },
  { label: "Live", value: "live" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
] as const;

export default function ShipmentsListPage() {
  const { data: shipments, isLoading, isLive, error } = useLogisticsShipments();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [segment, setSegment] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return shipments.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesSegment = segment === "all" ? true : row.lane === segment;
      const haystack = [
        row.id,
        row.trackingId,
        row.customer,
        row.pickup,
        row.dropoff,
        row.lane,
        row.owner,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesSegment && (!needle || haystack.includes(needle));
    });
  }, [query, segment, shipments, status]);

  const segmentOptions = useMemo(
    () => [
      { label: "All lanes", value: "all" },
      ...Array.from(new Set(shipments.map((shipment) => shipment.lane))).map((value) => ({ label: value, value })),
    ],
    [shipments],
  );

  const stats = useMemo(
    () => [
      {
        label: "Total shipments",
        value: String(shipments.length).padStart(2, "0"),
        detail: "All active and staged shipment records in the working set.",
        icon: PiTruckBold,
      },
      {
        label: "Live lanes",
        value: String(shipments.filter((row) => row.status === "live").length).padStart(2, "0"),
        detail: "Shipments actively moving in customer-visible delivery lanes.",
        icon: PiTruckBold,
      },
      {
        label: "Exceptions",
        value: String(shipments.filter((row) => row.status === "review" || row.status === "at_risk").length).padStart(2, "0"),
        detail: "Shipments currently requiring recovery, review, or intervention.",
        icon: PiWarningCircleBold,
      },
    ],
    [shipments],
  );

  const columns = useMemo<ColumnDef<LogisticsShipment>[]>(
    () => [
      {
        accessorKey: "trackingId",
        header: "Tracking ID",
        cell: ({ row }) => (
          <div>
            <Link
              href={routes.logistics.shipmentDetails(row.original.id)}
              className="font-semibold text-gray-900 hover:text-primary"
            >
              {row.original.trackingId}
            </Link>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">{row.original.customer}</Text>
            <Text className="text-xs text-gray-500">{row.original.customerPhone}</Text>
          </div>
        ),
      },
      {
        accessorKey: "pickup",
        header: "Origin",
        cell: ({ row }) => <Text className="text-sm text-gray-600">{row.original.pickup}</Text>,
      },
      {
        accessorKey: "dropoff",
        header: "Destination",
        cell: ({ row }) => <Text className="text-sm text-gray-600">{row.original.dropoff}</Text>,
      },
      { accessorKey: "lane", header: "Lane" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const orderHref = shipmentOrderHrefById[row.original.id];

          return (
            <div className="flex flex-wrap justify-end gap-4">
              <Link href={routes.logistics.trackingDetails(row.original.id)}>
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
              <Link href={routes.logistics.editShipment(row.original.id)}>
                <Button variant="text" className="h-auto p-0 text-primary">
                  Edit
                  <PiNotePencilBold className="ms-1 h-4 w-4" />
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
    <div className="space-y-10">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Shipment List"]}
        eyebrow="Logistics Kit"
        title="All Shipments"
        description="Template-aligned shipment list for tracking active deliveries, staged bookings, and operational exceptions."
        action={
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row lg:mt-0">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Link href={routes.logistics.createShipment} className="w-full sm:w-auto">
              <Button className="h-11 w-full rounded-2xl bg-primary px-4 text-white hover:bg-primary/90 sm:w-auto">
                <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                Create Shipment
              </Button>
            </Link>
          </div>
        }
      />

      <div className="flex flex-col gap-10">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.28)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {stat.label}
              </Text>
              <Title as="h3" className="mt-1 text-2xl font-semibold text-gray-900">
                {stat.value}
              </Title>
              <Text className="mt-2 text-sm leading-6 text-gray-500">{stat.detail}</Text>
            </div>
          ))}
        </div>

        <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]">
          <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
            <Input
              type="search"
              placeholder="Search shipments..."
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
            <Text className="text-sm text-gray-500">{filteredRows.length} shipments</Text>
            <DataSourceState isLoading={isLoading} isLive={isLive} error={error} />
          </div>

          <div className="custom-scrollbar overflow-x-auto">
            <Table variant="modern" className="min-w-[1120px]">
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
              Showing {table.getRowModel().rows.length} of {filteredRows.length} shipments
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
    </div>
  );
}
