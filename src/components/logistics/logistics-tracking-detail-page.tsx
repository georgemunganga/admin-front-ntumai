"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Text, Title } from "rizzui";
import {
  PiArrowLeftBold,
  PiClockCountdownBold,
  PiCopyBold,
  PiMapPinAreaBold,
  PiMapPinLineBold,
  PiPackageBold,
  PiPhoneCallBold,
  PiRoadHorizonBold,
  PiShieldCheckBold,
  PiUserCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import {
  type LogisticsShipment,
  getLogisticsShipment,
} from "@/components/logistics/shipment-data";
import { routes } from "@/config/routes";

export default function LogisticsTrackingDetailPage({ id }: { id: string }) {
  const shipment = getLogisticsShipment(id);
  if (!shipment) notFound();

  const eta = shipment.items.find((item) => item.label === "ETA")?.value ?? shipment.updatedAt;
  const packageType = shipment.items.find((item) => item.label === "Package type")?.value ?? "Shipment";
  const progress = getTrackingProgress(shipment.status);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Tracking", shipment.trackingId]}
        eyebrow="Logistics Kit"
        title={`Tracking ${shipment.trackingId}`}
        description="Customer-facing movement view translated into an operations-first tracking console."
        badge="Tracking"
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={routes.logistics.tracking}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                <PiArrowLeftBold className="me-1.5 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={routes.logistics.shipmentDetails(shipment.id)}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary-dark">
                Open Shipment
              </Button>
            </Link>
          </div>
        }
      />

      <ShellCard className="overflow-hidden border-0 bg-gradient-to-br from-[#f6efe2] via-white to-[#eef6f4] shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)]">
        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Ntumai public tracking
                </Text>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Title as="h2" className="text-[28px] font-semibold tracking-tight text-gray-1000">
                    {shipment.pickup} to {shipment.dropoff}
                  </Title>
                  <TrackingStatus status={shipment.status} />
                </div>
                <Text className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                  {shipment.notes} Tracking remains active for the customer while
                  dispatch and support monitor the same movement from admin.
                </Text>
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm shadow-gray-200/50 backdrop-blur">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Tracking reference
                </Text>
                <div className="mt-2 flex items-center gap-2">
                  <Text className="text-sm font-semibold text-gray-1000">
                    {shipment.trackingId}
                  </Text>
                  <PiCopyBold className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryPill
                icon={<PiClockCountdownBold className="h-5 w-5" />}
                label="Live ETA"
                value={eta}
                tone="amber"
              />
              <SummaryPill
                icon={<PiRoadHorizonBold className="h-5 w-5" />}
                label="Lane owner"
                value={shipment.owner}
                tone="blue"
              />
              <SummaryPill
                icon={<PiPackageBold className="h-5 w-5" />}
                label="Package type"
                value={packageType}
                tone="green"
              />
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm shadow-gray-200/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Route progress
                  </Text>
                  <Title as="h3" className="mt-2 text-lg font-semibold text-gray-1000">
                    {progress.label}
                  </Title>
                </div>
                <Badge
                  variant="flat"
                  className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                >
                  {shipment.updatedAt}
                </Badge>
              </div>

              <div className="mt-5">
                <div className="h-3 overflow-hidden rounded-full bg-[#e8ece8]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-[#e3b54c] to-secondary"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                  <span>Booked</span>
                  <span>Picked up</span>
                  <span>Drop-off</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <RouteStop
                  icon={<PiMapPinAreaBold className="h-5 w-5" />}
                  label="Pickup"
                  value={shipment.pickup}
                  meta={shipment.customer}
                />
                <RouteStop
                  icon={<PiRoadHorizonBold className="h-5 w-5" />}
                  label="Current lane"
                  value={shipment.lane}
                  meta={shipment.tasker}
                />
                <RouteStop
                  icon={<PiMapPinLineBold className="h-5 w-5" />}
                  label="Drop-off"
                  value={shipment.dropoff}
                  meta={shipment.recipient}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <OperatorCard shipment={shipment} />
            <ParcelFactsCard shipment={shipment} />
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ShellCard
          title="Tracking event stream"
          description="Operational milestones mirrored from the public tracking flow."
        >
          <div className="space-y-5">
            {shipment.timeline.map((item, index) => (
              <TimelineRow
                key={`${item.label}-${item.time}`}
                item={item}
                isLast={index === shipment.timeline.length - 1}
                isCurrent={index === shipment.timeline.length - 1}
              />
            ))}
          </div>
        </ShellCard>

        <div className="space-y-6">
          <ShellCard
            title="Delivery context"
            description="Who is involved and how the shipment is exposed."
          >
            <div className="space-y-3">
              <ContextRow label="Customer" value={shipment.customer} />
              <ContextRow label="Phone" value={shipment.customerPhone} />
              <ContextRow label="Tasker" value={shipment.tasker} />
              <ContextRow label="Recipient" value={shipment.recipient} />
              <ContextRow label="Visibility" value="Public link enabled" />
            </div>
          </ShellCard>

          <ShellCard
            title="Admin notes"
            description="Suggested alignment between dispatch, support, and customer view."
          >
            <div className="space-y-3">
              <InsightNote
                title="Customer-facing expectation"
                detail={`Customer currently sees ${eta.toLowerCase()} as the expected arrival window.`}
              />
              <InsightNote
                title="Operations handoff"
                detail={`${shipment.owner} owns intervention if ETA drifts further or a route exception is raised.`}
              />
              <InsightNote
                title="Support posture"
                detail="Use this page as the single reference when support needs the same movement context as dispatch."
              />
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function SummaryPill({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "amber" | "blue" | "green";
}) {
  const toneClass = {
    amber: "bg-[#fff4db] text-[#8b5e00]",
    blue: "bg-[#e9f3ff] text-[#1257a6]",
    green: "bg-[#ebf7f0] text-[#136a4b]",
  };

  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm shadow-gray-200/40">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass[tone]}`}>
        {icon}
      </div>
      <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </Text>
      <Title as="h3" className="mt-1 text-base font-semibold text-gray-1000">
        {value}
      </Title>
    </div>
  );
}

