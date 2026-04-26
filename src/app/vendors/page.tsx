import SectionPage from "@/components/admin/section-page";
import { vendorRows } from "@/components/admin/section-data";

export default function VendorsPage() {
  return (
    <SectionPage
      eyebrow="Partners"
      title="Vendors and merchants"
      description="Use the partner area to manage onboarding quality, menu accuracy, stock reliability, and commercial health across vendors."
      badge="Partner ops"
      insights={[
        {
          label: "Live vendors",
          value: "182",
          detail: "Merchants currently enabled to receive customer demand.",
        },
        {
          label: "Under review",
          value: "9",
          detail: "Partners waiting on compliance, catalog, or commercial checks.",
        },
        {
          label: "Reject spikes",
          value: "6",
          detail: "Vendors with abnormal order failures or timeouts today.",
        },
      ]}
      queue={[
        {
          title: "License expiry warning",
          meta: "A regulated partner needs updated documents before remaining live.",
          status: "monitoring",
        },
        {
          title: "Order reject anomaly",
          meta: "One merchant is declining more baskets than their weekly baseline.",
          status: "at_risk",
        },
        {
          title: "Content refresh request",
          meta: "Menu media changes are ready but still waiting for publishing.",
          status: "review",
        },
      ]}
      rows={vendorRows}
    />
  );
}
