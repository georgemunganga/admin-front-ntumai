import SectionPage from "@/components/admin/section-page";
import { supportDeskRows } from "@/components/admin/section-data";

export default function SupportPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Support"]}
      eyebrow="Support CRM"
      title="Support operations"
      description="Manage ticket intake, dispute handling, escalations, and service recovery workflows across the platform."
      badge="Support"
      insights={[
        {
          label: "Open tickets",
          value: "143",
          detail: "Customer, driver, and merchant issues still awaiting first action or final closure.",
        },
        {
          label: "Escalations active",
          value: "19",
          detail: "High-priority cases currently owned by senior support or operations teams.",
        },
        {
          label: "SLA risk cases",
          value: "12",
          detail: "Tickets trending beyond target response or resolution windows.",
        },
      ]}
      queue={[
        {
          title: "Billing complaint surge",
          meta: "Support and finance are seeing a spike in rider disputes tied to failed reversals.",
          status: "monitoring",
        },
        {
          title: "Courier abuse case review",
          meta: "A set of driver and customer complaints has been escalated for trust-team input.",
          status: "review",
        },
        {
          title: "Merchant SLA backlog",
          meta: "Partner support cases are stacking up after lunch-hour order disruptions.",
          status: "queued",
        },
      ]}
      rows={supportDeskRows}
    />
  );
}
