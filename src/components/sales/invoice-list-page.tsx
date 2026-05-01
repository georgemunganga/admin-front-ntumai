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
import GuardedLink from "@/components/auth/guarded-link";
import PageHeader from "@/components/admin/page-header";
import StatCard from "@/components/admin/stat-card";
import { routes } from "@/config/routes";
import {
  listInvoiceStatuses,
  listSalesInvoices,
  type SalesInvoiceRecord,
} from "@/repositories/admin/invoices";

export default function InvoiceListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });
  const invoices = useMemo(() => listSalesInvoices(), []);
  const statusOptions = useMemo(
    () => [{ label: "All statuses", value: "all" }].concat(listInvoiceStatuses().map((value) => ({ label: value, value }))),
    [],
  );

  const filteredRows = useMemo(() => {
    const term = query.toLowerCase();
    return invoices.filter((row) => {
      const matchesQuery = [row.id, row.customer, row.status, row.destination, row.cycle]
        .join(" ")
        .toLowerCase()
        .includes(term);
      const matchesStatus = status === "all" ? true : row.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [invoices, query, status]);

  const columns = useMemo<ColumnDef<SalesInvoiceRecord>[]>(
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
      { accessorKey: "cycle", header: "Cycle" },
      { accessorKey: "dueDate", header: "Due" },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <InvoiceStatus status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <GuardedLink href={routes.sales.editInvoice(row.original.id)} requirement="write">
              <Button variant="text" className="h-auto p-0 text-primary">
                Edit
                <PiNotePencilBold className="ms-1 h-4 w-4" />
              </Button>
            </GuardedLink>
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

  const paid = invoices.filter((item) => item.status === "Paid").length;
  const pending = invoices.filter((item) => item.status === "Pending").length;
  const overdue = invoices.filter((item) => item.status === "Overdue").length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Invoices"]}
        eyebrow="Sales Kit"
        title="Invoice List"
        description="Manage settlement invoices, merchant release states, and finance follow-up for the vendors and customer orders affected by mobile payouts."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <GuardedLink href={routes.sales.createInvoice} requirement="write">
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                Add Invoice
              </Button>
            </GuardedLink>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Invoices" value={String(invoices.length).padStart(2, "0")} change="Finance" tone="neutral" detail="All active merchant settlement invoices in the current workspace." />
        <StatCard label="Paid" value={String(paid).padStart(2, "0")} change="Closed" tone="positive" detail="Invoices already reconciled and marked as settled." />
        <StatCard label="Pending" value={String(pending).padStart(2, "0")} change="Watch" tone="warning" detail="Invoices still waiting on merchant confirmation or finance release." />
        <StatCard label="Overdue" value={String(overdue).padStart(2, "0")} change="Follow-up" tone="neutral" detail="Invoices requiring finance outreach or compliance clearance." />
      </div>

      <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Input
            type="search"
            placeholder="Search by customer name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
            className="w-full max-w-md"
          />
          <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
            <div className="min-w-[220px]">
              <Select
                options={statusOptions}
                value={status}
                onChange={(option: any) => setStatus(option?.value ?? "all")}
                selectClassName="rounded-2xl"
              />
            </div>
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-2 text-primary">
              {filteredRows.length} results
            </Badge>
          </div>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <Table.Head key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Table.Head>
              ))}
            </Table.Row>
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

        <div className="mt-4 flex items-center justify-between">
          <Text className="text-sm text-gray-500">
            Showing {table.getRowModel().rows.length} of {filteredRows.length} invoices
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
