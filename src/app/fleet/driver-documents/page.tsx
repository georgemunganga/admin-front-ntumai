"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { fleetDocumentRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function FleetDriverDocumentsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Fleet", "Tasker Documents"]}
        eyebrow="Operations"
        title="Tasker documents"
        description="Manage licenses, insurance, inspection status, and expiry-driven compliance actions."
        badge="Compliance"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Expiring within 7 days"
            value="21"
            change="Needs renewal"
            tone="warning"
            detail="Documents that will soon block supply if no action is taken."
          />
          <StatCard
            label="Review backlog"
            value="15"
            change="Manual queue"
            tone="neutral"
            detail="Uploads still waiting for compliance or fleet validation."
          />
          <StatCard
            label="Auto-suspend risk"
            value="6"
            change="High urgency"
            tone="warning"
            detail="Accounts approaching system-enforced restriction because of missing compliance items."
          />
        </div>

        <ShellCard
          title="Compliance lanes"
          description="Main document and inspection control groups."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["License monitoring", "Tasker permits tracked against renewal thresholds"],
              ["Insurance validation", "Vehicle policy checks before supply release"],
              ["Inspection readiness", "Physical clearance queue for active and new assets"],
              ["Auto-suspend protection", "Governance controls before accounts fall out of compliance"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Compliance watch"
          description="Documents most likely to trigger operational issues."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["License expiry wave", "Several taskers are approaching the same deadline window", "monitoring"],
              ["Insurance renewal delay", "Policy uploads have not been confirmed for active assets", "review"],
              ["Suspension candidates", "Accounts may fall out of supply without urgent action", "at_risk"],
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
          title="Document queue"
          description="Working list for compliance operators."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={fleetDocumentRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Document lane" },
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
