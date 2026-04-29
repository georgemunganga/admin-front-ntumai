"use client";

import { notFound } from "next/navigation";
import ProductFormWorkspace from "@/components/marketplace/product-form-workspace";
import { getMarketplaceProduct } from "@/components/marketplace/product-data";

export default function ProductEditPage({ slug }: { slug: string }) {
  const product = getMarketplaceProduct(slug);
  if (!product) notFound();

  return <ProductFormWorkspace mode="edit" product={product} />;
}
