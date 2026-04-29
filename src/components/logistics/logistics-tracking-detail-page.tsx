"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Input, Text, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiCheckCircle,
  PiCopySimple,
  PiEnvelopeSimpleBold,
  PiMoped,
  PiPackageFill,
  PiTriangle,
  PiTruckTrailerBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import {
  type LogisticsShipment,
  getLogisticsShipment,
} from "@/components/logistics/shipment-data";
import { routes } from "@/config/routes";

export default function LogisticsTrackingDetailPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();
  const [copied, setCopied] = useState(false);

  const packageType =
    shipment.items.find((item) => item.label === "Package type")?.value ?? "Shipment";
  const weight = shipment.items.find((item) => item.label === "Weight")?.value ?? "Not set";
  const eta = shipment.items.find((item) => item.label === "ETA")?.value ?? shipment.updatedAt;
  const update = getLatestUpdate(shipment);
  const shipmentInfo = getShipmentInfo(shipment, packageType, weight, eta);
  const overviewTimeline = buildOverviewTimeline(shipment);
  const historyTimeline = buildHistoryTimeline(shipment);

  return (
    <div className="space-y-10">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Tracking", id]}
        eyebrow="Logistics Kit"
        title="Tracking"
        description="Tracking detail page ported closer to the archived logistics template, then relabeled for Ntumai shipment, tasker, and customer tracking flows."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.logistics.tracking}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.logistics.shipmentDetails(shipment.id)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                Open Shipment
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:gap-20">
        <div>
          <Text className="mb-2 text-gray-700">Tracking Number:</Text>
          <Title as="h2" className="mb-3 text-2xl font-bold text-gray-700 3xl:text-3xl">
            {shipment.trackingId}
          </Title>

          <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button
              variant="text"
              className="inline-flex h-auto w-auto items-center gap-1 px-0 py-0 font-normal"
              onClick={async () => {
                await navigator.clipboard.writeText(shipment.trackingId);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
            >
              <PiCopySimple className="h-5 w-5" />
              <Text as="span" className="text-gray-700">
                {copied ? "Copied" : "Copy tracking code"}
              </Text>
            </Button>
            <Text className="inline-flex items-center gap-1">
              <PiMoped className="h-5 w-5" />
              <Text as="span" className="text-gray-700">
                Dispatch lane: {shipment.lane}
              </Text>
            </Text>
          </div>

          <div className="max-w-[505px] rounded-lg border border-l-4 border-primary bg-primary/5 p-7">
            <Title as="h3" className="mb-3 text-xl font-semibold text-gray-900">
              Latest Update
            </Title>
            <Text className="mb-2 text-gray-500 md:text-base md:leading-relaxed">
              {update.text}{" "}
              <Text as="span" className="font-semibold text-gray-700">
                {update.highlight}
              </Text>
            </Text>
          </div>

          <div className="mt-10">
            <Text className="mb-3">
              Add an operations watcher email if support, dispatch, or merchant ops should receive the next movement update automatically.
            </Text>
            <div className="flex w-full max-w-3xl items-start gap-4">
              <Input
                rounded="lg"
                placeholder="ops@ntumai.com"
                inputClassName="w-full text-base"
                size="lg"
                className="flex-grow"
              />
              <Button type="button" className="w-full max-w-[118px] flex-shrink-0 rounded-lg" size="lg">
                <PiEnvelopeSimpleBold className="me-1.5 h-4 w-4" />
                Watch
              </Button>
            </div>
          </div>
        </div>

        <div className="@container">
          <TimelineList data={overviewTimeline} showTravelHistory />
        </div>
      </div>

      <TrackingSection title="Shipping Information">
        {shipmentInfo.map((group) => (
          <div
            className="my-10 flex gap-4 last:mb-3"
            key={group.title}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {group.icon}
            </span>
            <div className="flex flex-col gap-y-3">
              <Title as="h3" className="text-base font-semibold">
                {group.title}
              </Title>
              {group.data.map((info) => (
                <div className="flex flex-col sm:flex-row sm:items-center" key={info.name}>
                  <Title
                    as="h4"
                    className="text-sm font-normal capitalize text-gray-700 sm:min-w-[244px] md:min-w-[424px]"
                  >
                    {info.name}:
                  </Title>
                  <Text className="gap-3 text-sm text-gray-500">{info.value}</Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </TrackingSection>

      <TrackingSection title="Tracking History">
        <div id="tracking-history">
          <TimelineList data={historyTimeline} />
        </div>
      </TrackingSection>
    </div>
  );
}

function TrackingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-0 rounded-[28px] border border-gray-200 bg-white py-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)] md:py-7 lg:mx-2">
      <div className="flex items-center justify-between px-5 text-left font-semibold text-gray-700 sm:px-7 lg:px-8">
        <span className="font-lexend text-xl">{title}</span>
      </div>
      <div className="px-5 sm:px-7 lg:px-8">{children}</div>
    </section>
  );
}

function TimelineList({
  data,
  showTravelHistory = false,
}: {
  data: Array<{
    title: string;
    text: string;
    highlightedText: string;
    date: string;
    time: string;
    icon?: React.ReactNode;
    status?: string;
  }>;
  showTravelHistory?: boolean;
}) {
  return (
    <div className="relative @container">
      {data.map((timeline, index) => (
        <div className="flex items-center" key={`${timeline.title}-${timeline.date}-${timeline.time}`}>
          <div className="hidden w-[147px] flex-shrink-0 @lg:block">
            <Text as="span" className="pe-5 text-gray-500 @2xl:pe-10">
              {timeline.date}
            </Text>
          </div>
          <div
            className={`relative flex-grow border-s border-gray-200 py-5 ps-10 before:absolute before:-left-[3px] before:-top-[3px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-gray-200 before:content-[''] ${
              index !== 0 ? "before:hidden" : ""
            } ${index === data.length - 1 ? "before:-bottom-[3px] before:top-auto before:block" : ""}`}
          >
            <span className="absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white">
              {timeline.icon ? timeline.icon : <PiTriangle className="h-5 w-5" />}
            </span>
            <Title
              as="h3"
              className={`mb-3 flex items-center text-base font-semibold ${
                timeline.status === "success" ? "text-emerald-600" : "text-gray-900"
              }`}
            >
              {timeline.title}
            </Title>
            <div className="relative -ms-10">
              <div className="ps-10">
                <Text className="text-sm font-normal leading-loose text-gray-500">
                  {timeline.text}
                  {timeline.highlightedText ? (
                    <Text as="span" className="block font-medium text-gray-700">
                      {timeline.highlightedText}
                    </Text>
                  ) : null}{" "}
                  {`${timeline.date} ${timeline.time}`}
                </Text>
              </div>
            </div>
          </div>
        </div>
      ))}

      {showTravelHistory ? (
        <div className="flex items-center">
          <div className="hidden w-[147px] flex-shrink-0 @lg:block" />
          <a
            href="#tracking-history"
            className="ms-10 mt-10 flex flex-grow cursor-pointer items-center gap-3 text-sm font-medium text-gray-900"
          >
            View full movement history
          </a>
        </div>
      ) : null}
    </div>
  );
}

function getLatestUpdate(shipment: LogisticsShipment) {
  const latest = shipment.timeline[shipment.timeline.length - 1];
  return {
    text: `${latest?.detail ?? shipment.notes} Destination currently tracked at `,
    highlight: shipment.dropoff,
  };
}

function buildOverviewTimeline(shipment: LogisticsShipment) {
  return [...shipment.timeline]
    .slice()
    .reverse()
    .map((item, index) => ({
      title: item.label,
      text: item.detail,
      highlightedText: index === 0 ? shipment.dropoff : "",
      date: "Today",
      time: item.time,
      icon: index === 0 ? <PiCheckCircle className="h-6 w-6 text-emerald-600" /> : undefined,
      status: index === 0 ? "success" : "",
    }));
}

function buildHistoryTimeline(shipment: LogisticsShipment) {
  return shipment.timeline.map((item, index) => ({
    title: item.label,
    text: item.detail,
    highlightedText: index === shipment.timeline.length - 1 ? shipment.dropoff : "",
    date: index === 0 ? "Order day" : "Today",
    time: item.time,
    icon:
      index === shipment.timeline.length - 1 ? (
        <PiCheckCircle className="h-6 w-6 text-emerald-600" />
      ) : undefined,
    status: index === shipment.timeline.length - 1 ? "success" : "",
  }));
}

function getShipmentInfo(
  shipment: LogisticsShipment,
  packageType: string,
  weight: string,
  eta: string,
) {
  return [
    {
      title: "Shipment Overview",
      icon: <PiPackageFill className="h-6 w-6 text-primary" />,
      data: [
        { name: "Tracking Number", value: shipment.trackingId },
        { name: "Destination", value: shipment.dropoff },
        { name: "Last Ops Update", value: shipment.updatedAt },
        { name: "Customer ETA", value: `${eta} expected window` },
        { name: "Delivery State", value: shipment.status === "stable" ? "Delivered" : "Still in movement" },
      ],
    },
    {
      title: "Services",
      icon: <PiTruckTrailerBold className="h-5 w-6 text-primary" />,
      data: [
        { name: "Service", value: shipment.lane },
        { name: "Terms", value: shipment.owner },
        { name: "Special Handling Section", value: packageType },
      ],
    },
    {
      title: "Package Details",
      icon: <PiMoped className="h-5 w-5 text-primary" />,
      data: [
        { name: "Weight", value: weight },
        { name: "Dimensions", value: "Sized for Ntumai same-day handling" },
        { name: "Total Pieces", value: "1" },
        { name: "Total Shipment Weight", value: weight },
        { name: "Packaging", value: packageType },
      ],
    },
  ];
}
