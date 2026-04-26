import SectionPage from "@/components/admin/section-page";
import { driverRows } from "@/components/admin/section-data";

export default function DriversPage() {
  return (
    <SectionPage
      eyebrow="Fleet"
      title="Drivers and field quality"
      description="Shape the courier management area around onboarding, quality control, performance, and exception handling before wiring live actions."
      badge="Mobility"
      insights={[
        {
          label: "Online now",
          value: "326",
          detail: "Couriers currently available to receive or accept assignments.",
        },
        {
          label: "New applicants",
          value: "24",
          detail: "Driver profiles entering the onboarding funnel this week.",
        },
        {
          label: "Quality flags",
          value: "13",
          detail: "Accounts requiring review due to behavior, disputes, or fraud signals.",
        },
      ]}
      queue={[
        {
          title: "Document review lane",
          meta: "Several applicants are blocked on missing or blurry documents.",
          status: "review",
        },
        {
          title: "Battery drain anomaly",
          meta: "Drivers in one zone are dropping offline faster than expected.",
          status: "monitoring",
        },
        {
          title: "Suspension backlog",
          meta: "Risk decisions need final admin confirmation before actioning.",
          status: "queued",
        },
      ]}
      rows={driverRows}
    />
  );
}
