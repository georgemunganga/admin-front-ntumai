"use client";

import { notFound } from "next/navigation";
import ProductFormWorkspace from "@/components/marketplace/product-form-workspace";
import { getMarketplaceProductBySlug } from "@/repositories/admin/products";

export default function ProductEditPage({ slug }: { slug: string }) {
  const product = getMarketplaceProductBySlug(slug);
  if (!product) notFound();

  return <ProductFormWorkspace mode="edit" product={product} />;
}
