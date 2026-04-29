"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Table, Text, Title } from "rizzui";
import { PiArrowLeftBold, PiDownloadSimpleBold, PiPrinterBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { routes } from "@/config/routes";
import { getLogisticsShipment } from "@/components/logistics/shipment-data";

export default function ShipmentDetailPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  const invoiceRows = [
    {
      id: "1",
      item: `${shipment.items[0]?.value ?? "Shipment"} delivery order`,
      description: `${shipment.pickup} to ${shipment.dropoff}`,
      quantity: "1",
      unitPrice: shipment.value,
      total: shipment.value,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Shipments", "Shipment Details"]}
        eyebrow="Logistics Kit"
        title="Shipment Details"
        description="Template-aligned shipment detail workspace adapted to Ntumai logistics data."
        action={
          <div className="mt-6 flex items-center gap-4 lg:mt-0">
            <Button className="w-full gap-2 rounded-2xl px-4 lg:w-auto" variant="outline">
              <PiPrinterBold className="h-4 w-4" />
              Print
            </Button>
            <Button className="w-full gap-2 rounded-2xl px-4 lg:w-auto">
              <PiDownloadSimpleBold className="h-4 w-4" />
              Download
            </Button>
          </div>
        }
      />

      <div className="mt-2 flex flex-col gap-y-6 sm:gap-y-10">
        <div className="w-full rounded-xl border border-muted p-5 text-sm sm:p-6 lg:p-8 2xl:p-10">
          <div className="mb-12 flex flex-col-reverse items-start justify-between md:mb-16 md:flex-row">
            <div className="mt-4 rounded-2xl bg-primary px-4 py-2 text-white md:mt-0">
              <Title as="h4" className="text-base font-semibold text-white">
                Ntumai Logistics
              </Title>
            </div>
            <div className="mb-4 md:mb-0">
              <Badge variant="flat" className="mb-3 rounded-2xl bg-primary/10 px-3 py-1.5 text-primary md:mb-2">
                {shipment.status.replace("_", " ")}
              </Badge>
              <Title as="h6">{shipment.id}</Title>
              <Text className="mt-0.5 text-gray-500">Shipment Reference</Text>
            </div>
          </div>

          <div className="mb-12 grid gap-4 xs:grid-cols-2 sm:grid-cols-3 sm:grid-rows-1">
            <div>
              <Title as="h6" className="mb-3.5 font-semibold">From</Title>
              <Text className="mb-1.5 text-sm font-semibold uppercase">{shipment.customer}</Text>
              <Text className="mb-1.5">{shipment.pickup}</Text>
              <Text className="mb-1.5">{shipment.customerPhone}</Text>
              <Text className="mb-4">{shipment.owner}</Text>
              <div>
                <Text className="mb-2 text-sm font-semibold">Creation Date</Text>
                <Text>{shipment.updatedAt}</Text>
              </div>
            </div>

            <div className="mt-4 xs:mt-0">
              <Title as="h6" className="mb-3.5 font-semibold">Deliver To</Title>
              <Text className="mb-1.5 text-sm font-semibold uppercase">{shipment.recipient}</Text>
              <Text className="mb-1.5">{shipment.dropoff}</Text>
              <Text className="mb-1.5">Tasker: {shipment.tasker}</Text>
              <Text className="mb-4">Tracking: {shipment.trackingId}</Text>
              <div>
                <Text className="mb-2 text-sm font-semibold">Current ETA</Text>
                <Text>{shipment.items.find((item) => item.label === "ETA")?.value ?? shipment.updatedAt}</Text>
              </div>
            </div>

            <div className="mt-4 flex xs:mt-0 sm:justify-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center">
                <div>
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tracking</Text>
                  <Text className="mt-2 font-semibold text-gray-900">{shipment.trackingId}</Text>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-11 overflow-x-auto">
            <Table variant="modern" className="min-w-[660px]">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="bg-gray-100">#</Table.Head>
                  <Table.Head className="bg-gray-100">Item</Table.Head>
                  <Table.Head className="bg-gray-100">Quantity</Table.Head>
                  <Table.Head className="bg-gray-100">Unit Price</Table.Head>
                  <Table.Head className="bg-gray-100">Total</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {invoiceRows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.id}</Table.Cell>
                    <Table.Cell>
                      <Title as="h6" className="mb-0.5 text-sm font-medium">{row.item}</Title>
                      <Text className="max-w-[250px] overflow-hidden truncate text-sm text-gray-500">{row.description}</Text>
                    </Table.Cell>
                    <Table.Cell>{row.quantity}</Table.Cell>
                    <Table.Cell><Text className="font-medium">{row.unitPrice}</Text></Table.Cell>
                    <Table.Cell><Text className="font-medium">{row.total}</Text></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="flex flex-col-reverse items-start justify-between border-t border-muted pb-4 pt-8 xs:flex-row">
            <div className="mt-6 max-w-md pe-4 xs:mt-0">
              <Title as="h6" className="mb-1 text-xs font-semibold uppercase xs:mb-2 xs:text-sm">Notes</Title>
              <Text className="leading-[1.7]">{shipment.notes}</Text>
            </div>
            <div className="w-full max-w-sm">
              <Text className="flex items-center justify-between border-b border-muted pb-3.5">
                Subtotal: <Text as="span" className="font-semibold">{shipment.value}</Text>
              </Text>
              <Text className="flex items-center justify-between border-b border-muted py-3.5">
                Shipping: <Text as="span" className="font-semibold">Included</Text>
              </Text>
              <Text className="flex items-center justify-between border-b border-muted py-3.5">
                Tracking: <Text as="span" className="font-semibold">{shipment.trackingId}</Text>
              </Text>
              <Text className="flex items-center justify-between border-b border-muted py-3.5">
                Tasker: <Text as="span" className="font-semibold">{shipment.tasker}</Text>
              </Text>
              <Text className="flex items-center justify-between pt-4 text-base font-semibold text-gray-900">
                Total: <Text as="span">{shipment.value}</Text>
              </Text>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ShellCard title="Delivery Details" description="Operational lane and parcel data.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoTile label="Lane" value={shipment.lane} />
              <InfoTile label="Owner" value={shipment.owner} />
              <InfoTile label="Tasker" value={shipment.tasker} />
              <InfoTile label="Value" value={shipment.value} />
            </div>
          </ShellCard>

          <ShellCard title="Tracking History" description="Latest shipment events.">
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

          <ShellCard title="Shipping Details" description="Package and route markers.">
            <div className="space-y-3">
              {shipment.items.map((item) => (
                <InfoRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </ShellCard>

          <ShellCard title="Addresses" description="Pickup and drop-off references.">
            <div className="space-y-3">
              <InfoRow label="Pickup" value={shipment.pickup} />
              <InfoRow label="Drop-off" value={shipment.dropoff} />
              <InfoRow label="Customer phone" value={shipment.customerPhone} />
              <InfoRow label="Recipient" value={shipment.recipient} />
            </div>
          </ShellCard>
        </div>

        <div className="flex justify-start">
          <Link href={routes.logistics.shipments}>
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiArrowLeftBold className="me-1.5 h-4 w-4" />
              Back to Shipments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Title as="h4" className="mt-2 text-base font-semibold text-gray-900">{value}</Title>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 px-4 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-right text-sm font-semibold text-gray-900">{value}</Text>
    </div>
  );
}
