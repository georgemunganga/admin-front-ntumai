"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { crmRiderRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function CrmRidersPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Customer CRM"
        title="Riders"
        description="Track rider account health, service recovery trends, and lifecycle interventions across the customer base."
        badge="Customers"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active rider cohort"
            value="18.4K"
            change="+6.2%"
            tone="positive"
            detail="Customers booking or engaging inside the current operating window."
          />
          <StatCard
            label="VIP at-risk users"
            value="47"
            change="Need outreach"
            tone="warning"
            detail="High-value riders showing churn signals or repeated service friction."
          />
          <StatCard
            label="Flagged profiles"
            value="13"
            change="Trust review"
            tone="neutral"
            detail="Customer accounts under extra checks before standard support or promotion treatment."
          />
        </div>

        <ShellCard
          title="Customer lanes"
          description="High-signal rider groups tracked by CRM and service teams."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["VIP retention", "High-frequency or high-value riders needing proactive attention"],
              ["Service recovery", "Accounts tied to refunds, complaints, or delayed resolution flows"],
              ["Lifecycle targeting", "Customer groups selected for win-back or engagement campaigns"],
              ["Trust monitoring", "Profiles under fraud, abuse, or escalation review"],
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
          description="Rider issues requiring CRM or support follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["VIP churn signal", "Top-value users are dropping repeat bookings after recent ETA issues", "monitoring"],
              ["Refund dispute cluster", "A rider segment is generating unusually high resolution cost", "review"],
              ["Trust hold backlog", "Several flagged profiles still need final disposition", "queued"],
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
          title="Rider working set"
          description="Current customer relationship priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={crmRiderRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Customer lane" },
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
