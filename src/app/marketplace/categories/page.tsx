import MarketplaceEntityListPage from "@/components/marketplace/marketplace-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function MarketplaceCategoriesPage() {
  return (
    <MarketplaceEntityListPage
      breadcrumb={["Home", "Marketplace", "Categories"]}
      eyebrow="Marketplace Kit"
      title="Categories"
      description="Control browse structure, merchandising hygiene, and policy-sensitive catalog groupings."
      actionLabel="Add Category"
      searchPlaceholder={crudPages.marketplaceCategories.searchPlaceholder}
      statusBadge="Catalog governed"
      countLabel="categories"
      entityLabel="Category"
      rows={crudPages.marketplaceCategories.rows}
      stats={[
        { label: "Live categories", value: "36", meta: "6 seasonal collections active now" },
        { label: "Pending cleanup", value: "11", meta: "Misclassification fixes still queued" },
        { label: "Restricted lanes", value: "4", meta: "Higher-governance categories under review" },
        { label: "Promo-ready groups", value: "8", meta: "Merchandising sets prepared for campaigns" },
      ]}
    />
  );
}
