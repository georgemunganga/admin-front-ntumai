import SectionPage from "@/components/admin/section-page";
import { deliveryRows } from "@/components/admin/section-data";

export default function DeliveriesPage() {
  return (
    <SectionPage
      eyebrow="Dispatch"
      title="Delivery network"
      description="Design the dispatch workspace around route pressure, courier availability, and zone health so delivery operations stay visible."
      badge="Realtime lane"
      insights={[
        {
          label: "Routes live",
          value: "63",
          detail: "Active route groups being served across the main operating zones.",
        },
        {
          label: "Delayed stops",
          value: "38",
          detail: "Deliveries already outside their normal ETA window.",
        },
        {
          label: "Spare capacity",
          value: "11%",
          detail: "Network headroom available before dispatch starts to queue.",
        },
      ]}
      queue={[
        {
          title: "Woodlands cluster slipping",
          meta: "Current courier availability is below the afternoon threshold.",
          status: "at_risk",
        },
        {
          title: "Airport corridor reroute",
          meta: "Traffic pattern changed after roadworks alert.",
          status: "monitoring",
        },
        {
          title: "Night shift slotting",
          meta: "Reserve courier pool still not assigned to preferred zones.",
          status: "queued",
        },
      ]}
      rows={deliveryRows}
    />
  );
}
