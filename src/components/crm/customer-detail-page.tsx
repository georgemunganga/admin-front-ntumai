"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Badge, Button, Table, Text, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiCreditCardBold,
  PiDeviceMobileCameraBold,
  PiEnvelopeSimpleBold,
  PiMapPinBold,
  PiNotePencilBold,
  PiPhoneBold,
  PiShoppingBagBold,
  PiStarFill,
  PiTruckBold,
  PiWalletBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { getCustomerProfile } from "@/components/crm/customer-data";
import { routes } from "@/config/routes";

const coverPhotos = [
  "1648583076906-60338fa01f07",
  "1655962342982-57cae2d061cf",
];

export default function CustomerDetailPage({ id }: { id: string }) {
  const customer = getCustomerProfile(id);
  if (!customer) notFound();

  const coverId = coverPhotos[Math.abs(customer.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % coverPhotos.length];

  const personalInfoRows = [
    { label: "Country", value: "Zambia" },
    { label: "Address", value: customer.address },
    { label: "Phone", value: customer.phone },
    { label: "Company", value: customer.segment },
    { label: "Source", value: "Mobile App" },
    { label: "Grade", value: customer.status === "at_risk" ? "C" : customer.status === "review" ? "B" : "A" },
  ];

  const recentShipments = [
    { origin: customer.city, destination: "Kabulonga", date: customer.lastOrder, weight: "6 lbs / 2.7 kgs" },
    { origin: customer.city, destination: "Roma", date: "28 Apr 2026, 18:14", weight: "4 lbs / 1.8 kgs" },
    { origin: customer.city, destination: "Ibex Hill", date: "27 Apr 2026, 13:02", weight: "8 lbs / 3.6 kgs" },
  ];

  const recentPayments = [
    { date: customer.lastOrder, method: customer.paymentMethod, paidBy: "Customer", amount: customer.walletBalance === "ZMW 0" ? "ZMW 118" : "ZMW 86" },
    { date: "28 Apr 2026, 18:14", method: "Wallet + Card", paidBy: "Customer", amount: "ZMW 64" },
    { date: "27 Apr 2026, 13:02", method: "Cash on delivery", paidBy: "Recipient", amount: "ZMW 92" },
  ];

  const stats = [
    { icon: PiCreditCardBold, label: "Transactions", value: customer.lifetimeSpend },
    { icon: PiWalletBold, label: "Wallet", value: customer.walletBalance },
    { icon: PiTruckBold, label: "Shipments", value: customer.totalOrders },
    { icon: PiShoppingBagBold, label: "Completed", value: customer.completedOrders },
    { icon: PiWarningCircleBold, label: "Cancelled", value: customer.cancelledOrders },
    { icon: PiDeviceMobileCameraBold, label: "App Version", value: customer.appVersion.replace("Customer App ", "") },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={["Home", "CRM", "Customers", customer.id]}
        eyebrow="Customer CRM"
        title="Customer Profile"
        description="Template-aligned customer profile workspace adapted to Ntumai mobile app customers."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.crm.customers}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiNotePencilBold className="me-1.5 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        }
      />

      <div className="@container">
        <figure className="relative -mx-6 flex h-[150px] items-end justify-end overflow-hidden rounded-[28px] bg-gray-50 bg-gradient-to-r from-[#F8E1AF] to-[#F6CFCF] @5xl:h-[200px] 3xl:-mx-8 3xl:h-[250px] 4xl:-mx-10 4xl:h-[300px]">
          <Image
            alt="Customer cover"
            src={`https://images.unsplash.com/photo-${coverId}?auto=format&fit=crop&w=1920&q=80`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </figure>

        <section className="mt-8">
          <div className="grid items-end gap-4 @xl:grid-cols-[80px_1fr] @2xl:grid-cols-[128px_1fr] md:gap-6">
            <figure className="relative -mt-8 h-20 w-20 rounded-full border-4 border-white shadow-lg @2xl:-mt-12 @2xl:h-32 @2xl:w-32">
              <span className="absolute bottom-1.5 right-1.5 z-10 h-3 w-3 rounded-full border-2 border-white bg-[#11A849] @2xl:bottom-2.5 @2xl:right-2.5 @3xl:h-4 @3xl:w-4" />
              <Avatar
                name={customer.name}
                rounded="full"
                className="h-full w-full rounded-full"
              />
            </figure>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
              <article>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Title as="h3" className="text-lg xl:text-xl">
                    {customer.name}
                  </Title>
                  <Badge className="gap-1.5 rounded-2xl">
                    4.5/5
                    <PiStarFill className="h-4 w-4 fill-[#FFEB3C]" />
                  </Badge>
                  <CustomerStatus status={customer.status} />
                </div>
                <Text className="mt-1">
                  <a href={`mailto:${customer.email}`}>{customer.email}</a>
                </Text>
              </article>

              <article className="flex flex-wrap items-center gap-3 md:justify-end">
                <Button variant="outline" className="flex items-center gap-1 rounded-2xl">
                  <PiPhoneBold size={18} />
                  Call
                </Button>
                <Button className="flex items-center gap-1 rounded-2xl bg-primary text-white hover:bg-primary/90">
                  <PiEnvelopeSimpleBold size={18} />
                  Message
                </Button>
              </article>
            </div>
          </div>

          <div className="custom-scrollbar overflow-x-auto scroll-smooth">
            <div className="mt-8 grid min-w-[1280px] grid-cols-6 gap-5 rounded-[26px] border border-gray-200 bg-white p-6 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.24)] md:mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <Text fontWeight="medium" className="block font-lexend text-base text-gray-900">
                      {stat.value}
                    </Text>
                    <Text>{stat.label}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ShellCard
          title="Personal Information"
          className="mt-14 pb-0 lg:pb-0"
          bodyClassName="px-0 py-0"
        >
          <div className="custom-scrollbar overflow-x-auto">
            <Table variant="modern" className="min-w-[900px]">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="bg-gray-100">Field</Table.Head>
                  <Table.Head className="bg-gray-100">Value</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {personalInfoRows.map((row) => (
                  <Table.Row key={row.label}>
                    <Table.Cell>
                      <Text className="font-medium text-gray-900">{row.label}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{row.value}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </ShellCard>

        <ShellCard
          title="Recent Shipment"
          className="mb-3 mt-14 pb-0 lg:pb-0"
          bodyClassName="px-0 py-0"
        >
          <div className="custom-scrollbar overflow-x-auto">
            <Table variant="modern" className="min-w-[900px]">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="bg-gray-100">Origin</Table.Head>
                  <Table.Head className="bg-gray-100">Destination</Table.Head>
                  <Table.Head className="bg-gray-100">Date</Table.Head>
                  <Table.Head className="bg-gray-100">Weight</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentShipments.map((row, index) => (
                  <Table.Row key={`${row.origin}-${row.destination}-${index}`}>
                    <Table.Cell>{row.origin}</Table.Cell>
                    <Table.Cell>{row.destination}</Table.Cell>
                    <Table.Cell>{row.date}</Table.Cell>
                    <Table.Cell>{row.weight}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </ShellCard>

        <ShellCard
          title="Recent Payments"
          className="mb-3 mt-14 pb-0 lg:pb-0"
          bodyClassName="px-0 py-0"
        >
          <div className="custom-scrollbar overflow-x-auto">
            <Table variant="modern" className="min-w-[900px]">
              <Table.Header>
                <Table.Row>
                  <Table.Head className="bg-gray-100">Payment Date</Table.Head>
                  <Table.Head className="bg-gray-100">Payment Method</Table.Head>
                  <Table.Head className="bg-gray-100">Paid By</Table.Head>
                  <Table.Head className="bg-gray-100">Payment Amount</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentPayments.map((row, index) => (
                  <Table.Row key={`${row.date}-${index}`}>
                    <Table.Cell>{row.date}</Table.Cell>
                    <Table.Cell>{row.method}</Table.Cell>
                    <Table.Cell>{row.paidBy}</Table.Cell>
                    <Table.Cell>
                      <Text className="font-medium text-gray-900">{row.amount}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function CustomerStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status] ?? tones.queued}`}>
      {status.replace("_", " ")}
    </span>
  );
}
