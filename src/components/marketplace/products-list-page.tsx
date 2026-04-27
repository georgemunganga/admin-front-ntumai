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
import { marketplaceProducts, type MarketplaceProduct } from "@/components/marketplace/product-data";

export default function ProductsListPage() {
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredProducts = useMemo(() => {
    const term = query.toLowerCase();
    return marketplaceProducts.filter((product) =>
      [product.id, product.name, product.category, product.vendor, product.status]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [query]);

  const columns = useMemo<ColumnDef<MarketplaceProduct>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div>
            <Link href={`/marketplace/products/${row.original.slug}`} className="font-semibold text-gray-900 hover:text-primary">
              {row.original.name}
            </Link>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "vendor", header: "Vendor" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "price", header: "Price" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <ProductStatus status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Link href={`/marketplace/products/${row.original.slug}/edit`}>
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
    data: filteredProducts,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products"]}
        eyebrow="Marketplace Kit"
        title="Products"
        description="Marketplace product catalog."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Product
            </Button>
          </div>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
            className="w-full max-w-md"
          />
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
            Catalog synced
          </Badge>
        </div>

        <div className="custom-scrollbar overflow-x-auto">
          <Table variant="modern" className="min-w-[900px]">
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
            Showing {table.getRowModel().rows.length} of {filteredProducts.length} products
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

function ProductStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    Published: "bg-emerald-50 text-emerald-700",
    "Low stock": "bg-amber-50 text-amber-700",
    Review: "bg-primary/10 text-primary",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.Review}`}>
      {status}
    </span>
  );
}
