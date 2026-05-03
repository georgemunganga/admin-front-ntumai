"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Checkbox, Input, Select, Text, Textarea } from "rizzui";
import { PiArrowLeftBold, PiFloppyDiskBold, PiUploadBold } from "react-icons/pi";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import type { LogisticsShipment } from "@/components/logistics/shipment-data";
import {
  createAdminShipment,
  updateAdminShipment,
} from "@/repositories/admin/shipments";

const formSections = [
  { id: "shipping-info", label: "Shipping Info" },
  { id: "sender-info", label: "Sender Info" },
  { id: "recipient-info", label: "Recipients Info" },
  { id: "payment-method", label: "Payment Method" },
  { id: "package-information", label: "Package Information" },
] as const;

const countryOptions = [
  { label: "Zambia", value: "zambia" },
  { label: "Malawi", value: "malawi" },
  { label: "Tanzania", value: "tanzania" },
];

const agencyOptions = [
  { label: "Ntumai Logistics", value: "ntumai_logistics" },
  { label: "Ntumai Marketplace", value: "ntumai_marketplace" },
  { label: "Ntumai Errands", value: "ntumai_errands" },
];

const officeOptions = [
  { label: "Lusaka Dispatch Hub", value: "lusaka_dispatch_hub" },
  { label: "Kitwe Operations Desk", value: "kitwe_operations_desk" },
  { label: "Copperbelt Market Hub", value: "copperbelt_market_hub" },
];

const shippingMethodOptions = [
  { label: "Same-day delivery", value: "same_day" },
  { label: "Scheduled delivery", value: "scheduled" },
  { label: "Return collection", value: "return_collection" },
];

const packagingTypeOptions = [
  { label: "Groceries crate", value: "groceries_crate" },
  { label: "Express satchel", value: "express_satchel" },
  { label: "Household bundle", value: "household_bundle" },
];

const courierOptions = [
  { label: "Tasker dispatch pool", value: "tasker_dispatch_pool" },
  { label: "Marketplace rider lane", value: "marketplace_rider_lane" },
  { label: "Returns recovery team", value: "returns_recovery_team" },
];

const deliveryTimeOptions = [
  { label: "Within 15 minutes", value: "15_minutes" },
  { label: "Within 30 minutes", value: "30_minutes" },
  { label: "Customer-scheduled slot", value: "scheduled_slot" },
];

const paidByOptions = [
  { label: "Customer", value: "customer" },
  { label: "Merchant", value: "merchant" },
  { label: "Ntumai support", value: "ntumai_support" },
];

const paymentMethodOptions = [
  { label: "Mobile money", value: "mobile_money" },
  { label: "Wallet balance", value: "wallet" },
  { label: "Cash on delivery", value: "cash" },
  { label: "Card transfer", value: "card" },
];

type ShipmentFormWorkspaceProps = {
  mode: "create" | "edit";
  shipment?: LogisticsShipment;
};

