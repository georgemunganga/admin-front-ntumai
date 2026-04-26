import SectionPage from "@/components/admin/section-page";
import { supportRows } from "@/components/admin/section-data";

export default function SupportPage() {
  return (
    <SectionPage
      eyebrow="Care"
      title="Support and resolutions"
      description="Organize the admin support area around complaint clusters, financial disputes, callbacks, and merchant assistance."
      badge="Service desk"
      insights={[
        {
          label: "Open tickets",
          value: "41",
          detail: "Customer or merchant issues still pending a first or final action.",
        },
        {
          label: "First response",
          value: "7m",
          detail: "Current average time before a live issue receives human attention.",
        },
        {
          label: "Escalations",
          value: "11",
          detail: "Cases already moved beyond standard support handling.",
        },
      ]}
      queue={[
        {
          title: "Wallet dispute approvals",
          meta: "Finance sign-off is still required on a small batch of reversals.",
          status: "review",
        },
        {
          title: "Late delivery cluster",
          meta: "Several complaints trace back to the same dispatch bottleneck.",
          status: "monitoring",
        },
        {
          title: "Callback queue",
          meta: "Resolved tickets still needing customer confirmation before closure.",
          status: "queued",
        },
      ]}
      rows={supportRows}
    />
  );
}
