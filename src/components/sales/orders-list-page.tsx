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
import { PiDownloadSimpleBold, PiMagnifyingGlassBold, PiNotePencilBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import { salesOrders, type SalesOrder } from "@/components/sales/order-data";

const laneOptions = [
  { label: "All lanes", value: "all" },
  { label: "Active", value: "active" },
  { label: "Preparing", value: "preparing" },
  { label: "History", value: "history" },
] as const;

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Live", value: "live" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
] as const;

export default function OrdersListPage() {
  const [query, setQuery] = useState("");
  const [lane, setLane] = useState("all");
  const [status, setStatus] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 8 });

  const filteredRows = useMemo(() => {
    const term = query.toLowerCase();
    return salesOrders.filter((row) => {
      const haystack = [
        row.id,
        row.orderNumber,
        row.customer,
        row.customerPhone,
        row.vendor,
        row.city,
        row.status,
        row.paymentState,
        row.paymentMethod,
        row.fulfillment,
        row.trackingId,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = haystack.includes(term);
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesLane =
        lane === "all"
          ? true
          : lane === "active"
            ? row.status === "live"
            : lane === "preparing"
              ? row.status === "review" || row.status === "monitoring"
              : row.status === "queued" || row.status === "stable";

      return matchesQuery && matchesStatus && matchesLane;
    });
  }, [lane, query, status]);

  const columns = useMemo<ColumnDef<SalesOrder>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => (
          <div>
            <Link href={routes.sales.orderDetails(row.original.slug)} className="font-semibold text-gray-900 hover:text-primary">
              {row.original.orderNumber}
            </Link>
            <Text className="text-xs text-gray-500">
              {row.original.customer} · {row.original.itemCount}
            </Text>
          </div>
        ),
      },
      { accessorKey: "vendor", header: "Vendor" },
      {
        accessorKey: "deliveryAddress",
        header: "Destination",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">{row.original.city}</Text>
            <Text className="text-xs text-gray-500">{row.original.deliveryAddress}</Text>
          </div>
        ),
      },
      { accessorKey: "fulfillment", header: "Fulfillment" },
      {
        accessorKey: "paymentState",
        header: "Payment",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">{row.original.paymentState}</Text>
            <Text className="text-xs text-gray-500">{row.original.paymentMethod}</Text>
          </div>
        ),
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">{row.original.totalAmount}</Text>
            <Text className="text-xs text-gray-500">{row.original.subtotal} subtotal</Text>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <OrderStatus status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link href={routes.sales.editOrder(row.original.slug)}>
              <Button variant="text" className="h-auto p-0 text-primary">
                Edit
                <PiNotePencilBold className="ms-1 h-4 w-4" />
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

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Orders"]}
        eyebrow="Sales Kit"
        title="Orders"
        description="Order list aligned to checkout, vendor handoff, and tracking workflows."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Link href={routes.sales.createOrder}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                Create Order
              </Button>
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
          <Input
            type="search"
            placeholder="Search orders..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
          />
          <Select
            options={laneOptions as any}
            value={lane}
            onChange={(option: any) => setLane(option?.value ?? "all")}
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
              setLane("all");
              setStatus("all");
            }}
          >
            Reset
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Preparing", value: "preparing" },
              { label: "History", value: "history" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setLane(tab.value)}
                className={`rounded-2xl px-3 py-1.5 text-sm font-medium ${
                  lane === tab.value ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            Order ops
          </Badge>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <Text className="text-sm text-gray-500">{filteredRows.length} orders</Text>
          <Text className="text-xs text-gray-500">Customer checkout and vendor handoff view</Text>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[1180px]">
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
                    <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Text className="text-sm text-gray-500">
            Showing {table.getRowModel().rows.length} of {filteredRows.length} orders
          </Text>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 px-3" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Text className="text-sm text-gray-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </Text>
            <Button variant="outline" className="h-9 px-3" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };
  return <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>{status.replace("_", " ")}</span>;
}
