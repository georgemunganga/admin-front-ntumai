"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { growthNotificationRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function GrowthNotificationsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Growth", "Notifications"]}
        eyebrow="Growth"
        title="Notifications"
        description="Push, SMS, email, and broadcast messaging."
        badge="Messaging"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Queued messages"
            value="26"
            change="11 scheduled"
            tone="neutral"
            detail="Notifications prepared for upcoming send windows."
          />
          <StatCard
            label="Fallback routes"
            value="4"
            change="SMS active"
            tone="warning"
            detail="Messages currently relying on alternate channels."
          />
          <StatCard
            label="Approved broadcasts"
            value="9"
            change="+3 today"
            tone="positive"
            detail="Messages ready for immediate release."
          />
        </div>

        <ShellCard
          title="Messaging lanes"
          description="Messaging lanes."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Lifecycle push", "Re-engagement and win-back messages."],
              ["SMS fallback", "Critical notices routed through backup channels."],
              ["Broadcast messaging", "Wide announcements to riders, taskers, or merchants."],
              ["Release notices", "Version, maintenance, and feature-change messages."],
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
          description="Needs attention."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Fallback path review", "Critical notifications still leaning on alternate channels.", "monitoring"],
              ["Broadcast sign-off", "Operational announcement waiting on approval.", "review"],
              ["Version notice rollout", "Client update messaging queued behind release timing.", "queued"],
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
          title="Notification working set"
          description="Current notification list."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={growthNotificationRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Notification lane" },
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
