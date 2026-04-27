import SectionPage from "@/components/admin/section-page";
import { marketplaceRows } from "@/components/admin/section-data";

export default function MarketplacePage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Marketplace"]}
      eyebrow="Commerce"
      title="Marketplace operations"
      description="Manage vendors, product quality, category structure, and marketplace performance from one merchandising surface."
      badge="Catalog"
      insights={[
        {
          label: "Active products",
          value: "2,148",
          detail: "Listings currently available across grocery, pharmacy, food, and retail lanes.",
        },
        {
          label: "Live vendors",
          value: "84",
          detail: "Merchants and partners with active inventory and order-taking enabled.",
        },
        {
          label: "Content edits pending",
          value: "37",
          detail: "Catalog, imagery, and category changes waiting for merchandising approval.",
        },
      ]}
      queue={[
        {
          title: "Vendor activation checks",
          meta: "New merchant accounts need final review before their inventory goes live.",
          status: "review",
        },
        {
          title: "Category cleanup sprint",
          meta: "A batch of products is misfiled and affecting discovery and delivery routing.",
          status: "monitoring",
        },
        {
          title: "Review moderation queue",
          meta: "Fresh product and vendor feedback is waiting for quality and trust evaluation.",
          status: "queued",
        },
      ]}
      rows={marketplaceRows}
    />
  );
}