function RouteStop({
  icon,
  label,
  value,
  meta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-[#fbfbf8] p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {label}
          </Text>
          <Title as="h4" className="mt-1 text-sm font-semibold text-gray-1000">
            {value}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{meta}</Text>
        </div>
      </div>
    </div>
  );
}

function OperatorCard({ shipment }: { shipment: LogisticsShipment }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm shadow-gray-200/60">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-[20px] bg-primary text-white">
          <PiUserCircleBold className="h-6 w-6" />
        </div>
        <div>
          <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Assigned tasker
          </Text>
          <Title as="h3" className="mt-1 text-lg font-semibold text-gray-1000">
            {shipment.tasker}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">
            Dispatch-visible rider context for this tracked movement.
          </Text>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <OperatorStat
          icon={<PiPhoneCallBold className="h-4 w-4" />}
          label="Customer line"
          value={shipment.customerPhone}
        />
        <OperatorStat
          icon={<PiShieldCheckBold className="h-4 w-4" />}
          label="Route owner"
          value={shipment.owner}
        />
        <OperatorStat
          icon={<PiCopyBold className="h-4 w-4" />}
          label="Shipment ID"
          value={shipment.id}
        />
      </div>
    </div>
  );
}

function OperatorStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-gray-100 bg-[#fbfbf8] px-4 py-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
        {icon}
      </div>
      <div>
        <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          {label}
        </Text>
        <Text className="mt-1 font-semibold text-gray-1000">{value}</Text>
      </div>
    </div>
  );
}

function ParcelFactsCard({ shipment }: { shipment: LogisticsShipment }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm shadow-gray-200/60">
      <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        Parcel facts
      </Text>
      <div className="mt-4 space-y-3">
        {shipment.items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-[#fbfbf8] px-4 py-3"
          >
            <Text className="text-sm text-gray-500">{item.label}</Text>
            <Text className="text-sm font-semibold text-gray-1000">
              {item.value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineRow({
  item,
  isLast,
  isCurrent,
}: {
  item: LogisticsShipment["timeline"][number];
  isLast: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex w-6 flex-col items-center">
        <span
          className={`mt-1 h-3.5 w-3.5 rounded-full border-2 ${
            isCurrent
              ? "border-primary bg-primary"
              : "border-gray-300 bg-white"
          }`}
        />
        {!isLast ? <span className="mt-2 w-px flex-1 bg-gray-200" /> : null}
      </div>
      <div className="flex-1 rounded-[22px] border border-gray-100 bg-[#fbfbf8] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Title as="h4" className="text-sm font-semibold text-gray-1000">
              {item.label}
            </Title>
            <Text className="mt-1 text-sm leading-6 text-gray-500">
              {item.detail}
            </Text>
          </div>
          <Badge
            variant="flat"
            className="rounded-2xl bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-600"
          >
            {item.time}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-gray-100 bg-gray-50/70 px-4 py-3">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-right text-sm font-semibold text-gray-1000">
        {value}
      </Text>
    </div>
  );
}

function InsightNote({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Title as="h4" className="text-sm font-semibold text-gray-1000">
        {title}
      </Title>
      <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function TrackingStatus({ status }: { status: string }) {
  const tones: Record<string, string> = {
    live: "bg-primary/10 text-primary",
    stable: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    monitoring: "bg-sky-50 text-sky-700",
    queued: "bg-gray-100 text-gray-700",
    at_risk: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${
        tones[status] ?? tones.queued
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function getTrackingProgress(status: LogisticsShipment["status"]) {
  switch (status) {
    case "live":
      return { label: "Parcel is actively moving toward drop-off", percent: 74 };
    case "stable":
      return { label: "Movement is healthy and on schedule", percent: 86 };
    case "review":
      return { label: "Tracking is visible but requires intervention review", percent: 42 };
    case "monitoring":
      return { label: "Shipment is moving under heightened watch", percent: 61 };
    case "at_risk":
      return { label: "Route health has degraded and needs immediate attention", percent: 33 };
    case "queued":
    default:
      return { label: "Shipment is booked and waiting for active movement", percent: 18 };
  }
}
