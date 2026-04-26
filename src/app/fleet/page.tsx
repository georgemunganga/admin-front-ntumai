import SectionPage from "@/components/admin/section-page";
import { fleetRows } from "@/components/admin/section-data";

export default function FleetPage() {
  return (
    <SectionPage
      eyebrow="Operations"
      title="Fleet management"
      description="Manage supply onboarding, document readiness, vehicle health, and driver incentive operations."
      badge="Supply"
      insights={[
        {
          label: "Pending applications",
          value: "34",
          detail: "Applicants still moving through onboarding and verification steps.",
        },
        {
          label: "Docs expiring soon",
          value: "21",
          detail: "Licenses, insurance, or inspections due for action within the week.",
        },
        {
          label: "Active incentive cohorts",
          value: "6",
          detail: "Campaign groups currently targeted for supply growth and retention.",
        },
      ]}
      queue={[
        {
          title: "Inspection backlog",
          meta: "Vehicle clearance reviews are piling up ahead of the weekend demand wave.",
          status: "review",
        },
        {
          title: "Driver payout exception",
          meta: "A failed transfer batch needs finance confirmation before retrying.",
          status: "monitoring",
        },
        {
          title: "Document expiry sweep",
          meta: "Reminder jobs are queued for expiring licenses and insurance items.",
          status: "queued",
        },
      ]}
      rows={fleetRows}
    />
  );
}
