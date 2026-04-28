import VendorEditPage from "@/components/marketplace/vendor-edit-page";

export default async function MarketplaceVendorEditRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <VendorEditPage slug={slug} />;
}
