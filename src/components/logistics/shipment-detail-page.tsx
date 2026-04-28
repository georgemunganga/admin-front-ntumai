"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiNotePencilBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getLogisticsShipment } from "@/components/logistics/shipment-data";

export default function ShipmentDetailPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Shipments", shipment.id]}
        eyebrow="Logistics Kit"
        title={shipment.id}
        description={shipment.notes}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.logistics.shipments}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.logistics.editShipment(shipment.id)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Shipment
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Shipment summary" description="Operational shipment details.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile label="Customer" value={shipment.customer} />
            <InfoTile label="Tasker" value={shipment.tasker} />
            <InfoTile label="Pickup" value={shipment.pickup} />
            <InfoTile label="Dropoff" value={shipment.dropoff} />
            <InfoTile label="Lane" value={shipment.lane} />
            <InfoTile label="Value" value={shipment.value} />
          </div>
        </ShellCard>

        <ShellCard title="Status" description="Current shipment state.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Shipment state</Text>
              <div className="mt-3 flex items-center gap-3">
                <ShipmentStatus status={shipment.status} />
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {shipment.updatedAt}
                </Badge>
              </div>
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Shipment markers" description="Current operational markers.">
          <div className="space-y-3">
            {shipment.items.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-semibold text-gray-900">{item.label}</Text>
                  <Text className="font-semibold text-gray-900">{item.value}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Timeline" description="Latest shipment events.">
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

function ShipmentStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };
  return <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>{status.replace("_", " ")}</span>;
}
