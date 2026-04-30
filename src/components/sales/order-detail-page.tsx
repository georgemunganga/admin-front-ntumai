"use client";

import Link from "next/link";
import { Button, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiCheckBold, PiNotePencilBold } from "react-icons/pi";
import DataSourceState from "@/components/admin/data-source-state";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { useSalesOrder } from "@/repositories/admin/orders";

const orderStatusSteps = [
  "Order Created",
  "Vendor Confirmed",
  "Preparing For Dispatch",
  "Out For Delivery",
  "Delivered",
];

export default function OrderDetailPage({ id }: { id: string }) {
  const { data: order, isLoading, isLive, error } = useSalesOrder(id);

  if (!order && isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumb={["Home", "Sales", "Orders", id]}
          eyebrow="Sales Kit"
          title="Order"
          description="Loading customer checkout and delivery context from the staff record service."
        />
        <DataSourceState isLoading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumb={["Home", "Sales", "Orders", id]}
          eyebrow="Sales Kit"
          title="Order"
          description="No order record was found for this identifier."
          action={
            <Link href={routes.sales.orders}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
          }
        />
        <DataSourceState isLive={false} error={error ?? "Order record not found"} />
      </div>
    );
  }

  const currentStep = order.status === "queued" ? 1 : order.status === "review" ? 2 : order.status === "monitoring" ? 3 : order.status === "live" ? 4 : 5;

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Orders", order.id]}
        eyebrow="Sales Kit"
        title={`Order ${order.orderNumber}`}
        description="Review customer checkout context, vendor handoff, and dispatch progress for this Ntumai order."
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
            <Link href={routes.supportDesk.inbox}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                Open Support
              </Button>
            </Link>
          </div>
        }
      />

      <DataSourceState isLoading={isLoading} isLive={isLive} error={error} />

      <div className="flex flex-wrap justify-center rounded-[24px] border border-gray-200 bg-white px-4 py-4 font-medium text-gray-700 shadow-sm @5xl:justify-start">
        <span className="my-2 border-r border-gray-200 px-5 py-0.5 first:ps-0 last:border-r-0">{order.updatedAt}</span>
        <span className="my-2 border-r border-gray-200 px-5 py-0.5 first:ps-0 last:border-r-0">{order.itemCount}</span>
        <span className="my-2 border-r border-gray-200 px-5 py-0.5 first:ps-0 last:border-r-0">Total {order.totalAmount}</span>
        <span className="my-2 ms-5 rounded-3xl bg-green-100 px-2.5 py-1 text-xs text-green-700">{order.paymentState}</span>
      </div>

      <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          <ShellCard title="Order Context" description="Customer, vendor, and dispatch context carried through the Ntumai order flow.">
            <div className="rounded-xl border border-gray-200 px-5 py-3 text-sm leading-[1.85] text-gray-600">
              {order.summary}
            </div>
          </ShellCard>

          <ShellCard title="Ordered Items" description="Marketplace basket and commercial totals ready for merchant and finance review.">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg border border-gray-100 px-5 py-5 shadow-sm transition-shadow">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.name}</Text>
                    <Text className="pt-1 text-[13px] font-normal text-gray-500">Quantity {item.qty}</Text>
                  </div>
                  <div className="text-end font-medium text-gray-900">{item.price}</div>
                </div>
              ))}
            </div>
            <div className="mt-7 border-t border-gray-200 pt-7">
              <div className="ms-auto max-w-lg space-y-6">
                <SummaryLine label="Subtotal" value={order.subtotal} />
                <SummaryLine label="Delivery fee" value={order.deliveryFee} />
                <SummaryLine label="Tax" value={order.tax} />
                <SummaryLine label="Total" value={order.totalAmount} strong />
              </div>
            </div>
          </ShellCard>

          <ShellCard title="Transactions" description="Payment, settlement hold, and reserve trail used by support and finance teams.">
            <div className="space-y-4">
              {[order.paymentMethod, "Vendor settlement hold", "Support adjustment reserve"].map((method, index) => (
                <div key={`${method}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-100 px-5 py-5 font-medium shadow-sm transition-shadow">
                  <div className="flex flex-col">
                    <Text as="span" className="font-semibold text-gray-700">
                      {index === 0 ? "Payment" : index === 1 ? "Settlement" : "Reserve"}
                    </Text>
                    <span className="pt-1 text-[13px] font-normal text-gray-500">Via {method}</span>
                  </div>
                  <div className="text-end">{index === 0 ? order.totalAmount : index === 1 ? order.subtotal : order.deliveryFee}</div>
                </div>
              ))}
            </div>
          </ShellCard>

          <ShellCard title="Balance" description="Order-level financial position after customer collection and vendor reserve handling.">
            <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6 @5xl:space-y-7 @5xl:p-7">
              <SummaryLine label="Total order" value={order.totalAmount} />
              <SummaryLine label="Refunded" value="ZMW 0" />
              <SummaryLine label="Paid by customer" value={order.totalAmount} />
              <SummaryLine label="Vendor reserve" value={order.deliveryFee} />
              <SummaryLine label="Balance" value={order.subtotal} />
            </div>
          </ShellCard>
        </div>

        <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <ShellCard title="Order Status" description="Ntumai order movement from checkout to handoff completion.">
            <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100 py-5 @5xl:py-8">
              {orderStatusSteps.map((label, index) => {
                const step = index + 1;
                const active = currentStep >= step;
                return (
                  <div
                    key={label}
                    className={`relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[''] last:after:hidden ${
                      active ? "before:bg-primary after:bg-primary" : "before:bg-gray-100 after:bg-gray-100"
                    }`}
                  >
                    {active ? (
                      <span className="absolute -start-1.5 top-1 text-white">
                        <PiCheckBold className="h-auto w-3" />
                      </span>
                    ) : null}
                    {label}
                  </div>
                );
              })}
            </div>
          </ShellCard>

          <ShellCard title="Customer Details" description="Billing and contact context.">
            <div className="space-y-4">
              <InfoRow label="Customer" value={order.customer} />
              <InfoRow label="Phone" value={order.customerPhone} />
              <InfoRow label="Vendor" value={order.vendor} />
              <InfoRow label="Tracking" value={order.trackingId} />
            </div>
          </ShellCard>

          <ShellCard title="Billing Address" description="Checkout billing reference.">
            <Text className="text-sm leading-7 text-gray-600">{order.deliveryAddress}</Text>
          </ShellCard>

          <ShellCard title="Shipping Address" description="Final-drop address used by the tasker and support teams.">
            <Text className="text-sm leading-7 text-gray-600">{order.deliveryAddress}</Text>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex justify-between ${strong ? "border-t border-gray-200 pt-5 text-base font-semibold" : "font-medium"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-right text-gray-900">{value}</Text>
    </div>
  );
}
