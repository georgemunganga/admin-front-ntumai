import SectionPage from "@/components/admin/section-page";
import { settingsRows } from "@/components/admin/section-data";

export default function SettingsPage() {
  return (
    <SectionPage
      eyebrow="Control"
      title="Platform settings"
      description="Use this area for policy, role, fee, and configuration surfaces that shape how the wider admin product behaves."
      badge="System"
      insights={[
        {
          label: "Policy changes",
          value: "6",
          detail: "Pending configuration or permissions updates not yet rolled out.",
        },
        {
          label: "Zones prepared",
          value: "2",
          detail: "Expansion-ready operating areas waiting on final enablement.",
        },
        {
          label: "Security tasks",
          value: "5",
          detail: "Access, roles, or audit items that still need administrative cleanup.",
        },
      ]}
      queue={[
        {
          title: "Commission rollout",
          meta: "Updated fee rules are drafted but not yet approved for production.",
          status: "review",
        },
        {
          title: "Role cleanup",
          meta: "Admin permission scope needs tightening across support and ops groups.",
          status: "monitoring",
        },
        {
          title: "Zone launch checklist",
          meta: "Two suburbs are prepared but still waiting for final operational sign-off.",
          status: "queued",
        },
      ]}
      rows={settingsRows}
    />
  );
}
