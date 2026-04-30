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
import StatusBadge from "@/components/admin/status-badge";
import {
  listCategoryGroups,
  listCategoryStatuses,
  listMarketplaceCategories,
  type MarketplaceCategoryRecord,
} from "@/repositories/admin/categories";

export default function CategoriesListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [segment, setSegment] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const categories = useMemo(() => listMarketplaceCategories(), []);
  const statusOptions = useMemo(
    () => [{ label: "All statuses", value: "all" }].concat(listCategoryStatuses().map((value) => ({ label: value, value }))),
    [],
  );
  const segmentOptions = useMemo(
    () => [{ label: "All groups", value: "all" }].concat(listCategoryGroups().map((value) => ({ label: value, value }))),
    [],
  );

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return categories.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesSegment = segment === "all" ? true : row.group === segment;
      const haystack = [row.id, row.name, row.description, row.group, row.owner, row.status]
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesSegment && (!needle || haystack.includes(needle));
    });
  }, [categories, query, segment, status]);

  const columns = useMemo<ColumnDef<MarketplaceCategoryRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category",
        cell: ({ row }) => (
          <div>
            <Text className="font-semibold text-gray-900">{row.original.name}</Text>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      { accessorKey: "description", header: "Context" },
      { accessorKey: "group", header: "Group" },
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
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link href={`/marketplace/categories/${row.original.id}/edit`}>
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
        breadcrumb={["Home", "Marketplace", "Categories"]}
        eyebrow="Marketplace Kit"
        title="Categories"
        description="Manage category governance for vendor product creation and customer storefront discovery in the mobile marketplace."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Link href="/marketplace/categories/create">
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Category
              </Button>
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
          <Input
            type="search"
            placeholder="Search categories..."
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
          <Text className="text-sm text-gray-500">{filteredRows.length} categories</Text>
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            Catalog governed
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
            Showing {table.getRowModel().rows.length} of {filteredRows.length} categories
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
