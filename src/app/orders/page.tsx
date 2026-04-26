import SectionPage from "@/components/admin/section-page";
import { orderRows } from "@/components/admin/section-data";

export default function OrdersPage() {
  return (
    <SectionPage
      eyebrow="Operations"
      title="Orders control"
      description="Shape the order desk around live demand, payment confidence, and handoff quality before we connect real CRUD data."
      badge="Core workflow"
      insights={[
        {
          label: "Live baskets",
          value: "214",
          detail: "Orders still moving through placement, acceptance, or packing.",
        },
        {
          label: "Failed payments",
          value: "17",
          detail: "Transactions needing a retry path, recovery flow, or manual review.",
        },
        {
          label: "Manual interventions",
          value: "29",
          detail: "Orders requiring admin edits due to stock, fees, or fulfillment gaps.",
        },
      ]}
      queue={[
        {
          title: "Card settlement mismatch",
          meta: "Four orders paid but not yet released to fulfillment.",
          status: "review",
        },
        {
          title: "Checkout friction spike",
          meta: "Guest users in one zone are dropping on address confirmation.",
          status: "monitoring",
        },
        {
          title: "Corporate order hold",
          meta: "Bulk office request waiting for pricing override approval.",
          status: "queued",
        },
      ]}
      rows={orderRows}
    />
  );
}
