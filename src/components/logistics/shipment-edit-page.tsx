"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
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

export default function ShipmentEditPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Shipments", shipment.id, "Edit"]}
        eyebrow="Logistics Kit"
        title={`Edit ${shipment.id}`}
        description="Shipment form preview."
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
        <ShellCard title="Shipment information" description="Core shipment fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Customer" rounded="lg" defaultValue={shipment.customer} />
            <Input label="Tasker" rounded="lg" defaultValue={shipment.tasker} />
            <Input label="Pickup" rounded="lg" defaultValue={shipment.pickup} />
            <Input label="Dropoff" rounded="lg" defaultValue={shipment.dropoff} />
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
    </div>
  );
}
