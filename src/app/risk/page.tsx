import SectionPage from "@/components/admin/section-page";
import { riskRows } from "@/components/admin/section-data";

export default function RiskPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Risk"]}
      eyebrow="Risk & safety"
      title="Risk operations"
      description="Fraud, safety, abuse, and compliance."
      badge="Guardrails"
      insights={[
        {
          label: "Active fraud cases",
          value: "12",
          detail: "Fraud cases under investigation.",
        },
        {
          label: "Open SOS alerts",
          value: "3",
          detail: "Safety incidents still open.",
        },
        {
          label: "Compliance holds",
          value: "26",
          detail: "Accounts or categories blocked pending review.",
        },
      ]}
      queue={[
        {
          title: "GPS spoofing cluster",
          meta: "Suspicious movement pattern cluster.",
          status: "at_risk",
        },
        {
          title: "Restricted goods review",
          meta: "Restricted listings waiting on sign-off.",
          status: "review",
        },
        {
          title: "Emergency callback logs",
          meta: "Recent SOS cases need final notes.",
          status: "queued",
        },
      ]}
      rows={riskRows}
    />
  );
}
