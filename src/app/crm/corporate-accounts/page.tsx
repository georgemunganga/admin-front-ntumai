"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { crmCorporateRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function CrmCorporateAccountsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Customer CRM"
        title="Corporate accounts"
        description="Manage business clients, team allocations, spend controls, and monthly billing exceptions."
        badge="B2B"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active companies"
            value="19"
            change="+2 onboarding"
            tone="positive"
            detail="Business clients currently using billing, employee, or policy controls."
          />
          <StatCard
            label="Billing exceptions"
            value="7"
            change="Needs finance"
            tone="warning"
            detail="Company accounts with invoice, policy, or reconciliation issues needing manual review."
          />
          <StatCard
            label="Policy requests"
            value="11"
            change="Queue open"
            tone="neutral"
            detail="Client asks for changes to spend limits, departments, or ride permissions."
          />
        </div>

        <ShellCard
          title="B2B operations"
          description="Major control lanes for company accounts."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Billing and invoicing", "Monthly statements, reconciliation, and collection support"],
              ["Policy controls", "Spend caps, travel rules, and departmental ride limits"],
              ["Onboarding", "New company setup, employee import, and role configuration"],
              ["Account health", "Client exceptions, escalation handling, and service recovery"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Attention queue"
          description="B2B issues needing account or finance follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Invoice dispute review", "A major client is challenging employee trip allocation on the latest bill", "review"],
              ["Usage cap breach", "One account exceeded agreed department limits in the last cycle", "monitoring"],
              ["Policy change batch", "Multiple clients need updated travel rules before month-end", "queued"],
            ].map(([title, meta, status]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{title}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{meta}</Text>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Corporate working set"
          description="Current business-account priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={crmCorporateRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "B2B lane" },
              { key: "secondary", label: "Context" },
              { key: "tertiary", label: "Owner" },
              { key: "status", label: "Status", className: "md:justify-self-end" },
            ]}
          />
        </ShellCard>
      </div>
    </div>
  );
}
