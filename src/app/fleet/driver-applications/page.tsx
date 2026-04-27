"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { fleetApplicationRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function FleetDriverApplicationsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Fleet", "Driver Applications"]}
        eyebrow="Operations"
        title="Driver applications"
        description="Manage onboarding flow, inspection readiness, and activation blockers for incoming drivers."
        badge="Onboarding"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Pending applications"
            value="34"
            change="+8 new"
            tone="neutral"
            detail="Applicants still moving through onboarding and verification steps."
          />
          <StatCard
            label="Inspection holds"
            value="11"
            change="Blocking activation"
            tone="warning"
            detail="Candidates delayed by vehicle or document review requirements."
          />
          <StatCard
            label="Ready for approval"
            value="17"
            change="Can process"
            tone="positive"
            detail="Candidates who have passed most checks and need final activation decisions."
          />
        </div>

        <ShellCard
          title="Onboarding stages"
          description="Main queues in the driver acquisition funnel."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Initial review", "New applicant data and first KYC screening"],
              ["Inspection gate", "Vehicle and asset fitness checks before activation"],
              ["Interview / approval", "Manual checkpoint for final operational fit"],
              ["Appeals and retries", "Rejected candidates asking for a second pass"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Activation blockers"
          description="Items most likely to slow supply growth."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Document mismatch", "Applications paused after KYC inconsistencies", "review"],
              ["Inspection backlog", "Vehicle clearance steps are stacking up", "monitoring"],
              ["Approval follow-up", "Final sign-off queue needs manual sweep", "queued"],
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
          title="Application queue"
          description="Working list for onboarding and activation."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={fleetApplicationRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Application lane" },
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
