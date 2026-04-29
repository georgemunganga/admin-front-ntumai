"use client";

import Link from "next/link";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowRightBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { logisticsShipments } from "@/components/logistics/shipment-data";
import { routes } from "@/config/routes";

const trackingStats = [
  { label: "Live tracked", value: "38", meta: "customer-visible links active" },
  { label: "At risk", value: "6", meta: "ETA or route watch required" },
  { label: "Recovery handoffs", value: "3", meta: "exceptions still open" },
];

export default function LogisticsTrackingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Tracking"]}
        eyebrow="Logistics Kit"
        title="Live Tracking"
        description="Open a tracking case to inspect stops, rider context, and recent events."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {trackingStats.map((stat) => (
          <ShellCard key={stat.label} className="space-y-2 p-5">
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="text-[28px] font-semibold tracking-tight text-gray-900">
              {stat.value}
            </Title>
            <Text className="text-sm text-gray-500">{stat.meta}</Text>
          </ShellCard>
        ))}
      </div>

      <ShellCard title="Tracked deliveries" description="Tracking references currently live in customer and public flows.">
        <div className="mt-2 space-y-4">
          {logisticsShipments.map((shipment) => (
            <div key={shipment.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Title as="h4" className="text-base font-semibold text-gray-900">
                      {shipment.trackingId}
                    </Title>
                    <TrackingStatus status={shipment.status} />
                    <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                      {shipment.items[2]?.value ?? shipment.updatedAt}
                    </Badge>
                  </div>
                  <div className="grid gap-3 text-sm text-gray-500 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Customer</Text>
                      <Text className="mt-1 font-medium text-gray-900">{shipment.customer}</Text>
                    </div>
                    <div>
                      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tasker</Text>
                      <Text className="mt-1 font-medium text-gray-900">{shipment.tasker}</Text>
                    </div>
                    <div>
                      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Pickup</Text>
                      <Text className="mt-1 font-medium text-gray-900">{shipment.pickup}</Text>
                    </div>
                    <div>
                      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Drop-off</Text>
                      <Text className="mt-1 font-medium text-gray-900">{shipment.dropoff}</Text>
                    </div>
                  </div>
                </div>

                <Link href={routes.logistics.trackingDetails(shipment.id)}>
                  <Button className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary-dark">
                    Open Tracking
                    <PiArrowRightBold className="ms-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

function TrackingStatus({ status }: { status: string }) {
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
