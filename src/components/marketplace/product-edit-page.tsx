"use client";

import { notFound } from "next/navigation";
import ProductFormWorkspace from "@/components/marketplace/product-form-workspace";
import {
  getMarketplaceProductBySlug,
  useAdminProductDetail,
} from "@/repositories/admin/products";

export default function ProductEditPage({ slug }: { slug: string }) {
  const fallback = getMarketplaceProductBySlug(slug);
  const { data: product, isLoading, error } = useAdminProductDetail(slug);
  const resolved = product ?? fallback;
  if (!resolved && !isLoading) notFound();

  if (!resolved) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      <ProductFormWorkspace mode="edit" product={resolved} />
    </>
  );
}
