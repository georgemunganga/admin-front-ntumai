"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { riskComplianceRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function RiskCompliancePage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Risk & safety"
        title="Safety and compliance"
        description="Oversee KYC, restricted categories, document governance, and regulatory preparation across the platform."
        badge="Compliance"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Compliance holds"
            value="26"
            change="Queue open"
            tone="warning"
            detail="Drivers, merchants, or products still blocked pending governance review."
          />
          <StatCard
            label="Expiring regulated docs"
            value="14"
            change="Watch window"
            tone="neutral"
            detail="Documents nearing deadlines in areas with stronger policy requirements."
          />
          <StatCard
            label="Audit packs prepared"
            value="5"
            change="Ready to share"
            tone="positive"
            detail="Reporting and evidence bundles currently assembled for internal or external review."
          />
        </div>

        <ShellCard
          title="Governance lanes"
          description="Main compliance and safety policy workflows."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["KYC reviews", "Identity, onboarding, and document verification across supply and merchants"],
              ["Restricted goods", "Category and listing blocks tied to regulated items"],
              ["Merchant governance", "Licenses, pharmacy controls, and partner-facing compliance checks"],
              ["Audit readiness", "Evidence preparation and reporting support for governance needs"],
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
          description="Compliance items needing operator follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["License expiry run", "Several regulated partners are entering the same renewal window", "monitoring"],
              ["Restricted listing review", "Blocked items still need compliance decisions before release", "review"],
              ["Audit evidence gap", "A reporting pack is queued behind missing regulatory attachments", "queued"],
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
          title="Compliance working set"
          description="Current regulatory and governance priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={riskComplianceRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Compliance lane" },
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
