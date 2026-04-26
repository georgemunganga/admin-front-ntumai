"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { supportEscalationRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function SupportEscalationsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Support CRM"
        title="Escalations"
        description="Handle high-priority service cases that require senior support, trust, or cross-functional response."
        badge="Escalations"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Active escalations"
            value="19"
            change="High urgency"
            tone="warning"
            detail="Cases currently pushed beyond frontline support because of sensitivity or severity."
          />
          <StatCard
            label="Cross-team cases"
            value="8"
            change="Multi-owner"
            tone="neutral"
            detail="Escalations requiring coordination between support, operations, finance, or trust."
          />
          <StatCard
            label="Closed today"
            value="14"
            change="+5 cleared"
            tone="positive"
            detail="High-priority issues fully resolved with notes and owner sign-off."
          />
        </div>

        <ShellCard
          title="Escalation lanes"
          description="High-priority support categories under senior handling."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Trust escalations", "Sensitive cases pushed to risk or trust for final decisions"],
              ["VIP recovery", "High-value user complaints needing white-glove service handling"],
              ["Partner incidents", "Merchant or operations issues with broader commercial impact"],
              ["Multi-team coordination", "Cases requiring synchronized action from several admin groups"],
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
          description="Escalations requiring leadership follow-up."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["VIP service miss", "A premium customer case needs immediate recovery handling", "monitoring"],
              ["Trust hold review", "One sensitive complaint is blocked awaiting final governance input", "review"],
              ["Partner outage case", "Merchant escalation needs operations notes before closure", "queued"],
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
          title="Escalation working set"
          description="Current high-priority support case groups."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={supportEscalationRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Escalation lane" },
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
