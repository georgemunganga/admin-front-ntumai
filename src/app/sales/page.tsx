import SectionPage from "@/components/admin/section-page";
import { salesRows } from "@/components/admin/section-data";

export default function SalesPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Sales"]}
      eyebrow="Commerce"
      title="Sales and finance"
      description="Orders, payments, refunds, and payouts."
      badge="Finance"
      insights={[
        {
          label: "Gross processed today",
          value: "ZMW 486K",
          detail: "Payments, wallets, and billing volume.",
        },
        {
          label: "Pending refunds",
          value: "24",
          detail: "Claims still waiting on a decision.",
        },
        {
          label: "Payout batches",
          value: "7",
          detail: "Settlement runs waiting for release.",
        },
      ]}
      queue={[
        {
          title: "Chargeback review",
          meta: "Reversed payments waiting on validation.",
          status: "monitoring",
        },
        {
          title: "Merchant settlement hold",
          meta: "Settlement batch paused by reconciliation drift.",
          status: "review",
        },
        {
          title: "Refund auto-rule tuning",
          meta: "Refund rule update queued.",
          status: "queued",
        },
      ]}
      rows={salesRows}
    />
  );
}
