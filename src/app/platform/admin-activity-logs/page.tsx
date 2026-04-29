"use client";

import Link from "next/link";
import { Badge, Button, Text, Title } from "rizzui";
import DataTable from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";
import { routes } from "@/config/routes";

const insights = [
  { label: "Logged actions today", value: "1,284", detail: "Tracked admin events across the ERP." },
  { label: "Sensitive actions", value: "39", detail: "Permission edits, payouts, and restrictions." },
  { label: "Audit exceptions", value: "4", detail: "Activity trails needing follow-up." },
];

const queue = [
  {
    title: "Manual payout override",
    meta: "Treasury action needs secondary approval confirmation.",
    status: "review",
    links: [
      { label: "Payouts", href: routes.sales.payouts },
      { label: "Refunds", href: routes.sales.refunds },
    ],
  },
  {
    title: "Restriction history gap",
    meta: "Abuse-related action needs more context in the log.",
    status: "monitoring",
    links: [
      { label: "Escalations", href: routes.supportDesk.escalations },
      { label: "Safety compliance", href: routes.risk.compliance },
    ],
  },
  {
    title: "Bulk role change import",
    meta: "Bulk access-change set queued for signoff.",
    status: "queued",
    links: [
      { label: "Roles", href: routes.rolesPermissions },
      { label: "Admin users", href: routes.platform.adminUsers },
    ],
  },
];

const rows = [
  {
    primary: "Finance-sensitive actions",
    secondary: "Manual payment, payout, and refund interventions captured for treasury review.",
    tertiary: "Finance governance",
    status: "stable",
    href: routes.sales.payments,
  },
  {
    primary: "Trust and restriction logs",
    secondary: "Account blocks, appeals, and safety-related overrides requiring strong traceability.",
    tertiary: "Risk audit",
    status: "review",
    href: routes.supportDesk.escalations,
  },
  {
    primary: "Role and permission changes",
    secondary: "Administrative access edits tracked for security and compliance oversight.",
    tertiary: "IAM control",
    status: "monitoring",
    href: routes.rolesPermissions,
  },
  {
    primary: "Exception reconciliation",
    secondary: "Audit rows still queued for metadata completion or linked approval evidence.",
    tertiary: "Platform governance",
    status: "queued",
    href: routes.logistics.exceptions,
  },
];

export default function PlatformAdminActivityLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "Admin Activity Logs"]}
        eyebrow="Platform"
        title="Admin activity logs"
        description="Sensitive changes and audit activity."
        badge="Audit"
      />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <ShellCard title="Snapshot">
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{item.label}</Text>
                <Title as="h3" className="mt-3 text-2xl font-semibold">{item.value}</Title>
                <Text className="mt-1.5 text-xs leading-5 text-gray-500">{item.detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Action queue">
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.title} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-sm font-semibold">{item.title}</Title>
                    <Text className="mt-1 text-sm text-gray-500">{item.meta}</Text>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.links.map((link) => (
                        <Link key={link.label} href={link.href}>
                          <Button variant="outline" className="h-9 rounded-2xl px-3 text-xs">
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <ShellCard
        title="Working set"
        action={
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Audit
          </Badge>
        }
      >
        <DataTable
          rows={rows.map((row) => ({
            primary: (
              <div className="space-y-2">
                <Text className="font-semibold text-gray-900">{row.primary}</Text>
                <Link href={row.href} className="text-xs font-semibold text-primary transition hover:text-primary/80">
                  Open workflow
                </Link>
              </div>
            ),
            secondary: row.secondary,
            tertiary: row.tertiary,
            status: <StatusBadge status={row.status} />,
          }))}
          columns={[
            { key: "primary", label: "Name" },
            { key: "secondary", label: "Context" },
            { key: "tertiary", label: "Owner / Detail" },
            { key: "status", label: "Status", className: "md:justify-self-end" },
          ]}
        />
      </ShellCard>
    </div>
  );
}
