import SectionPage from "@/components/admin/section-page";
import { supportDeskRows } from "@/components/admin/section-data";

export default function SupportPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Support"]}
      eyebrow="Support CRM"
      title="Support operations"
      description="Tickets, disputes, escalations, and recovery."
      badge="Support"
      insights={[
        {
          label: "Open tickets",
          value: "143",
          detail: "Open customer, tasker, and merchant issues.",
        },
        {
          label: "Escalations active",
          value: "19",
          detail: "High-priority cases with specialist owners.",
        },
        {
          label: "SLA risk cases",
          value: "12",
          detail: "Tickets trending beyond SLA.",
        },
      ]}
      queue={[
        {
          title: "Billing complaint surge",
          meta: "Billing disputes rising after failed reversals.",
          status: "monitoring",
        },
        {
          title: "Courier abuse case review",
          meta: "Tasker and customer complaints escalated to trust.",
          status: "review",
        },
        {
          title: "Merchant SLA backlog",
          meta: "Partner support backlog after order disruptions.",
          status: "queued",
        },
      ]}
      rows={supportDeskRows}
    />
  );
}
