"use client";
import { useState, useCallback } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge, Button, Input, Modal, Text } from "rizzui";
import {
  PiMagnifyingGlassBold,
  PiXBold,
  PiCheckBold,
  PiWarningBold,
} from "react-icons/pi";
import DataSourceState from "@/components/admin/data-source-state";
import PageHeader from "@/components/admin/page-header";
import {
  useAdminBookings,
  updateAdminBookingStatus,
  type AdminBookingSummary,
  type BookingStatus,
} from "@/repositories/admin/bookings";

// ─── Status colour map ────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  searching: "bg-amber-50 text-amber-700",
  offered: "bg-blue-50 text-blue-700",
  accepted: "bg-blue-100 text-blue-800",
  en_route: "bg-indigo-50 text-indigo-700",
  arrived_pickup: "bg-violet-50 text-violet-700",
  picked_up: "bg-purple-50 text-purple-700",
  en_route_dropoff: "bg-teal-50 text-teal-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

function BookingStatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${cls}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────

type ActionModal = {
  booking: AdminBookingSummary;
  action: "cancelled" | "delivered";
} | null;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingsListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { bookings, total, isLoading, error, isFixture } = useAdminBookings({
    search: search || undefined,
    status: statusFilter || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const handleAction = useCallback(
    async (booking: AdminBookingSummary, action: "cancelled" | "delivered") => {
      setActionModal({ booking, action });
      setActionReason("");
    },
    []
  );

  const confirmAction = useCallback(async () => {
    if (!actionModal) return;
    setActionLoading(true);
    const result = await updateAdminBookingStatus(
      actionModal.booking.id,
      actionModal.action,
      actionReason || undefined
    );
    setActionLoading(false);
    setActionModal(null);
    setActionResult({
      success: result.success,
      message: result.success
        ? `Booking ${actionModal.booking.id} has been ${actionModal.action}.`
        : result.error ?? "Action failed.",
    });
  }, [actionModal, actionReason]);

  const isTerminal = (status: string) =>
    ["delivered", "cancelled"].includes(status.toLowerCase());

  const columns: ColumnDef<AdminBookingSummary>[] = [
    {
      header: "Booking ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <Text className="font-mono text-xs text-gray-700">{row.original.id}</Text>
      ),
    },
    {
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <Text className="text-sm font-medium">{row.original.customer.name}</Text>
          <Text className="text-xs text-gray-500">{row.original.customer.phone}</Text>
        </div>
      ),
    },
    {
      header: "Pickup",
      cell: ({ row }) => (
        <Text className="max-w-[180px] truncate text-xs text-gray-600">
          {row.original.pickup.address || "—"}
        </Text>
      ),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleType",
      cell: ({ row }) => (
        <Badge variant="flat" className="capitalize">
          {row.original.vehicleType}
        </Badge>
      ),
    },
    {
      header: "Rider",
      cell: ({ row }) =>
        row.original.rider ? (
          <div>
            <Text className="text-sm">{row.original.rider.name}</Text>
            <Text className="text-xs text-gray-500">{row.original.rider.phone}</Text>
          </div>
        ) : (
          <Text className="text-xs text-gray-400 italic">Unassigned</Text>
        ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
    },
    {
      header: "Drops",
      accessorKey: "dropoffCount",
      cell: ({ row }) => (
        <Text className="text-center text-sm">{row.original.dropoffCount}</Text>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <Text className="text-xs text-gray-500">
          {new Date(row.original.createdAt).toLocaleString()}
        </Text>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const terminal = isTerminal(row.original.status);
        if (terminal) return <Text className="text-xs text-gray-400">—</Text>;
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              onClick={() => handleAction(row.original, "delivered")}
            >
              <PiCheckBold className="mr-1 h-3 w-3" />
              Complete
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-300 text-rose-700 hover:bg-rose-50"
              onClick={() => handleAction(row.original, "cancelled")}
            >
              <PiXBold className="mr-1 h-3 w-3" />
              Cancel
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: bookings,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        title="Delivery Bookings"
        description="Live delivery and errand jobs from the mobile app."
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          prefix={<PiMagnifyingGlassBold className="h-4 w-4 text-gray-400" />}
          placeholder="Search by customer, phone, booking ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Statuses</option>
          {[
            "pending",
            "searching",
            "offered",
            "accepted",
            "en_route",
            "arrived_pickup",
            "picked_up",
            "en_route_dropoff",
            "delivered",
            "cancelled",
          ].map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <DataSourceState
            isLoading={isLoading}
            isLive={!isFixture && !error}
            error={isFixture ? "Showing cached data" : null}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  Loading bookings…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {pagination.pageIndex * pagination.pageSize + 1}–
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of {total}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {actionModal && (
        <Modal isOpen onClose={() => setActionModal(null)}>
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <PiWarningBold className="h-6 w-6 text-amber-500" />
              <Text className="text-lg font-semibold">
                {actionModal.action === "cancelled" ? "Cancel Booking" : "Force Complete Booking"}
              </Text>
            </div>
            <Text className="text-sm text-gray-600">
              You are about to mark booking{" "}
              <span className="font-mono font-semibold">{actionModal.booking.id}</span> as{" "}
              <span className="font-semibold">{actionModal.action}</span>. This action cannot be
              undone.
            </Text>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Reason (optional)
              </label>
              <Input
                placeholder="Enter reason for this action…"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setActionModal(null)}>
                Cancel
              </Button>
              <Button
                isLoading={actionLoading}
                onClick={confirmAction}
                className={
                  actionModal.action === "cancelled"
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Result Modal */}
      {actionResult && (
        <Modal isOpen onClose={() => setActionResult(null)}>
          <div className="space-y-4 p-6">
            <Text className="text-lg font-semibold">
              {actionResult.success ? "Action Applied" : "Action Failed"}
            </Text>
            <Text className="text-sm text-gray-600">{actionResult.message}</Text>
            <div className="flex justify-end">
              <Button onClick={() => setActionResult(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
