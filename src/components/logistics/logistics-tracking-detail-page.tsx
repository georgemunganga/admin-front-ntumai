"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowLeftBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getLogisticsShipment } from "@/components/logistics/shipment-data";

export default function LogisticsTrackingDetailPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Tracking", shipment.trackingId]}
        eyebrow="Logistics Kit"
        title={shipment.trackingId}
        description={shipment.notes}
        action={
          <Link href={routes.logistics.tracking}>
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiArrowLeftBold className="me-1.5 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Live tracking" description="Current public-tracking context for the delivery.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile label="Tracking ID" value={shipment.trackingId} />
            <InfoTile label="Status label" value={shipment.status.replace("_", " ")} />
            <InfoTile label="Tasker" value={shipment.tasker} />
            <InfoTile label="ETA" value={shipment.items[2]?.value ?? shipment.updatedAt} />
            <InfoTile label="Customer" value={shipment.customer} />
            <InfoTile label="Customer phone" value={shipment.customerPhone} />
          </div>
        </ShellCard>

        <ShellCard title="Watch state" description="Dispatch and customer visibility.">
          <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tracking state</Text>
            <div className="mt-3 flex items-center gap-3">
              <TrackingStatus status={shipment.status} />
              <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                {shipment.updatedAt}
              </Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-between gap-3">
                <span>Owner</span>
                <span className="font-medium text-gray-900">{shipment.owner}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Public link</span>
                <span className="font-medium text-gray-900">Enabled</span>
              </div>
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Delivery details" description="Pickup and drop-off stops visible in tracking.">
          <div className="space-y-3">
            <StopCard label="Pickup" value={shipment.pickup} />
            <StopCard label="Drop-off" value={shipment.dropoff} />
            <StopCard label="Recipient / office" value={shipment.recipient} />
          </div>
        </ShellCard>

        <ShellCard title="Tracking updates" description="Recent shipment events.">
          <div className="space-y-3">
            {shipment.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.detail}</Text>
                  </div>
                  <Text className="text-xs text-gray-500">{item.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function StopCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Text className="mt-2 font-semibold text-gray-900">{value}</Text>
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
