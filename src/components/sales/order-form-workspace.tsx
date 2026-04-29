"use client";

import Link from "next/link";
import { Badge, Button, Checkbox, Input, Select, Text, Textarea, Title } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import type { SalesOrder } from "@/components/sales/order-data";

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
  { label: "Wallet + card", value: "Wallet + card" },
  { label: "Cash on delivery", value: "Cash on delivery" },
];

const statusOptions = [
  { label: "Live", value: "live" },
  { label: "Stable", value: "stable" },
  { label: "Review", value: "review" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Queued", value: "queued" },
  { label: "At risk", value: "at_risk" },
];

type OrderFormWorkspaceProps = {
  mode: "create" | "edit";
  order?: SalesOrder;
};

export default function OrderFormWorkspace({
  mode,
  order,
}: OrderFormWorkspaceProps) {
  const orderNumber = order?.orderNumber ?? "#MK-90015";
  const customer = order?.customer ?? "Mwaka Tembo";
  const customerPhone = order?.customerPhone ?? "+260 97 300 1142";
  const vendor = order?.vendor ?? "Green Basket Market";
  const address = order?.deliveryAddress ?? "Plot 12, Addis Ababa Drive, Roma, Lusaka";
  const city = order?.city ?? "Lusaka";
  const fulfillment = order?.fulfillment ?? "Same-day";
  const paymentState = order?.paymentState ?? "Paid";
  const paymentMethod = order?.paymentMethod ?? "Wallet + card";
  const itemCount = order?.itemCount ?? "3 items";
  const subtotal = order?.subtotal ?? "ZMW 355";
  const deliveryFee = order?.deliveryFee ?? "ZMW 40";
  const tax = order?.tax ?? "ZMW 17";
  const totalAmount = order?.totalAmount ?? "ZMW 412";
  const summary =
    order?.summary ??
    "Produce order created from checkout with delivery address, payment method, and fees ready for vendor acceptance.";
  const status = order?.status ?? "live";
  const backHref = mode === "edit" && order ? routes.sales.orderDetails(order.slug) : routes.sales.orders;

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Orders", ...(mode === "edit" && order ? [order.id, "Edit"] : ["Create"])]}
        eyebrow="Sales Kit"
        title={mode === "edit" ? `Edit ${orderNumber}` : "Create Order"}
        description="Use the archived ecommerce checkout layout, then align the billing, shipping, and order-summary content to Ntumai marketplace and delivery operations."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={backHref}>
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
              {mode === "edit" ? "Update Order" : "Create Order"}
            </Button>
          </div>
        }
      />

      <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="flex-grow space-y-6 @5xl:col-span-8 @5xl:pb-10 @6xl:col-span-7">
          <ShellCard title="Billing Information" description="Primary payer and merchant-facing order details.">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Customer" rounded="lg" defaultValue={customer} />
              <Input label="Customer phone" rounded="lg" defaultValue={customerPhone} />
              <Input label="Vendor" rounded="lg" defaultValue={vendor} />
              <Input label="City" rounded="lg" defaultValue={city} />
              <Input label="Order number" rounded="lg" defaultValue={orderNumber} />
              <Input label="Tracking ID" rounded="lg" defaultValue={order?.trackingId ?? "TRK-90015-LSK"} />
              <SelectField label="Fulfillment" options={fulfillmentOptions} value={fulfillment} />
              <SelectField label="Payment method" options={paymentMethodOptions} value={paymentMethod} />
            </div>
          </ShellCard>

          <ShellCard title="Shipping Information" description="Delivery address and final-drop context from the customer checkout flow.">
            <div className="space-y-4">
              <Checkbox
                label={<span className="text-sm text-gray-700">Use billing information for shipping</span>}
                defaultChecked
                size="sm"
                className="[&_svg]:top-0"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Recipient name" rounded="lg" defaultValue={customer} />
                <Input label="Recipient phone" rounded="lg" defaultValue={customerPhone} />
                <Input label="District / city" rounded="lg" defaultValue={city} />
                <Input label="Landmark" rounded="lg" defaultValue="Main gate or building note" />
              </div>
              <Textarea
                label="Shipping address"
                textareaClassName="rounded-2xl"
                defaultValue={address}
              />
            </div>
          </ShellCard>

          <ShellCard title="Order Note" description="Freeform customer, support, or vendor instruction block carried through the order flow.">
            <Textarea
              label="Notes about order"
              textareaClassName="rounded-2xl"
              defaultValue={summary}
            />
          </ShellCard>
        </div>

        <div className="space-y-6 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <ShellCard title="Customer Info" description="Checkout-side context.">
            <div className="space-y-4">
              <InfoRow label="Customer" value={customer} />
              <InfoRow label="Contact" value={customerPhone} />
              <InfoRow label="Vendor" value={vendor} />
              <InfoRow label="Order items" value={itemCount} />
              <InfoRow label="Status" value={status.replace("_", " ")} />
            </div>
          </ShellCard>

          <ShellCard title="Order Summary" description="Sticky checkout summary adapted to Ntumai totals.">
            <div className="space-y-5">
              <div className="rounded-[22px] border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="text-sm text-gray-500">Payment state</Text>
                  <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                    {paymentState}
                  </Badge>
                </div>
                <Title as="h3" className="mt-3 text-2xl font-semibold tracking-tight">
                  {totalAmount}
                </Title>
                <Text className="mt-1 text-sm text-gray-500">Total payable including fees and tax</Text>
              </div>
              <InfoRow label="Subtotal" value={subtotal} />
              <InfoRow label="Delivery fee" value={deliveryFee} />
              <InfoRow label="Tax" value={tax} />
              <InfoRow label="Fulfillment" value={fulfillment} />
              <InfoRow label="Payment method" value={paymentMethod} />
              <SelectField label="Order status" options={statusOptions} value={status} />
              <SelectField label="Payment state" options={paymentStateOptions} value={paymentState} />
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <Select
      label={label}
      options={options}
      defaultValue={options.find((option) => option.value === value) ?? options[0]}
      selectClassName="rounded-2xl"
    />
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
