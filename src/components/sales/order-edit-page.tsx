"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getSalesOrder } from "@/components/sales/order-data";
import { routes } from "@/config/routes";

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
];

export default function OrderEditPage({ id }: { id: string }) {
  const order = getSalesOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Orders", order.id, "Edit"]}
        eyebrow="Sales Kit"
        title={`Edit ${order.id}`}
        description="Order form preview."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sales.orderDetails(order.slug)}>
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
        <ShellCard title="Order information" description="Commercial fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Customer" rounded="lg" defaultValue={order.customer} />
            <Input label="Vendor" rounded="lg" defaultValue={order.vendor} />
            <Input label="City" rounded="lg" defaultValue={order.city} />
            <Input label="Order value" rounded="lg" defaultValue={order.value} />
            <Input label="Fulfillment" rounded="lg" defaultValue={order.fulfillment} />
            <Input label="Payment state" rounded="lg" defaultValue={order.paymentState} />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Order summary</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" defaultValue={order.summary} />
          </div>
        </ShellCard>

        <ShellCard title="Status" description="Current order state.">
          <div className="space-y-4">
            <Select
              label="Order status"
              options={statusOptions}
              defaultValue={statusOptions.find((option) => option.value === order.status)}
              selectClassName="rounded-2xl"
            />
            <Input label="Updated label" rounded="lg" defaultValue={order.updatedAt} />
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
