import SectionPage from "@/components/admin/section-page";
import { dispatchRows } from "@/components/admin/section-data";

export default function DispatchPage() {
  return (
    <SectionPage
      eyebrow="Operations"
      title="Dispatch control center"
      description="Supervise live bookings, scheduling pressure, and manual intervention lanes from a single dispatch surface."
      badge="Live ops"
      insights={[
        {
          label: "Trips awaiting assignment",
          value: "29",
          detail: "Bookings still outside the normal auto-match window.",
        },
        {
          label: "Drivers in reserve",
          value: "18",
          detail: "Online supply available for manual rebalancing or surge response.",
        },
        {
          label: "Manual overrides",
          value: "11",
          detail: "Trips reassigned, reprioritized, or force-handled by operators today.",
        },
      ]}
      queue={[
        {
          title: "Airport pickup surge",
          meta: "Demand is outpacing the scheduled driver pool for the next 45 minutes.",
          status: "monitoring",
        },
        {
          title: "Corporate bookings reassignment",
          meta: "Three advance trips need manual review after driver cancellations.",
          status: "review",
        },
        {
          title: "CBD heatmap response",
          meta: "Low supply zone may require dispatch intervention and driver nudging.",
          status: "queued",
        },
      ]}
      rows={dispatchRows}
    />
  );
}
