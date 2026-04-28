"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Input, Select, Text, Textarea } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiFloppyDiskBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getLogisticsShipment } from "@/components/logistics/shipment-data";

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
];

const parcelOptions = [
  { label: "Groceries", value: "Groceries" },
  { label: "Express parcel", value: "Express parcel" },
  { label: "Return parcel", value: "Return parcel" },
  { label: "Household bundle", value: "Household bundle" },
];

export default function ShipmentEditPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Shipments", shipment.id, "Edit"]}
        eyebrow="Logistics Kit"
        title={`Edit ${shipment.id}`}
        description="Shipment flow aligned to pickup, drop-off, tracking, and tasker dispatch context."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.logistics.shipmentDetails(shipment.id)}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              Save Draft
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ShellCard title="Shipment information" description="Pickup, recipient, and route detail.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Shipment ID" rounded="lg" defaultValue={shipment.id} />
            <Input label="Tracking ID" rounded="lg" defaultValue={shipment.trackingId} />
            <Input label="Customer" rounded="lg" defaultValue={shipment.customer} />
            <Input label="Customer phone" rounded="lg" defaultValue={shipment.customerPhone} />
            <Input label="Tasker" rounded="lg" defaultValue={shipment.tasker} />
            <Input label="Recipient / office" rounded="lg" defaultValue={shipment.recipient} />
            <Input label="Pickup" rounded="lg" defaultValue={shipment.pickup} />
            <Input label="Drop-off" rounded="lg" defaultValue={shipment.dropoff} />
            <Input label="Lane" rounded="lg" defaultValue={shipment.lane} />
            <Input label="Value" rounded="lg" defaultValue={shipment.value} />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Notes</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" defaultValue={shipment.notes} />
          </div>
        </ShellCard>

        <ShellCard title="Status" description="Current shipment state.">
          <div className="space-y-4">
            <Select
              label="Shipment status"
              options={statusOptions}
              defaultValue={statusOptions.find((option) => option.value === shipment.status)}
              selectClassName="rounded-2xl"
            />
            <Input label="Owner" rounded="lg" defaultValue={shipment.owner} />
            <Input label="Updated label" rounded="lg" defaultValue={shipment.updatedAt} />
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Shipment markers" description="Parcel and delivery context.">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Package type"
              options={parcelOptions}
              defaultValue={parcelOptions.find((option) => option.value === shipment.items[0]?.value) ?? parcelOptions[0]}
              selectClassName="rounded-2xl"
            />
            <Input label="Weight" rounded="lg" defaultValue={shipment.items[1]?.value ?? ""} />
            <Input label="ETA" rounded="lg" defaultValue={shipment.items[2]?.value ?? ""} />
            <Input label="Tracking visibility" rounded="lg" defaultValue="Public tracking enabled" />
          </div>
        </ShellCard>

        <ShellCard title="Summary" description="Tracking and dispatch readiness.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Shipment state
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">{shipment.status.replace("_", " ")}</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {shipment.lane}
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Mobile tracking flows depend on a tracking reference, pickup and drop-off details, and visible delivery status.
              </Text>
            </div>

            <WorkflowNote
              icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
              title="Tracking context captured"
              detail="Tracking ID, pickup address, and drop-off address are ready for customer and tasker visibility."
            />
            <WorkflowNote
              icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
              title="Tasker handoff path"
              detail="Shipments may stay queued until a tasker accepts or dispatch assigns the delivery lane."
            />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function WorkflowNote({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-gray-100 bg-white p-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
      </div>
    </div>
  );
}
