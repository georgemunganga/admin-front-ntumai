"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiMapPinBold,
  PiNotePencilBold,
  PiPhoneBold,
  PiReceiptBold,
  PiStorefrontBold,
  PiTruckBold,
  PiUserBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getSalesOrder } from "@/components/sales/order-data";

export default function OrderDetailPage({ id }: { id: string }) {
  const order = getSalesOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Orders", order.id]}
        eyebrow="Sales Kit"
        title={order.orderNumber}
        description={order.summary}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.sales.orders}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.sales.editOrder(order.slug)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiNotePencilBold className="me-1.5 h-4 w-4" />
                Edit Order
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Order summary" description="Customer and fulfillment detail.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile label="Customer" value={order.customer} icon={<PiUserBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Phone" value={order.customerPhone} icon={<PiPhoneBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Vendor" value={order.vendor} icon={<PiStorefrontBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Tracking ID" value={order.trackingId} icon={<PiTruckBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Fulfillment" value={order.fulfillment} icon={<PiTruckBold className="h-4 w-4 text-primary" />} />
            <InfoTile label="Payment" value={`${order.paymentMethod} · ${order.paymentState}`} icon={<PiReceiptBold className="h-4 w-4 text-primary" />} />
          </div>

          <div className="mt-5 rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
            <div className="flex items-center gap-2">
              <PiMapPinBold className="h-4 w-4 text-primary" />
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Delivery address</Text>
            </div>
            <Text className="mt-2 text-sm leading-6 text-gray-600">{order.deliveryAddress}</Text>
          </div>
        </ShellCard>

        <ShellCard title="Status" description="Operational state.">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Order state</Text>
              <div className="mt-3 flex items-center gap-3">
                <OrderStatus status={order.status} />
                <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                  {order.updatedAt}
                </Badge>
              </div>
            </div>

            <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Commercial totals</Text>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-3">
                  <Text>Items</Text>
                  <Text className="font-semibold text-gray-900">{order.itemCount}</Text>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Text>Subtotal</Text>
                  <Text className="font-semibold text-gray-900">{order.subtotal}</Text>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Text>Delivery fee</Text>
                  <Text className="font-semibold text-gray-900">{order.deliveryFee}</Text>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Text>Tax</Text>
                  <Text className="font-semibold text-gray-900">{order.tax}</Text>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-2">
                  <Text className="font-semibold text-gray-900">Total</Text>
                  <Text className="font-semibold text-gray-900">{order.totalAmount}</Text>
                </div>
              </div>
            </div>
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Items" description="Current basket.">
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.name} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.name}</Text>
                    <Text className="mt-1 text-sm text-gray-500">Qty {item.qty}</Text>
                  </div>
                  <Text className="font-semibold text-gray-900">{item.price}</Text>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Timeline" description="Latest order events.">
          <div className="space-y-3">
            {order.timeline.map((item) => (
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

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      </div>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
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