export default function ShipmentFormWorkspace({
  mode,
  shipment,
}: ShipmentFormWorkspaceProps) {
  const router = useRouter();
  const { guardAction } = useAdminActionGuard();
  const shipmentId = shipment?.id ?? "SHP-50013";
  const trackingId = shipment?.trackingId ?? "TRK-50013-LSK";
  const customer = shipment?.customer ?? "Mwaka Tembo";
  const customerPhone = shipment?.customerPhone ?? "+260 97 300 1142";
  const recipient = shipment?.recipient ?? "Mwila Household";
  const pickup = shipment?.pickup ?? "Roma, Lusaka";
  const dropoff = shipment?.dropoff ?? "Kabulonga, Lusaka";
  const lane = shipment?.lane ?? "CBD dispatch lane";
  const owner = shipment?.owner ?? "Dispatch ops";
  const notes =
    shipment?.notes ?? "Same-day neighborhood shipment created from a completed marketplace order.";
  const value = shipment?.value ?? "ZMW 118";
  const tasker = shipment?.tasker ?? "Unassigned";
  const packageType = shipment?.items[0]?.value ?? "Groceries";
  const packageWeight = shipment?.items[1]?.value ?? "6kg";
  const eta = shipment?.items[2]?.value ?? "14 min";
  const updatedAt = shipment?.updatedAt ?? "Just now";
  const title = mode === "edit" ? `Edit ${shipmentId}` : "Create Shipment";
  const description =
    "Use the Isomorphic shipment form structure, then align sender, routing, payment, and package details to Ntumai delivery flows.";
  const backHref =
    mode === "edit" ? routes.logistics.shipmentDetails(shipmentId) : routes.logistics.shipments;
  const [form, setForm] = useState({
    country: "zambia",
    agency: "ntumai_logistics",
    officeOrigin: "lusaka_dispatch_hub",
    shippingMethod: shipment?.status === "queued" ? "scheduled" : "same_day",
    packageType: mapPackageType(packageType),
    courierLane: mapCourier(lane),
    deliveryTime: shipment?.status === "queued" ? "scheduled_slot" : "15_minutes",
    senderName: customer,
    senderAddress: pickup,
    senderEmail: toEmail(customer),
    senderPhone: customerPhone,
    recipientName: recipient,
    recipientAddress: dropoff,
    recipientEmail: toEmail(recipient),
    recipientPhone: customerPhone,
    paidBy: "customer",
    paymentMethod: "mobile_money",
    amount: value.replace("ZMW ", ""),
    packageWeight,
    notes,
    giftFrom: customer,
    giftTo: recipient,
    giftMessage: `Tracking: ${trackingId}. Lane: ${lane}. Assigned tasker: ${tasker}. Updated ${updatedAt}. ETA: ${eta}.`,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setForm({
      country: "zambia",
      agency: "ntumai_logistics",
      officeOrigin: "lusaka_dispatch_hub",
      shippingMethod: shipment?.status === "queued" ? "scheduled" : "same_day",
      packageType: mapPackageType(packageType),
      courierLane: mapCourier(lane),
      deliveryTime: shipment?.status === "queued" ? "scheduled_slot" : "15_minutes",
      senderName: customer,
      senderAddress: pickup,
      senderEmail: toEmail(customer),
      senderPhone: customerPhone,
      recipientName: recipient,
      recipientAddress: dropoff,
      recipientEmail: toEmail(recipient),
      recipientPhone: customerPhone,
      paidBy: "customer",
      paymentMethod: "mobile_money",
      amount: value.replace("ZMW ", ""),
      packageWeight,
      notes,
      giftFrom: customer,
      giftTo: recipient,
      giftMessage: `Tracking: ${trackingId}. Lane: ${lane}. Assigned tasker: ${tasker}. Updated ${updatedAt}. ETA: ${eta}.`,
    });
  }, [
    customer,
    customerPhone,
    dropoff,
    eta,
    lane,
    notes,
    packageType,
    packageWeight,
    pickup,
    recipient,
    shipment?.status,
    tasker,
    trackingId,
    updatedAt,
    value,
  ]);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      const payload = {
        senderName: form.senderName.trim(),
        senderEmail: form.senderEmail.trim(),
        senderPhone: form.senderPhone.trim(),
        pickupAddress: form.senderAddress.trim(),
        recipientName: form.recipientName.trim(),
        recipientEmail: form.recipientEmail.trim(),
        recipientPhone: form.recipientPhone.trim(),
        dropoffAddress: form.recipientAddress.trim(),
        country: form.country,
        agency: form.agency,
        officeOrigin: form.officeOrigin,
        shippingMethod: form.shippingMethod,
        packageType: form.packageType,
        courierLane: form.courierLane,
        deliveryTime: form.deliveryTime,
        paidBy: form.paidBy,
        paymentMethod: form.paymentMethod,
        amount: Number(form.amount) || 0,
        packageWeight: form.packageWeight.trim(),
        notes: form.notes.trim(),
        giftOption: "gift_wrap",
        giftFrom: form.giftFrom.trim(),
        giftTo: form.giftTo.trim(),
        giftMessage: form.giftMessage.trim(),
        isScheduled: form.shippingMethod === "scheduled",
        status: form.shippingMethod === "scheduled" ? "booked" : "delivery",
      };

      const result =
        mode === "create"
          ? await createAdminShipment(payload)
          : await updateAdminShipment(shipment!.id, payload);

      const nextId = result?.item?.id ?? shipment?.id;
      setFeedback({
        type: "success",
        message:
          mode === "create"
            ? "Shipment created successfully."
            : "Shipment updated successfully.",
      });
      if (nextId) {
        router.push(routes.logistics.shipmentDetails(nextId));
        router.refresh();
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to save shipment.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Shipments", ...(mode === "edit" ? [shipmentId, "Edit"] : ["Create"])]}
        eyebrow="Logistics Kit"
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={backHref}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot save shipment drafts from this logistics surface.",
                )
              }
            >
              Save Draft
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
              isLoading={isSaving}
              onClick={() =>
                void guardAction(
                  "write",
                  handleSave,
                  "Your staff role cannot create or update shipments from this logistics surface.",
                )
              }
            >
              <PiFloppyDiskBold className="me-1.5 h-4 w-4" />
              {mode === "edit" ? "Update Shipment" : "Create Shipment"}
            </Button>
          </div>
        }
      />

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="sticky top-[68px] z-20 border-b border-gray-300 bg-white/95 py-0 backdrop-blur @2xl:top-[72px] 2xl:top-20">
        <div className="custom-scrollbar overflow-x-auto scroll-smooth">
          <div className="inline-grid grid-flow-col gap-5 md:gap-7 lg:gap-10">
            {formSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="relative whitespace-nowrap py-4 text-sm font-medium text-gray-500 transition hover:text-gray-900"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
        <FormSection
          id="shipping-info"
          title="Shipping Info"
          description="Add the shipment lane, market, and dispatch timing details used by Ntumai routing."
        >
          <SelectField label="Country Name" options={countryOptions} value={form.country} onChange={(value) => setForm((current) => ({ ...current, country: value }))} />
          <SelectField label="Agency List" options={agencyOptions} value={form.agency} onChange={(value) => setForm((current) => ({ ...current, agency: value }))} />
          <SelectField label="Office Origin" options={officeOptions} value={form.officeOrigin} onChange={(value) => setForm((current) => ({ ...current, officeOrigin: value }))} />
          <SelectField label="Shipping Method" options={shippingMethodOptions} value={form.shippingMethod} onChange={(value) => setForm((current) => ({ ...current, shippingMethod: value }))} />
          <SelectField
            label="Packaging Type"
            options={packagingTypeOptions}
            value={form.packageType}
            onChange={(value) => setForm((current) => ({ ...current, packageType: value }))}
          />
          <SelectField label="Courier Company" options={courierOptions} value={form.courierLane} onChange={(value) => setForm((current) => ({ ...current, courierLane: value }))} />
          <SelectField
            label="Delivery Time"
            options={deliveryTimeOptions}
            value={form.deliveryTime}
            onChange={(value) => setForm((current) => ({ ...current, deliveryTime: value }))}
          />
          <UploadTile />
        </FormSection>

        <FormSection
          id="sender-info"
          title="Sender's Info"
          description="Use the marketplace order owner, customer, or internal desk that originated the shipment."
        >
          <Input label="Name" rounded="lg" value={form.senderName} onChange={(event) => setForm((current) => ({ ...current, senderName: event.target.value }))} />
          <Input label="Address" rounded="lg" value={form.senderAddress} onChange={(event) => setForm((current) => ({ ...current, senderAddress: event.target.value }))} />
          <Input label="Email" rounded="lg" value={form.senderEmail} onChange={(event) => setForm((current) => ({ ...current, senderEmail: event.target.value }))} />
          <Input label="Phone Number" rounded="lg" value={form.senderPhone} onChange={(event) => setForm((current) => ({ ...current, senderPhone: event.target.value }))} />
          <div className="col-span-full">
            <Checkbox
              label={<span className="text-sm text-gray-700">Notify via SMS</span>}
              defaultChecked
              size="sm"
              className="-mt-2 [&_svg]:top-0"
            />
          </div>
        </FormSection>

        <FormSection
          id="recipient-info"
          title="Recipient's Info"
          description="Capture the final customer, store handoff point, or returns destination receiving this shipment."
        >
          <Input label="Name" rounded="lg" value={form.recipientName} onChange={(event) => setForm((current) => ({ ...current, recipientName: event.target.value }))} />
          <Input label="Address" rounded="lg" value={form.recipientAddress} onChange={(event) => setForm((current) => ({ ...current, recipientAddress: event.target.value }))} />
          <Input label="Email" rounded="lg" value={form.recipientEmail} onChange={(event) => setForm((current) => ({ ...current, recipientEmail: event.target.value }))} />
          <Input label="Phone Number" rounded="lg" value={form.recipientPhone} onChange={(event) => setForm((current) => ({ ...current, recipientPhone: event.target.value }))} />
          <div className="col-span-full">
            <Checkbox
              label={<span className="text-sm text-gray-700">Notify via SMS</span>}
              defaultChecked
              size="sm"
              className="-mt-2 [&_svg]:top-0"
            />
          </div>
        </FormSection>

        <FormSection
          id="payment-method"
          title="Payment Method Info"
          description="Settle the shipment against mobile money, wallet, card, or cash collection rules."
        >
          <SelectField label="Paid By" options={paidByOptions} value={form.paidBy} onChange={(value) => setForm((current) => ({ ...current, paidBy: value }))} />
          <SelectField label="Payment Method" options={paymentMethodOptions} value={form.paymentMethod} onChange={(value) => setForm((current) => ({ ...current, paymentMethod: value }))} />
          <div className="col-span-full grid gap-4 @lg:grid-cols-2">
            <PaymentOption
              title="Pay Now"
              detail="Collect upfront with wallet, mobile money, or card."
              active={shipment?.status !== "queued"}
            />
            <PaymentOption
              title="Pay Later"
              detail="Collect during handoff or after support approval."
              active={shipment?.status === "queued"}
            />
          </div>
          <Input label="Payee Name" rounded="lg" value={form.senderName} onChange={(event) => setForm((current) => ({ ...current, senderName: event.target.value }))} />
          <SelectField label="Country" options={countryOptions} value={form.country} onChange={(value) => setForm((current) => ({ ...current, country: value }))} />
          <Input label="City" rounded="lg" value={extractCity(form.senderAddress)} readOnly />
          <Input label="Street Address" rounded="lg" value={form.senderAddress} onChange={(event) => setForm((current) => ({ ...current, senderAddress: event.target.value }))} />
        </FormSection>

        <FormSection
          id="package-information"
          title="Package Information"
          description="Describe the parcel, grocery bundle, return, or marketplace order being moved through this lane."
        >
          <Input label="Amount" rounded="lg" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
          <div className="col-span-full grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Input label="Width" rounded="lg" defaultValue="24cm" />
            <Input label="Height" rounded="lg" defaultValue="18cm" />
            <Input label="Length" rounded="lg" defaultValue="32cm" />
            <Input label="Weight" rounded="lg" value={form.packageWeight} onChange={(event) => setForm((current) => ({ ...current, packageWeight: event.target.value }))} />
          </div>
          <Textarea
            label="Package Description"
            textareaClassName="rounded-2xl"
            className="col-span-full"
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          />
          <UploadTile label="Package attachment" />
          <div className="col-span-full rounded-[22px] border border-gray-200 bg-gray-50/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Gift / Care option
                </Text>
                <Text className="mt-2 text-base font-semibold text-gray-900">
                  Add packaging or message instructions
                </Text>
                <Text className="mt-1 text-sm leading-6 text-gray-500">
                  Use this only when a marketplace order needs wrapping, note handling, or a careful handoff.
                </Text>
              </div>
              <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                Optional
              </Badge>
            </div>
          </div>
          <div className="col-span-full grid gap-4 @lg:grid-cols-2">
            <PaymentOption title="Gift Wrap" detail="Flag the package for careful presentation and protected packing." active />
            <PaymentOption title="Write A Message" detail="Include a customer note or delivery instruction in the handoff." />
          </div>
          <Input label="From" rounded="lg" value={form.giftFrom} onChange={(event) => setForm((current) => ({ ...current, giftFrom: event.target.value }))} />
          <Input label="To" rounded="lg" value={form.giftTo} onChange={(event) => setForm((current) => ({ ...current, giftTo: event.target.value }))} />
          <Textarea
            label="Message"
            textareaClassName="rounded-2xl"
            className="col-span-full"
            value={form.giftMessage}
            onChange={(event) => setForm((current) => ({ ...current, giftMessage: event.target.value }))}
          />
        </FormSection>
      </div>
    </div>
  );
}

function FormSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="grid scroll-mt-40 gap-5 pt-7 first:pt-0 @3xl:grid-cols-12 @2xl:pt-9 @3xl:pt-11">
      <div className="col-span-full @4xl:col-span-4">
        <h4 className="text-base font-medium text-gray-900">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <div className="col-span-full grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
        {children}
      </div>
    </section>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <Select
      label={label}
      options={options}
      defaultValue={options.find((option) => option.value === value) ?? options[0]}
      onChange={(option: any) => onChange?.(option?.value ?? "")}
      selectClassName="rounded-2xl"
    />
  );
}

function UploadTile({ label = "Shipping attachment" }: { label?: string }) {
  const { guardAction } = useAdminActionGuard();
  return (
    <div className="col-span-full rounded-[22px] border border-dashed border-gray-300 bg-gray-50/70 p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white p-3 text-gray-900 shadow-sm ring-1 ring-gray-200">
          <PiUploadBold className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <Text className="font-semibold text-gray-900">{label}</Text>
          <Text className="mt-1 text-sm leading-6 text-gray-500">
            Upload delivery proof, package notes, or shipment paperwork that operations and support may need later.
          </Text>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-2xl px-4"
              onClick={() =>
                void guardAction(
                  "write",
                  () => undefined,
                  "Your staff role cannot upload shipment attachments from this logistics surface.",
                )
              }
            >
              Upload file
            </Button>
            <Badge variant="flat" className="rounded-2xl bg-gray-900 px-3 py-1.5 text-white">
              JPG, PNG, PDF
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({
  title,
  detail,
  active = false,
}: {
  title: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border px-5 py-4 transition ${
        active
          ? "border-primary/30 bg-primary/[0.07] ring-1 ring-primary/20"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <Text className="font-medium text-gray-900">{title}</Text>
        {active ? (
          <Badge variant="flat" className="rounded-2xl bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
            Selected
          </Badge>
        ) : null}
      </div>
      <Text className="mt-2 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function mapPackageType(value: string) {
  switch (value) {
    case "Groceries":
      return "groceries_crate";
    case "Household bundle":
      return "household_bundle";
    default:
      return "express_satchel";
  }
}

function mapCourier(value: string) {
  if (value.toLowerCase().includes("return")) return "returns_recovery_team";
  if (value.toLowerCase().includes("market")) return "marketplace_rider_lane";
  return "tasker_dispatch_pool";
}

function extractCity(value: string) {
  return value.split(",")[1]?.trim() ?? "Lusaka";
}

function toEmail(value: string) {
  return `${value.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "")}@ntumai.app`;
}
