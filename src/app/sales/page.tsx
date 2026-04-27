import SectionPage from "@/components/admin/section-page";
import { salesRows } from "@/components/admin/section-data";

export default function SalesPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Sales"]}
      eyebrow="Commerce"
      title="Sales and finance"
      description="Track orders, payments, refunds, invoices, and payout operations from the commercial control layer."
      badge="Finance"
      insights={[
        {
          label: "Gross processed today",
          value: "ZMW 486K",
          detail: "Combined rider payments, wallet usage, and business-account billing volume.",
        },
        {
          label: "Pending refunds",
          value: "24",
          detail: "Claims still awaiting approval, payment confirmation, or support closure.",
        },
        {
          label: "Payout batches",
          value: "7",
          detail: "Settlement runs prepared for drivers, vendors, and corporate reconciliation flows.",
        },
      ]}
      queue={[
        {
          title: "Chargeback review",
          meta: "Several failed or reversed rider payments need finance validation before account action.",
          status: "monitoring",
        },
        {
          title: "Merchant settlement hold",
          meta: "A payout batch is paused because invoice and return totals do not reconcile cleanly.",
          status: "review",
        },
        {
          title: "Refund auto-rule tuning",
          meta: "A policy update is queued for partial refund thresholds on cancelled trips and orders.",
          status: "queued",
        },
      ]}
      rows={salesRows}
    />
  );
}
