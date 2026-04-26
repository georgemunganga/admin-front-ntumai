import SectionPage from "@/components/admin/section-page";
import { platformRows } from "@/components/admin/section-data";

export default function PlatformPage() {
  return (
    <SectionPage
      eyebrow="Platform"
      title="Platform control"
      description="Coordinate reporting, content, release control, system health, and admin governance from the core platform layer."
      badge="Control"
      insights={[
        {
          label: "Critical health alerts",
          value: "5",
          detail: "Dependencies or jobs currently outside expected operating thresholds.",
        },
        {
          label: "Admins with elevated roles",
          value: "14",
          detail: "Staff accounts holding high-sensitivity permissions or approval rights.",
        },
        {
          label: "Pending release controls",
          value: "7",
          detail: "Version gates, feature toggles, or content pushes waiting for approval.",
        },
      ]}
      queue={[
        {
          title: "Gateway latency review",
          meta: "Payment and SMS dependencies are showing intermittent lag across two providers.",
          status: "monitoring",
        },
        {
          title: "Permission audit",
          meta: "Recent staff changes require a fresh review of admin access scopes.",
          status: "review",
        },
        {
          title: "Feature toggle rollout",
          meta: "A staged release is queued behind minimum-version validation for older clients.",
          status: "queued",
        },
      ]}
      rows={platformRows}
    />
  );
}
