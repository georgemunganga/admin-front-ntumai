import CategoryEditPage from "@/components/marketplace/category-edit-page";

export default async function MarketplaceCategoryEditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryEditPage id={id} />;
}
