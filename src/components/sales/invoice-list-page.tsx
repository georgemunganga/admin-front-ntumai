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
import { Badge, Button, Input, Table, Text } from "rizzui";
import { PiDownloadSimpleBold, PiMagnifyingGlassBold, PiNotePencilBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import { salesInvoices, type SalesInvoice } from "@/components/sales/invoice-data";

const invoiceLanes = ["All", "Pending", "Paid", "Overdue", "Draft"] as const;

export default function InvoiceListPage() {
  const [query, setQuery] = useState("");
  const [lane, setLane] = useState<(typeof invoiceLanes)[number]>("All");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredRows = useMemo(() => {
    const term = query.toLowerCase();
    return salesInvoices.filter((row) => {
      const matchesQuery = [row.id, row.customer, row.status, row.destination, row.cycle]
        .join(" ")
        .toLowerCase()
        .includes(term);
      const matchesLane = lane === "All" ? true : row.status === lane;
      return matchesQuery && matchesLane;
    });
  }, [lane, query]);

  const columns = useMemo<ColumnDef<SalesInvoice>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Invoice",
        cell: ({ row }) => (
          <div className="space-y-1">
            <Link href={routes.sales.invoiceDetails(row.original.id)} className="font-semibold text-gray-900 hover:text-primary">
              {row.original.id}
            </Link>
            <Text className="text-xs text-gray-500">{row.original.createdAt}</Text>
          </div>
        ),
      },
      {
        accessorKey: "customer",
        header: "Merchant",
        cell: ({ row }) => (
          <div className="space-y-1">
            <Text className="font-medium text-gray-900">{row.original.customer}</Text>
            <Text className="text-xs text-gray-500">{row.original.destination}</Text>
          </div>
        ),
      },
      {
        accessorKey: "cycle",
        header: "Cycle",
      },
      {
        accessorKey: "dueDate",
        header: "Due",
      },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <InvoiceStatus status={row.original.status} />,
      },
      { accessorKey: "createdAt", header: "Created At" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link href={routes.sales.editInvoice(row.original.id)}>
              <Button variant="text" className="h-auto p-0 text-primary">
                Edit
                <PiNotePencilBold className="ms-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ),
      },
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
        breadcrumb={["Home", "Sales", "Invoices"]}
        eyebrow="Sales Kit"
        title="Invoice List"
        description="Track merchant settlements, customer billing adjustments, and finance follow-ups from one list."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Link href={routes.sales.createInvoice}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                Add Invoice
              </Button>
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {invoiceLanes.map((tab) => {
            const active = lane === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setLane(tab)}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-primary/5 text-gray-600 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex w-full max-w-3xl flex-wrap items-center gap-3">
            <Input
              type="search"
              placeholder="Search invoices..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-10"
              className="w-full max-w-md"
            />
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
              Finance monitored
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Text className="text-sm text-gray-500">{filteredRows.length} invoices</Text>
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
