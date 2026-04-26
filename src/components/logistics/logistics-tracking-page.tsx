"use client";

import { Badge, Text, Title } from "rizzui";
import PageHeader from "@/components/admin/page-header";

const checkpoints = [
  { zone: "Lusaka Central", live: "38 trips", status: "Healthy", note: "Median ETA inside target" },
  { zone: "Woodlands", live: "19 trips", status: "Busy", note: "Traffic causing 6 delayed stops" },
  { zone: "Airport corridor", live: "11 trips", status: "Escalated", note: "Dispatch rerouting in progress" },
];

const exceptions = [
  { id: "EX-204", label: "Failed handoff", detail: "Recipient unavailable on second attempt", owner: "Recovery team" },
  { id: "EX-198", label: "Stacked route overload", detail: "3 orders shifted off one courier", owner: "Dispatch pod" },
  { id: "EX-194", label: "Vehicle issue", detail: "Bike battery swap required before next lane", owner: "Fleet care" },
];

export default function LogisticsTrackingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Logistics Kit"
        title="Live Tracking"
        description="Monitor route health, handoff exceptions, and recovery actions across active delivery zones."
      />

      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Zone feed
              </Text>
              <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
                Real-time network health
              </Title>
            </div>
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
              Auto-refreshing
            </Badge>
          </div>

          <div className="mt-6 grid gap-4">
            {checkpoints.map((checkpoint) => (
              <div key={checkpoint.zone} className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Title as="h4" className="text-base font-semibold text-gray-900">
                    {checkpoint.zone}
                  </Title>
                  <Badge variant="flat" className="rounded-2xl bg-white px-3 py-1 text-gray-700">
                    {checkpoint.status}
                  </Badge>
                </div>
                <Text className="mt-2 text-sm text-gray-500">{checkpoint.live}</Text>
                <Text className="mt-1 text-sm text-gray-500">{checkpoint.note}</Text>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Exceptions
          </Text>
          <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
            Recovery queue
          </Title>

          <div className="mt-6 space-y-4">
            {exceptions.map((item) => (
              <div key={item.id} className="rounded-2xl bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Text className="text-sm font-semibold text-gray-900">{item.id}</Text>
                  <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                    {item.owner}
                  </Badge>
                </div>
                <Title as="h4" className="mt-3 text-base font-semibold text-gray-900">
                  {item.label}
                </Title>
                <Text className="mt-2 text-sm text-gray-500">{item.detail}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
