import MarketplaceEntityListPage from "@/components/marketplace/marketplace-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function MarketplaceVendorsPage() {
  return (
    <MarketplaceEntityListPage
      eyebrow="Marketplace Kit"
      title="Vendors"
      description="Manage marketplace partners, launch readiness, and service quality from one merchant list."
      actionLabel="Add Vendor"
      searchPlaceholder={crudPages.marketplaceVendors.searchPlaceholder}
      statusBadge="Partner monitored"
      countLabel="vendors"
      entityLabel="Vendor"
      rows={crudPages.marketplaceVendors.rows}
      stats={[
        { label: "Active vendors", value: "148", meta: "12 awaiting launch approval" },
        { label: "At-risk partners", value: "9", meta: "Quality or compliance follow-up open" },
        { label: "Healthy fulfillment", value: "92%", meta: "Partner-side acceptance remains stable" },
        { label: "Support-heavy vendors", value: "14", meta: "Merchant ticket volume above baseline" },
      ]}
    />
  );
}
