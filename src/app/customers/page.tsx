import SectionPage from "@/components/admin/section-page";
import { customerRows } from "@/components/admin/section-data";

export default function CustomersPage() {
  return (
    <SectionPage
      eyebrow="People"
      title="Customers and trust"
      description="Frame the customer workspace around retention, verification, refunds, and service recovery without committing to final data models yet."
      badge="Retention"
      insights={[
        {
          label: "Active users",
          value: "24.8k",
          detail: "Customers who have engaged with the app during the current cycle.",
        },
        {
          label: "KYC cases",
          value: "31",
          detail: "Accounts needing manual document review or follow-up checks.",
        },
        {
          label: "Refund exposure",
          value: "ZMW 18.4k",
          detail: "Open refund value still moving through support or finance.",
        },
      ]}
      queue={[
        {
          title: "Refund callback queue",
          meta: "Customers are waiting longer than target on disputed wallet refunds.",
          status: "at_risk",
        },
        {
          title: "High-value churn watch",
          meta: "Repeat buyers have gone quiet after two delayed deliveries.",
          status: "monitoring",
        },
        {
          title: "Manual identity review",
          meta: "KYC items were submitted but still need trust-team approval.",
          status: "review",
        },
      ]}
      rows={customerRows}
    />
  );
}
