import SectionPage from "@/components/admin/section-page";
import { platformRows } from "@/components/admin/section-data";

export default function PlatformPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform"]}
      eyebrow="Platform"
      title="Platform control"
      description="Reporting, releases, content, and admin control."
      badge="Control"
      insights={[
        {
          label: "Critical health alerts",
          value: "5",
          detail: "Dependencies or jobs outside expected thresholds.",
        },
        {
          label: "Admins with elevated roles",
          value: "14",
          detail: "Staff accounts with elevated access.",
        },
        {
          label: "Pending release controls",
          value: "7",
          detail: "Version gates or rollouts waiting on approval.",
        },
      ]}
      queue={[
        {
          title: "Gateway latency review",
          meta: "Payment and SMS lag across two providers.",
          status: "monitoring",
        },
        {
          title: "Permission audit",
          meta: "Recent staff changes need access review.",
          status: "review",
        },
        {
          title: "Feature toggle rollout",
          meta: "Staged rollout queued behind version checks.",
          status: "queued",
        },
      ]}
      rows={platformRows}
    />
  );
}
