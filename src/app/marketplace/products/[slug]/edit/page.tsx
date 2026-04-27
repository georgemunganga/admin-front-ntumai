import ProductEditPage from "@/components/marketplace/product-edit-page";

export default async function MarketplaceProductEditRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductEditPage slug={slug} />;
}
