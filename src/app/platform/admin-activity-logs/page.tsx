import SectionPage from "@/components/admin/section-page";

export default function PlatformAdminActivityLogsPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform", "Admin Activity Logs"]}
      eyebrow="Platform"
      title="Admin activity logs"
      description="Review sensitive changes, operational overrides, and governance-critical actions across the admin surface."
      badge="Audit"
      insights={[
        {
          label: "Logged actions today",
          value: "1,284",
          detail: "Tracked admin events spanning support, finance, trust, and platform workflows.",
        },
        {
          label: "Sensitive actions",
          value: "39",
          detail: "Permission edits, manual payouts, and account restrictions needing closer governance visibility.",
        },
        {
          label: "Audit exceptions",
          value: "4",
          detail: "Activity trails requiring follow-up after unexpected or incomplete metadata capture.",
        },
      ]}
      queue={[
        {
          title: "Manual payout override",
          meta: "A recent treasury action needs secondary approval confirmation in the audit trail.",
          status: "review",
        },
        {
          title: "Restriction history gap",
          meta: "One abuse-related account action needs supporting context added to the log record.",
          status: "monitoring",
        },
        {
          title: "Bulk role change import",
          meta: "A larger access-change set is queued for governance reconciliation and signoff.",
          status: "queued",
        },
      ]}
      rows={[
        {
          primary: "Finance-sensitive actions",
          secondary: "Manual payment, payout, and refund interventions captured for treasury review.",
          tertiary: "Finance governance",
          status: "stable",
        },
        {
          primary: "Trust and restriction logs",
          secondary: "Account blocks, appeals, and safety-related overrides requiring strong traceability.",
          tertiary: "Risk audit",
          status: "review",
        },
        {
          primary: "Role and permission changes",
          secondary: "Administrative access edits tracked for security and compliance oversight.",
          tertiary: "IAM control",
          status: "monitoring",
        },
        {
          primary: "Exception reconciliation",
          secondary: "Audit rows still queued for metadata completion or linked approval evidence.",
          tertiary: "Platform governance",
          status: "queued",
        },
      ]}
    />
  );
}
