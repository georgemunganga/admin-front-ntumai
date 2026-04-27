"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { riskEmergencyRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function RiskEmergencyPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Risk", "SOS / Emergency"]}
        eyebrow="Risk & safety"
        title="SOS and emergency"
        description="Manage panic alerts, accident response, and unsafe-trip escalations through the safety operations layer."
        badge="Safety"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Open SOS alerts"
            value="3"
            change="High priority"
            tone="warning"
            detail="Safety incidents still requiring action, contact, or closure steps."
          />
          <StatCard
            label="Incident callbacks"
            value="11"
            change="Need follow-up"
            tone="neutral"
            detail="Post-incident contacts pending customer, driver, or city-team response."
          />
          <StatCard
            label="Resolved today"
            value="9"
            change="+4 closed"
            tone="positive"
            detail="Emergency and safety cases completed with notes and operator sign-off."
          />
        </div>

        <ShellCard
          title="Safety lanes"
          description="Core workflows inside emergency operations."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["SOS handling", "Immediate triage, contact, and escalation for panic events"],
              ["Accident response", "Incident logging, evidence collection, and follow-up workflow"],
              ["Unsafe trip reports", "Service safety complaints requiring fast trust response"],
              ["Post-incident closure", "Notes, callbacks, and city-team sign-off before final closure"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Immediate actions"
          description="Safety items still needing response."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Open panic case", "An SOS thread still needs final responder notes and closure", "monitoring"],
              ["Accident file review", "Documentation from a recent incident remains incomplete", "review"],
              ["Escalation handoff", "A city-team case is queued for next-step confirmation", "queued"],
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
          title="Emergency working set"
          description="Current safety and incident cases."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={riskEmergencyRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Safety lane" },
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
