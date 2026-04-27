import SectionPage from "@/components/admin/section-page";
import { crmRows } from "@/components/admin/section-data";

export default function CrmPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "CRM"]}
      eyebrow="Customer CRM"
      title="Customer relationship desk"
      description="Customers, wallets, and B2B accounts."
      badge="CRM"
      insights={[
        {
          label: "VIP riders at risk",
          value: "47",
          detail: "High-value users showing churn or complaint risk.",
        },
        {
          label: "Corporate accounts",
          value: "19",
          detail: "Business clients on billing controls.",
        },
        {
          label: "Wallet adjustments",
          value: "13",
          detail: "Balance changes waiting on review.",
        },
      ]}
      queue={[
        {
          title: "Retention callback list",
          meta: "Top-value riders with churn signals.",
          status: "monitoring",
        },
        {
          title: "Corporate invoice dispute",
          meta: "Department billing dispute on a monthly invoice.",
          status: "review",
        },
        {
          title: "Wallet freeze appeal",
          meta: "Frozen wallet appeal awaiting review.",
          status: "queued",
        },
      ]}
      rows={crmRows}
    />
  );
}
