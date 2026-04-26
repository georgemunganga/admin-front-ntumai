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
import { Badge, Button, Input, Table, Text, Title } from "rizzui";
import { PiDownloadSimpleBold, PiMagnifyingGlassBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";

type InvoiceRecord = {
  id: string;
  customer: string;
  dueDate: string;
  amount: string;
  status: string;
  createdAt: string;
};

const invoiceRows: InvoiceRecord[] = [
  { id: "INV-4021", customer: "QuickBite Kitchens", dueDate: "Apr 29, 2026", amount: "ZMW 8,450", status: "Paid", createdAt: "Apr 20, 2026" },
  { id: "INV-4020", customer: "Green Basket Market", dueDate: "May 02, 2026", amount: "ZMW 5,120", status: "Pending", createdAt: "Apr 19, 2026" },
  { id: "INV-4019", customer: "CityCare Pharmacy", dueDate: "Apr 27, 2026", amount: "ZMW 2,380", status: "Overdue", createdAt: "Apr 17, 2026" },
  { id: "INV-4018", customer: "HomeBox Supplies", dueDate: "May 05, 2026", amount: "ZMW 6,975", status: "Draft", createdAt: "Apr 16, 2026" },
  { id: "INV-4017", customer: "FreshHub", dueDate: "Apr 30, 2026", amount: "ZMW 4,210", status: "Pending", createdAt: "Apr 15, 2026" },
];

const invoiceStats = [
  { label: "Collected this week", value: "ZMW 126K", meta: "18 settlements cleared" },
  { label: "Pending invoices", value: "31", meta: "7 due within 24 hours" },
  { label: "Overdue balance", value: "ZMW 12.8K", meta: "3 accounts need follow-up" },
  { label: "Average payout cycle", value: "2.6 days", meta: "Stable against target" },
];

export default function InvoiceListPage() {
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredRows = useMemo(() => {
    const term = query.toLowerCase();
    return invoiceRows.filter((row) =>
      [row.id, row.customer, row.status].join(" ").toLowerCase().includes(term)
    );
  }, [query]);

  const columns = useMemo<ColumnDef<InvoiceRecord>[]>(
    () => [
      { accessorKey: "id", header: "Invoice ID" },
      { accessorKey: "customer", header: "Customer" },
      { accessorKey: "dueDate", header: "Due Date" },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <InvoiceStatus status={row.original.status} />,
      },
      { accessorKey: "createdAt", header: "Created At" },
    ],
    []
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
        eyebrow="Sales Kit"
        title="Invoice List"
        description="Track merchant settlements, customer billing adjustments, and finance follow-ups from one list."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Invoice
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        {invoiceStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="mt-3 text-[28px] font-semibold tracking-tight">
              {stat.value}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">{stat.meta}</Text>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Input
            type="search"
            placeholder="Search invoices..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
            className="w-full max-w-md"
          />
          <div className="flex items-center gap-3">
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
              Finance monitored
            </Badge>
            <Text className="text-sm text-gray-500">
              {filteredRows.length} invoices
            </Text>
          </div>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[820px]">
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
            Showing {table.getRowModel().rows.length} of {filteredRows.length} invoices
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

function InvoiceStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-primary/10 text-primary",
    Overdue: "bg-red-50 text-red-700",
    Draft: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.Draft}`}>
      {status}
    </span>
  );
}
