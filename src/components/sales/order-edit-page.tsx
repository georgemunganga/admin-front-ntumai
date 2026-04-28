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

const fulfillmentOptions = [
  { label: "Same-day", value: "Same-day" },
  { label: "On-demand", value: "On-demand" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Next-slot", value: "Next-slot" },
];

const paymentStateOptions = [
  { label: "Paid", value: "Paid" },
  { label: "Authorized", value: "Authorized" },
  { label: "Pending review", value: "Pending review" },
];

const paymentMethodOptions = [
  { label: "Wallet", value: "Wallet" },
  { label: "Card", value: "Card" },
  { label: "Mobile money", value: "Mobile money" },
  { label: "Cash on delivery", value: "Cash on delivery" },
];

export default function OrderEditPage({ id }: { id: string }) {
  const order = getSalesOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Orders", order.id, "Edit"]}
        eyebrow="Sales Kit"
        title={`Edit ${order.orderNumber}`}
        description="Order form aligned to checkout fields and vendor handoff state."
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
        <ShellCard title="Order information" description="Customer and storefront detail.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Order number" rounded="lg" defaultValue={order.orderNumber} />
            <Input label="Tracking ID" rounded="lg" defaultValue={order.trackingId} />
            <Input label="Customer" rounded="lg" defaultValue={order.customer} />
            <Input label="Customer phone" rounded="lg" defaultValue={order.customerPhone} />
            <Input label="Vendor" rounded="lg" defaultValue={order.vendor} />
            <Input label="City" rounded="lg" defaultValue={order.city} />
            <Select
              label="Fulfillment"
              options={fulfillmentOptions}
              defaultValue={fulfillmentOptions.find((option) => option.value === order.fulfillment)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Payment state"
              options={paymentStateOptions}
              defaultValue={paymentStateOptions.find((option) => option.value === order.paymentState)}
              selectClassName="rounded-2xl"
            />
            <Select
              label="Payment method"
              options={paymentMethodOptions}
              defaultValue={paymentMethodOptions.find((option) => option.value === order.paymentMethod)}
              selectClassName="rounded-2xl"
            />
            <Input label="Item count" rounded="lg" defaultValue={order.itemCount} />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Delivery address</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" defaultValue={order.deliveryAddress} />
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Commercial totals" description="Checkout and payment fields.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Subtotal" defaultValue={order.subtotal.replace("ZMW ", "")} prefix="ZMW" rounded="lg" />
            <Input label="Delivery fee" defaultValue={order.deliveryFee.replace("ZMW ", "")} prefix="ZMW" rounded="lg" />
            <Input label="Tax" defaultValue={order.tax.replace("ZMW ", "")} prefix="ZMW" rounded="lg" />
            <Input label="Total amount" defaultValue={order.totalAmount.replace("ZMW ", "")} prefix="ZMW" rounded="lg" />
          </div>
          <div className="mt-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Order summary</Text>
            <Textarea rows={4} textareaClassName="rounded-2xl" defaultValue={order.summary} />
          </div>
        </ShellCard>

        <ShellCard title="Summary" description="Checkout and handoff readiness.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Order state
                  </Text>
                  <Text className="mt-2 font-semibold text-gray-900">{order.paymentState}</Text>
                </div>
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {order.fulfillment}
                </Badge>
              </div>
              <Text className="mt-2 text-sm text-gray-500">
                Customer checkout requires a delivery address, item list, payment method, total amount, and delivery fee before the order is created.
              </Text>
            </div>

            <WorkflowNote
              icon={<PiCheckCircleBold className="h-4 w-4 text-emerald-600" />}
              title="Checkout complete"
              detail="Address, payment choice, and totals are captured before tracking begins."
            />
            <WorkflowNote
              icon={<PiWarningCircleBold className="h-4 w-4 text-amber-600" />}
              title="Vendor decision path"
              detail="The vendor flow can accept, reject, or move the order into preparation and pickup stages."
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
