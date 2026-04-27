"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { scheduledRideRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function DispatchScheduledRidesPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dispatch", "Scheduled Rides"]}
        eyebrow="Operations"
        title="Scheduled rides"
        description="Plan advance bookings, monitor future assignments, and catch pre-trip risks before service windows open."
        badge="Planning"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Upcoming rides"
            value="84"
            change="+16 morning"
            tone="neutral"
            detail="Scheduled bookings due within the next 24 hours across consumer and business flows."
          />
          <StatCard
            label="Still unassigned"
            value="13"
            change="Need lock"
            tone="warning"
            detail="Advance jobs without a locked driver or fallback supply pool."
          />
          <StatCard
            label="Airport blocks"
            value="6"
            change="Peak inbound"
            tone="positive"
            detail="Concentrated scheduled runs tied to major arrival and departure windows."
          />
        </div>

        <ShellCard
          title="Assignment runway"
          description="Advance booking lanes and readiness windows."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Morning airport lanes", "22 rides due before 09:00", "Reserve drivers staged"],
              ["Corporate shuttle block", "14 employees on one billing group", "2 bookings need approval"],
              ["Medical recurring jobs", "9 repeat trips in fixed windows", "Route smoothing in progress"],
              ["Evening peak pre-bookings", "Late-day demand building early", "Supply lock review at 15:00"],
            ].map(([title, metric, note]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-2 text-sm text-gray-500">{metric}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{note}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Planning queue"
          description="Advance jobs requiring operator decisions."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Business booking gap", "Needs final driver before 17:30", "review"],
              ["Airport pre-positioning", "Staging plan still pending", "monitoring"],
              ["Reminder job batch", "Tomorrow morning notices queued", "queued"],
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
          title="Upcoming booking list"
          description="Operational working set for scheduled jobs."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={scheduledRideRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Booking lane" },
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
