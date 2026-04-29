"use client";

import Link from "next/link";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowRightBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { logisticsShipments } from "@/components/logistics/shipment-data";
import { routes } from "@/config/routes";

const overviewStats = [
  { label: "Live shipments", value: "148", meta: "customer-visible delivery work" },
  { label: "Taskers online", value: "86", meta: "active across current lanes" },
  { label: "SLA risks", value: "09", meta: "need dispatch attention" },
];

const moduleLinks = [
  {
    label: "Shipments",
    href: routes.logistics.shipments,
    note: "List, create, detail, and edit shipment work.",
  },
  {
    label: "Tracking",
    href: routes.logistics.tracking,
    note: "Open tracking cases with stops and recent events.",
  },
  {
    label: "Exceptions",
    href: routes.logistics.exceptions,
    note: "Recovery and intervention queue for blocked deliveries.",
  },
];

export default function LogisticsDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics"]}
        eyebrow="Logistics Kit"
        title="Logistics Control"
        description="Shipments, tracking, and dispatch exceptions."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {overviewStats.map((stat) => (
          <ShellCard key={stat.label} className="space-y-2 p-5">
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="text-[28px] font-semibold tracking-tight text-gray-900">
              {stat.value}
            </Title>
            <Text className="text-sm text-gray-500">{stat.meta}</Text>
          </ShellCard>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.05fr_1.25fr]">
        <ShellCard title="Work areas" description="Open the module that matches the staff job.">
          <div className="space-y-4">
            {moduleLinks.map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-base font-semibold text-gray-900">
                      {item.label}
                    </Title>
                    <Text className="mt-2 text-sm text-gray-500">{item.note}</Text>
                  </div>
                  <Link href={item.href}>
                    <Button variant="outline" className="h-10 rounded-2xl px-4">
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Live watch list" description="Deliveries needing direct operational visibility.">
          <div className="space-y-4">
            {logisticsShipments.map((shipment) => (
              <div key={shipment.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Title as="h4" className="text-base font-semibold text-gray-900">
                        {shipment.id}
                      </Title>
                      <StatusBadge status={shipment.status} />
                      <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                        {shipment.items[2]?.value ?? shipment.updatedAt}
                      </Badge>
                    </div>
                    <div className="grid gap-3 text-sm text-gray-500 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tracking</Text>
                        <Text className="mt-1 font-medium text-gray-900">{shipment.trackingId}</Text>
                      </div>
                      <div>
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tasker</Text>
                        <Text className="mt-1 font-medium text-gray-900">{shipment.tasker}</Text>
                      </div>
                      <div>
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Lane</Text>
                        <Text className="mt-1 font-medium text-gray-900">{shipment.lane}</Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={routes.logistics.shipmentDetails(shipment.id)}>
                      <Button variant="outline" className="h-10 rounded-2xl px-4">
                        Shipment
                      </Button>
                    </Link>
                    <Link href={routes.logistics.trackingDetails(shipment.id)}>
                      <Button className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary-dark">
                        Tracking
                        <PiArrowRightBold className="ms-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>
      {status.replace("_", " ")}
    </span>
  );
}
