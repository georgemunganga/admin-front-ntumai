"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { growthPromotionRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function GrowthPromotionsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Growth", "Promotions"]}
        eyebrow="Growth"
        title="Promotions"
        description="Manage discounts, referrals, merchant co-promos, and retention offers across customer segments."
        badge="Promos"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Live promotions"
            value="18"
            change="+4 this week"
            tone="positive"
            detail="Campaigns currently active across customer, merchant, or zone-targeted flows."
          />
          <StatCard
            label="Approval queue"
            value="9"
            change="Need sign-off"
            tone="warning"
            detail="Offers still blocked by pricing, legal, or commercial review requirements."
          />
          <StatCard
            label="Retention cohorts"
            value="11"
            change="Targeted"
            tone="neutral"
            detail="Dormant or at-risk customer groups currently mapped into win-back flows."
          />
        </div>

        <ShellCard
          title="Promotion lanes"
          description="Main commercial and customer promotion workflows."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["City campaigns", "Region and zone-targeted fee or fare discounts"],
              ["Referral rewards", "Invite-based acquisition and loyalty incentives"],
              ["Merchant co-promos", "Partner-funded commercial placements and offers"],
              ["Retention offers", "Targeted win-back and reactivation discounts"],
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
          description="Promotion issues needing growth-team focus."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Commercial approval lag", "A key city offer is waiting on pricing confirmation", "review"],
              ["Referral abuse watch", "One invite campaign is showing elevated suspicious redemption patterns", "monitoring"],
              ["Partner promo backlog", "Merchant offer placements are queued behind campaign sign-off", "queued"],
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
          title="Promotion working set"
          description="Current offer and campaign priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={growthPromotionRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Promotion lane" },
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
