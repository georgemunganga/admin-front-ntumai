import SectionPage from "@/components/admin/section-page";
import { riskRows } from "@/components/admin/section-data";

export default function RiskPage() {
  return (
    <SectionPage
      eyebrow="Risk & safety"
      title="Risk operations"
      description="Review fraud, emergency incidents, abuse patterns, and compliance queues from a unified governance surface."
      badge="Guardrails"
      insights={[
        {
          label: "Active fraud cases",
          value: "12",
          detail: "Trip, payment, and promo-abuse patterns currently under investigation.",
        },
        {
          label: "Open SOS alerts",
          value: "3",
          detail: "Safety incidents still awaiting final operator closure or escalation.",
        },
        {
          label: "Compliance holds",
          value: "26",
          detail: "Drivers, merchants, or categories blocked pending governance review.",
        },
      ]}
      queue={[
        {
          title: "GPS spoofing cluster",
          meta: "A handful of driver accounts share suspicious movement patterns across the same corridor.",
          status: "at_risk",
        },
        {
          title: "Restricted goods review",
          meta: "Several pharmacy listings need compliance sign-off before going back live.",
          status: "review",
        },
        {
          title: "Emergency callback logs",
          meta: "Recent SOS cases need cleanup and final notes from the city team.",
          status: "queued",
        },
      ]}
      rows={riskRows}
    />
  );
}
