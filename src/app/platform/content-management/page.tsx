"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { platformContentRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function PlatformContentManagementPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Platform", "Content Management"]}
        eyebrow="Platform"
        title="Content management"
        description="Banners, help, and policy content."
        badge="Content"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Draft items"
            value="27"
            change="9 awaiting approval"
            tone="neutral"
            detail="Pending content still in review or scheduling."
          />
          <StatCard
            label="Live placements"
            value="18"
            change="+4 this week"
            tone="positive"
            detail="Active homepage, help, and in-app surfaces."
          />
          <StatCard
            label="Policy updates"
            value="6"
            change="Legal review"
            tone="warning"
            detail="Policy docs waiting on sign-off."
          />
        </div>

        <ShellCard
          title="Managed surfaces"
          description="Content lanes."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Homepage and banners", "Promos, hero placements, and spotlight blocks."],
              ["Help center", "FAQs, guides, and support articles."],
              ["Policy pages", "Terms, safety notices, and regulatory messaging."],
              ["Growth content", "Merchant spotlights and announcement copy."],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Publish blockers"
          description="Publish blockers."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Legal sign-off gap", "Policy copy still waiting for approval.", "review"],
              ["Creative backlog", "Campaign assets queued behind edits.", "monitoring"],
              ["Homepage refresh", "Placement window blocked by unresolved merchant content.", "queued"],
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
          title="Content working set"
          description="Current content list."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={platformContentRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Content lane" },
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
