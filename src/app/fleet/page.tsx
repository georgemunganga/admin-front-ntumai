"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { Badge, Text, Title } from "rizzui";

const supplyMix = [
  { label: "Motorbike taskers", value: "286", share: "61%", note: "Primary same-day and food delivery pool." },
  { label: "Car taskers", value: "104", share: "22%", note: "Car-based supply for protected and longer trips." },
  { label: "Truck operators", value: "28", share: "6%", note: "Heavy and commercial fulfillment capacity." },
  { label: "Walking taskers", value: "49", share: "11%", note: "Short-hop and dense CBD errands." },
];

const onboardingStages = [
  ["Applications in review", "84", "Across KYC, documents, and road readiness checks.", "review"],
  ["Ready for activation", "19", "Can be moved live once final fleet sign-off is complete.", "live"],
  ["Document resubmissions", "27", "Pending clearer IDs, address proof, or permit renewal.", "queued"],
  ["Risk-held accounts", "11", "Restricted by fraud, duplicate identity, or compliance concerns.", "at_risk"],
] as const;

const vehicleHealth = [
  ["Motorbikes with valid inspection", "241", "12 due within 7 days"],
  ["Cars / sedans active", "88", "9 approaching service window"],
  ["Trucks and vans live", "31", "3 commercial assets under manual review"],
];

const attentionQueue = [
  ["Expired documents", "14 taskers need permit or insurance refresh before next activation window.", "review"],
  ["Low-supply corridors", "Airport, Chalala, and Kitwe East are below target online coverage.", "monitoring"],
  ["Inactive top earners", "22 high-value taskers dropped below expected weekly activity.", "queued"],
  ["Compliance suspensions", "6 accounts remain locked pending trust and safety resolution.", "at_risk"],
] as const;

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Fleet"]}
        eyebrow="Fleet Ops"
        title="Fleet analytics"
        description="Supply, vehicle, onboarding, and compliance health across Ntumai tasker operations."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total taskers"
          value="467"
          change="+23 this week"
          tone="positive"
          detail="All active and onboarding supply types combined."
        />
        <StatCard
          label="Total car taskers"
          value="104"
          change="+7 online now"
          tone="positive"
          detail="Car-based supply currently available for protected trips."
        />
        <StatCard
          label="Total motorbikes"
          value="286"
          change="61% of supply"
          tone="positive"
          detail="Primary tasker mode for deliveries and errands."
        />
        <StatCard
          label="Walking taskers"
          value="49"
          change="CBD heavy"
          tone="warning"
          detail="Dense-zone short-hop coverage for central lanes."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Supply mix" description="How the live tasker base is distributed by mode.">
          <div className="grid gap-4 md:grid-cols-2">
            {supplyMix.map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="text-sm font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.note}</Text>
                  </div>
                  <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                    {item.share}
                  </Badge>
                </div>
                <Title as="h3" className="mt-4 text-2xl font-semibold text-gray-900">
                  {item.value}
                </Title>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Fleet attention queue" description="The issues likely to move supply health first.">
          <div className="space-y-3">
            {attentionQueue.map(([title, detail, status]) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{title}</Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ShellCard title="Onboarding funnel" description="Current fleet application load and readiness.">
          <div className="space-y-3">
            {onboardingStages.map(([label, value, detail, status]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div>
                  <Text className="font-semibold text-gray-900">{label}</Text>
                  <Text className="mt-1 text-sm text-gray-500">{detail}</Text>
                </div>
                <div className="text-right">
                  <Title as="h3" className="text-xl font-semibold text-gray-900">
                    {value}
                  </Title>
                  <div className="mt-2 flex justify-end">
                    <StatusBadge status={status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Vehicle readiness" description="Asset health across the fleet-backed supply pool.">
          <div className="space-y-4">
            {vehicleHealth.map(([label, value, detail]) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-semibold text-gray-900">{label}</Text>
                  <Title as="h3" className="text-xl font-semibold text-gray-900">
                    {value}
                  </Title>
                </div>
                <Text className="mt-2 text-sm text-gray-500">{detail}</Text>
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Compliance pass rate
                </Text>
                <Title as="h4" className="mt-2 text-2xl font-semibold text-gray-900">
                  93.4%
                </Title>
                <Text className="mt-2 text-sm text-gray-500">
                  Share of fleet-linked taskers currently holding valid operating documents.
                </Text>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Activation speed
                </Text>
                <Title as="h4" className="mt-2 text-2xl font-semibold text-gray-900">
                  1.8 days
                </Title>
                <Text className="mt-2 text-sm text-gray-500">
                  Median time from application submission to live activation this week.
                </Text>
              </div>
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
