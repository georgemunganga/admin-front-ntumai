"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import {
  controlRooms,
  dashboardStats,
  orderRows,
  regionPulse,
} from "@/components/admin/section-data";
import { Badge, Button, Text, Title } from "rizzui";

export default function Home() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ntumai control center"
        title="Modern admin shell for operations, growth, and support"
        description="This first pass focuses on structure and reusable UI only. The shell is now arranged around the workflows Ntumai actually needs, while keeping the template's richer interaction pieces available for later CRUD wiring."
        badge="UI baseline"
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full px-4">
              Review sections
            </Button>
            <Button className="rounded-full px-4">Plan next CRUD pass</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <ShellCard
          title="Command view"
          description="A tighter overview surface for the most operationally important areas."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {controlRooms.map((room) => (
              <div
                key={room.title}
                className="rounded-[24px] border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <Title as="h3" className="text-base font-semibold">
                    {room.title}
                  </Title>
                  <Badge
                    variant="flat"
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600"
                  >
                    {room.metric}
                  </Badge>
                </div>
                <Text className="mt-3 text-sm leading-7 text-gray-500">
                  {room.description}
                </Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Regional pulse"
          description="Quick zone-level scan for workload and quality pressure."
        >
          <div className="space-y-3">
            {regionPulse.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center justify-between rounded-[22px] border border-gray-100 bg-gray-50/70 px-4 py-3"
              >
                <div>
                  <Title as="h4" className="text-sm font-semibold">
                    {zone.name}
                  </Title>
                  <Text className="mt-1 text-sm text-gray-500">
                    {zone.volume}
                  </Text>
                </div>
                <StatusBadge status={zone.load} />
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <ShellCard
          title="Today’s pressure points"
          description="Purposefully mixed card patterns so we can later pull the strongest ones into real list pages."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {orderRows.map((item) => (
              <div
                key={item.primary}
                className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm shadow-gray-100/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-base font-semibold">
                      {item.primary}
                    </Title>
                    <Text className="mt-2 text-sm text-gray-500">
                      {item.secondary}
                    </Text>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Owner
                  </Text>
                  <Text className="text-sm font-medium text-gray-700">
                    {item.tertiary}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Build direction"
          description="What this UI pass is optimizing for before we touch dependency upgrades."
        >
          <div className="space-y-3">
            {[
              "Keep the strongest reusable dashboard patterns and delete generic demo noise later.",
              "Bias toward modern, lower-friction layouts with clearer spacing and fewer crowded controls.",
              "Shape each section around real Ntumai admin jobs instead of template category names.",
              "Only upgrade dependencies after we know which UI pieces actually survive.",
            ].map((point, index) => (
              <div
                key={point}
                className="flex gap-4 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <Text className="text-sm leading-7 text-gray-600">{point}</Text>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
