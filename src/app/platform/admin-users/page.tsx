import SectionPage from "@/components/admin/section-page";

export default function PlatformAdminUsersPage() {
  return (
    <SectionPage
      eyebrow="Platform"
      title="Admin users and roles"
      description="Control staff accounts, role assignments, and privileged access across internal operations."
      badge="IAM"
      insights={[
        {
          label: "Admin accounts",
          value: "42",
          detail: "Internal users with access to one or more ERP modules or approvals.",
        },
        {
          label: "Elevated roles",
          value: "14",
          detail: "Users holding high-sensitivity permissions across finance, trust, or platform controls.",
        },
        {
          label: "Pending access changes",
          value: "6",
          detail: "Role grants or removals waiting on review after team or staffing changes.",
        },
      ]}
      queue={[
        {
          title: "Finance role review",
          meta: "Access scopes are being revalidated after recent team movement in settlement operations.",
          status: "review",
        },
        {
          title: "Temporary access expiry",
          meta: "Short-term elevated permissions are nearing their scheduled cutoff window.",
          status: "monitoring",
        },
        {
          title: "New city team onboarding",
          meta: "A batch of admin accounts is queued for role assignment and guardrail checks.",
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
