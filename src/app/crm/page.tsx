import SectionPage from "@/components/admin/section-page";
import { crmRows } from "@/components/admin/section-data";

export default function CrmPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "CRM"]}
      eyebrow="Customer CRM"
      title="Customer relationship desk"
      description="Work across rider accounts, corporate billing, wallets, and trust-sensitive customer issues."
      badge="CRM"
      insights={[
        {
          label: "VIP riders at risk",
          value: "47",
          detail: "High-value users showing lower booking activity or repeated complaints.",
        },
        {
          label: "Corporate accounts",
          value: "19",
          detail: "Business clients with active monthly billing and ride controls.",
        },
        {
          label: "Wallet adjustments",
          value: "13",
          detail: "Customer balance changes waiting for finance or support confirmation.",
        },
      ]}
      queue={[
        {
          title: "Retention callback list",
          meta: "Top-value riders with recent churn signals need outreach or offers.",
          status: "monitoring",
        },
        {
          title: "Corporate invoice dispute",
          meta: "A business account has challenged departmental trip allocation on the monthly bill.",
          status: "review",
        },
        {
          title: "Wallet freeze appeal",
          meta: "A flagged customer account needs trust-team review before reactivation.",
          status: "queued",
        },
      ]}
      rows={crmRows}
    />
  );
}
