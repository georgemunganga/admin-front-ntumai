import SectionPage from "@/components/admin/section-page";

export default function PlatformAdminActivityLogsPage() {
  return (
    <SectionPage
      breadcrumb={["Home", "Platform", "Admin Activity Logs"]}
      eyebrow="Platform"
      title="Admin activity logs"
      description="Sensitive changes and audit activity."
      badge="Audit"
      insights={[
        {
          label: "Logged actions today",
          value: "1,284",
          detail: "Tracked admin events across the ERP.",
        },
        {
          label: "Sensitive actions",
          value: "39",
          detail: "Permission edits, payouts, and restrictions.",
        },
        {
          label: "Audit exceptions",
          value: "4",
          detail: "Activity trails needing follow-up.",
        },
      ]}
      queue={[
        {
          title: "Manual payout override",
          meta: "Treasury action needs secondary approval confirmation.",
          status: "review",
        },
        {
          title: "Restriction history gap",
          meta: "Abuse-related action needs more context in the log.",
          status: "monitoring",
        },
        {
          title: "Bulk role change import",
          meta: "Bulk access-change set queued for signoff.",
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
