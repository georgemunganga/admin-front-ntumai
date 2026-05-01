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
import StatCard from "@/components/admin/stat-card";
import GuardedLink from "@/components/auth/guarded-link";
import { routes } from "@/config/routes";
import {
  listMarketplaceProducts,
  listProductStatuses,
  type MarketplaceProductRecord,
} from "@/repositories/admin/products";

export default function ProductsListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });
  const products = useMemo(() => listMarketplaceProducts(), []);
  const statusOptions = useMemo(
    () => [{ label: "All statuses", value: "all" }].concat(listProductStatuses().map((value) => ({ label: value, value }))),
    [],
  );

  const filteredProducts = useMemo(() => {
    const term = query.toLowerCase();
    return products.filter((product) => {
      const matchesQuery = [product.id, product.name, product.category, product.vendor, product.status]
        .join(" ")
        .toLowerCase()
        .includes(term);
      const matchesStatus = status === "all" ? true : product.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, status]);

  const columns = useMemo<ColumnDef<MarketplaceProductRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="space-y-1">
            <Link href={routes.marketplace.productDetails(row.original.slug)} className="font-semibold text-gray-900 hover:text-primary">
              {row.original.name}
            </Link>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">{row.original.category}</Text>
            <Text className="text-xs text-gray-500">{row.original.subcategory}</Text>
          </div>
        ),
      },
      {
        accessorKey: "vendor",
        header: "Vendor",
      },
      {
        accessorKey: "stock",
        header: "Inventory",
        cell: ({ row }) => (
          <div>
            <Text className="font-medium text-gray-900">{row.original.stock}</Text>
            <Text className="text-xs text-gray-500">{row.original.fulfillment}</Text>
          </div>
        ),
      },
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
            <GuardedLink href={routes.marketplace.editProduct(row.original.slug)} requirement="write">
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
    data: filteredProducts,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const publishedCount = products.filter((item) => item.status === "Published").length;
  const reviewCount = products.filter((item) => item.status === "Review").length;
  const lowStockCount = products.filter((item) => item.status === "Low stock").length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Marketplace", "Products"]}
        eyebrow="Marketplace Kit"
        title="Products"
        description="Track catalog readiness, storefront visibility, and vendor merchandising across all marketplace items."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-[17px] w-[17px]" />
              Export
            </Button>
            <GuardedLink href={routes.marketplace.createProduct} requirement="write">
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                Add Product
              </Button>
            </GuardedLink>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Catalog items"
          value={String(products.length).padStart(2, "0")}
          change="Catalog ops"
          tone="neutral"
          detail="All products currently affecting vendor listing flows and customer storefront discovery."
        />
        <StatCard
          label="Published"
          value={String(publishedCount).padStart(2, "0")}
          change="Live"
          tone="positive"
          detail="Products already visible to customers in the mobile app."
        />
        <StatCard
          label="Low stock"
          value={String(lowStockCount).padStart(2, "0")}
          change="Watch"
          tone="warning"
          detail="Catalog items likely to trigger vendor or restock follow-up."
        />
        <StatCard
          label="Review hold"
          value={String(reviewCount).padStart(2, "0")}
          change="Ops"
          tone="neutral"
          detail="Products blocked behind QA or compliance review before release."
        />
      </div>

      <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]">
        <div className="mb-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px_auto]">
          <Input
            type="search"
            placeholder="Search by product name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            inputClassName="h-10"
          />
          <Select
            options={statusOptions}
            value={status}
            onChange={(option: any) => setStatus(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
          <div className="flex items-center justify-end">
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-2 text-primary">
              {filteredProducts.length} results
            </Badge>
          </div>
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
                    <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
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
