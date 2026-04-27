import ProductDetailPage from "@/components/marketplace/product-detail-page";

export default async function MarketplaceProductDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug} />;
}
