"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { supportDisputeRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function SupportDisputesPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Disputes"]}
        eyebrow="Support CRM"
        title="Disputes"
        description="Manage fare complaints, refund approvals, and rider-driver dispute workflows across commercial support."
        badge="Disputes"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Open disputes"
            value="31"
            change="Needs review"
            tone="warning"
            detail="Active disputes still awaiting evidence review, policy decisions, or financial action."
          />
          <StatCard
            label="Refund approvals"
            value="16"
            change="Finance pending"
            tone="neutral"
            detail="Commercial claims blocked behind payment validation or policy checks."
          />
          <StatCard
            label="Resolved today"
            value="22"
            change="+8 closed"
            tone="positive"
            detail="Disputes settled through service recovery, evidence review, or partial refund rules."
          />
        </div>

        <ShellCard
          title="Dispute lanes"
          description="Major commercial and service-recovery dispute flows."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Fare complaints", "Cases where charges or trip outcomes are being challenged"],
              ["Refund approval", "Claims requiring finance, policy, or support validation before release"],
              ["Driver-rider conflicts", "Disputes needing balanced evidence and rule interpretation"],
              ["Partial recovery", "Claims resolved through calibrated compensation instead of full refunds"],
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
          description="Disputes requiring commercial or policy guidance."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Fare recalculation batch", "Several customer claims need pricing and policy review before response", "review"],
              ["Refund release hold", "Finance approval is still missing on one dispute cluster", "monitoring"],
              ["Evidence backlog", "Driver-rider cases are queued behind incomplete proof collection", "queued"],
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
          title="Dispute working set"
          description="Current commercial dispute priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={supportDisputeRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Dispute lane" },
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
