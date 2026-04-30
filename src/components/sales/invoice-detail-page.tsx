"use client";

import { QRCodeSVG } from "qrcode.react";
import { notFound } from "next/navigation";
import { Badge, Table, Text, Title } from "rizzui";
import { getSalesInvoiceById } from "@/repositories/admin/invoices";

export default function InvoiceDetailPage({ id }: { id: string }) {
  const invoice = getSalesInvoiceById(id);
  if (!invoice) notFound();

  const subtotal = parseMoney(invoice.amount) + 320;
  const shipping = 140;
  const discount = 180;
  const taxPercent = 15;
  const lineItems = invoice.items.map((item, index) => ({
    id: String(index + 1),
    title: item.label,
    description: `${invoice.customer} settlement component for ${invoice.cycle.toLowerCase()}.`,
    quantity: 1,
    unitPrice: item.amount,
    total: item.amount,
  }));

  return (
    <div className="space-y-6">
      <div className="w-full rounded-xl border border-muted p-5 text-sm sm:p-6 lg:p-8 2xl:p-10">
        <div className="mb-12 flex flex-col-reverse items-start justify-between md:mb-16 md:flex-row">
          <div className="mt-4 rounded-2xl bg-primary px-4 py-2 text-white md:mt-0">
            <Title as="h4" className="text-base font-semibold text-white">Ntumai Finance</Title>
          </div>
          <div className="mb-4 md:mb-0">
            <Badge
              variant="flat"
              className={`mb-3 rounded-2xl px-3 py-1.5 md:mb-2 ${invoice.status === "Paid" ? "bg-emerald-50 text-emerald-700" : invoice.status === "Pending" ? "bg-primary/10 text-primary" : invoice.status === "Overdue" ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}
            >
              {invoice.status}
            </Badge>
            <Title as="h6">{invoice.id}</Title>
            <Text className="mt-0.5 text-gray-500">Invoice Number</Text>
            <Text className="mt-2 max-w-xs text-xs text-gray-500">{invoice.workflow.summary}</Text>
          </div>
        </div>

        <div className="mb-12 grid gap-4 xs:grid-cols-2 sm:grid-cols-3 sm:grid-rows-1">
          <div>
            <Title as="h6" className="mb-3.5 font-semibold">From</Title>
            <Text className="mb-1.5 text-sm font-semibold uppercase">Ntumai, Inc</Text>
            <Text className="mb-1.5">Finance Operations</Text>
            <Text className="mb-1.5">
              Lusaka Operations Hub <br /> Zambia
            </Text>
            <Text className="mb-4">+260 211 555 0107</Text>
            <div>
              <Text className="mb-2 text-sm font-semibold">Creation Date</Text>
              <Text>{invoice.createdAt}</Text>
            </div>
          </div>

          <div className="mt-4 xs:mt-0">
            <Title as="h6" className="mb-3.5 font-semibold">Bill To</Title>
            <Text className="mb-1.5 text-sm font-semibold uppercase">{invoice.customer}</Text>
            <Text className="mb-1.5">{invoice.destination}</Text>
            <Text className="mb-1.5">{invoice.payoutMethod}</Text>
            <Text className="mb-4">{invoice.cycle}</Text>
            <div>
              <Text className="mb-2 text-sm font-semibold">Due Date</Text>
              <Text>{invoice.dueDate}</Text>
            </div>
          </div>

          <div className="mt-4 flex xs:mt-0 md:justify-end">
            <QRCodeSVG value={`invoice:${invoice.id}:${invoice.amount}:${invoice.customer}`} className="h-28 w-28 lg:h-32 lg:w-32" />
          </div>
        </div>

        <div className="mb-11 overflow-x-auto">
          <Table variant="modern" className="min-w-[760px]">
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
              {lineItems.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>
                    <Title as="h6" className="mb-0.5 text-sm font-medium">{item.title}</Title>
                    <Text className="max-w-[250px] overflow-hidden truncate text-sm text-gray-500">{item.description}</Text>
                  </Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell><Text className="font-medium">{item.unitPrice}</Text></Table.Cell>
                  <Table.Cell><Text className="font-medium">{item.total}</Text></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col-reverse items-start justify-between border-t border-muted pb-4 pt-8 xs:flex-row">
          <div className="mt-6 max-w-md pe-4 xs:mt-0">
            <Title as="h6" className="mb-1 text-xs font-semibold uppercase xs:mb-2 xs:text-sm">Notes</Title>
            <Text className="leading-[1.7]">{invoice.notes}</Text>
          </div>
          <div className="w-full max-w-sm">
            <Text className="flex items-center justify-between border-b border-muted pb-3.5">
              Subtotal: <Text as="span" className="font-semibold">ZMW {subtotal}</Text>
            </Text>
            <Text className="flex items-center justify-between border-b border-muted py-3.5">
              Shipping: <Text as="span" className="font-semibold">ZMW {shipping}</Text>
            </Text>
            <Text className="flex items-center justify-between border-b border-muted py-3.5">
              Discount: <Text as="span" className="font-semibold">ZMW {discount}</Text>
            </Text>
            <Text className="flex items-center justify-between border-b border-muted py-3.5">
              Taxes: <Text as="span" className="font-semibold">{taxPercent}%</Text>
            </Text>
            <Text className="flex items-center justify-between pt-4 text-base font-semibold text-gray-900">
              Total: <Text as="span">{invoice.amount}</Text>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseMoney(amount: string) {
  return Number(amount.replace(/[^\d.]/g, "").replace(/,/g, "")) || 0;
}
