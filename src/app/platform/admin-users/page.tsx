import SectionPage from "@/components/admin/section-page";

export default function PlatformAdminUsersPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform", "Admin Users & Roles"]}
      eyebrow="Platform"
      title="Admin users and roles"
      description="Staff accounts, roles, and privileged access."
      badge="IAM"
      insights={[
        {
          label: "Admin accounts",
          value: "42",
          detail: "Internal users with ERP access.",
        },
        {
          label: "Elevated roles",
          value: "14",
          detail: "Users with high-sensitivity permissions.",
        },
        {
          label: "Pending access changes",
          value: "6",
          detail: "Role changes waiting on review.",
        },
      ]}
      queue={[
        {
          title: "Finance role review",
          meta: "Access scopes being revalidated after team changes.",
          status: "review",
        },
        {
          title: "Temporary access expiry",
          meta: "Temporary elevated permissions nearing expiry.",
          status: "monitoring",
        },
        {
          title: "New city team onboarding",
          meta: "Admin accounts queued for role assignment.",
          status: "queued",
        },
      ]}
      rows={[
        {
          primary: "Operations admin roles",
          secondary: "Day-to-day staff accounts assigned to dispatch, fleet, support, and CRM lanes.",
          tertiary: "People ops",
          status: "stable",
        },
        {
          primary: "Privileged finance access",
          secondary: "High-sensitivity roles covering payments, payouts, and reconciliation controls.",
          tertiary: "Security review",
          status: "review",
        },
        {
          primary: "Temporary escalations",
          secondary: "Time-bound permissions granted for investigations, incidents, or launches.",
          tertiary: "Access governance",
          status: "monitoring",
        },
        {
          primary: "Pending account setup",
          secondary: "New staff records still queued for role mapping and audit confirmation.",
          tertiary: "Admin onboarding",
          status: "queued",
        },
      ]}
    />
  );
}
