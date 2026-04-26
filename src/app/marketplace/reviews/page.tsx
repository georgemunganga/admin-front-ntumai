import MarketplaceEntityListPage from "@/components/marketplace/marketplace-entity-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function MarketplaceReviewsPage() {
  return (
    <MarketplaceEntityListPage
      eyebrow="Marketplace Kit"
      title="Reviews"
      description="Moderate customer feedback, track satisfaction trends, and escalate product quality signals."
      actionLabel="Open Review Lane"
      searchPlaceholder={crudPages.marketplaceReviews.searchPlaceholder}
      statusBadge="Quality monitored"
      countLabel="reviews"
      entityLabel="Review lane"
      rows={crudPages.marketplaceReviews.rows}
      stats={[
        { label: "Open moderation", value: "27", meta: "Feedback items waiting for quality or trust review" },
        { label: "Positive trend", value: "4.7", meta: "Average satisfaction across featured partners" },
        { label: "Escalated cases", value: "6", meta: "Disputed reviews still need operator decisions" },
        { label: "Resolved today", value: "18", meta: "Closed moderation actions across catalog teams" },
      ]}
    />
  );
}
