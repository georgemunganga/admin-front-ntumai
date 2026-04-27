import SectionPage from "@/components/admin/section-page";

export default function CrmBlockedUsersPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "CRM", "Blocked Users"]}
      eyebrow="Customer CRM"
      title="Blocked users"
      description="Manage suspensions, abuse-linked restrictions, and appeal handling across customers and supply accounts."
      badge="Trust"
      insights={[
        {
          label: "Restricted accounts",
          value: "27",
          detail: "Users currently blocked, suspended, or partially limited pending review.",
        },
        {
          label: "Open appeals",
          value: "8",
          detail: "Restriction challenges needing trust-team disposition before reinstatement.",
        },
        {
          label: "Repeat abuse links",
          value: "5",
          detail: "Multi-account or recurrent misuse patterns still under investigation.",
        },
      ]}
      queue={[
        {
          title: "Chargeback abuse review",
          meta: "Several suspended accounts remain on hold after repeated payment disputes.",
          status: "monitoring",
        },
        {
          title: "Appeal evidence pack",
          meta: "A batch of restricted users is waiting for final review against support history.",
          status: "review",
        },
        {
          title: "Device-link enforcement",
          meta: "Linked-account restrictions are queued behind broader trust validation.",
          status: "queued",
        },
      ]}
      rows={[
        {
          primary: "Suspended rider accounts",
          secondary: "Customers restricted after abuse, fraud, or severe service-policy breaches.",
          tertiary: "Trust operations",
          status: "monitoring",
        },
        {
          primary: "Appeal-ready restrictions",
          secondary: "Accounts with enough evidence gathered for reinstatement or permanent action.",
          tertiary: "Case review",
          status: "review",
        },
        {
          primary: "Linked-account blocks",
          secondary: "Restrictions tied to repeated identities, devices, or suspicious payment behavior.",
          tertiary: "Fraud desk",
          status: "stable",
        },
        {
          primary: "Pending disposition holds",
          secondary: "Users still queued for a final trust-team decision before status changes.",
          tertiary: "Governance",
          status: "queued",
        },
      ]}
    />
  );
}
