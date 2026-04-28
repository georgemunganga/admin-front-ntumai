import VendorDetailPage from "@/components/marketplace/vendor-detail-page";

export default async function MarketplaceVendorDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <VendorDetailPage slug={slug} />;
}
