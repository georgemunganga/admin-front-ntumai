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
  PiTruckTrailerBold,
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
  const weight = shipment.items.find((item) => item.label === "Weight")?.value ?? "Not set";
  const progress = getTrackingProgress(shipment.status);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Tracking", shipment.trackingId]}
        eyebrow="Logistics Kit"
        title={`Tracking ${shipment.trackingId}`}
        description="Tracking detail page aligned to the public Ntumai delivery flow and the internal dispatch workspace."
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
                Open shipment
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Title as="h2" className="text-2xl font-semibold text-gray-900">
                    {shipment.pickup} to {shipment.dropoff}
                  </Title>
                  <TrackingStatus status={shipment.status} />
                </div>
                <Text className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                  {shipment.notes} This tracking link mirrors what the customer sees in the Ntumai app while dispatch and support use the same movement context from admin.
                </Text>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Tracking reference
                </Text>
                <div className="mt-2 flex items-center gap-2">
                  <Text className="font-semibold text-gray-900">{shipment.trackingId}</Text>
                  <PiCopyBold className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <SummaryCard
                icon={<PiClockCountdownBold className="h-5 w-5" />}
                label="ETA"
                value={eta}
              />
              <SummaryCard
                icon={<PiPackageBold className="h-5 w-5" />}
                label="Package type"
                value={packageType}
              />
              <SummaryCard
                icon={<PiTruckTrailerBold className="h-5 w-5" />}
                label="Assigned tasker"
                value={shipment.tasker}
              />
              <SummaryCard
                icon={<PiRoadHorizonBold className="h-5 w-5" />}
                label="Ops owner"
                value={shipment.owner}
              />
            </div>
          </div>

          <ShellCard title="Tracking details" description="Route progress and shipment movement.">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Current progress
                      </Text>
                      <Title as="h3" className="mt-2 text-lg font-semibold text-gray-900">
                        {progress.label}
                      </Title>
                    </div>
                    <Badge
                      variant="flat"
                      className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                    >
                      Updated {shipment.updatedAt}
                    </Badge>
                  </div>
                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    <span>Booked</span>
                    <span>Picked up</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <RoutePoint
                    icon={<PiMapPinAreaBold className="h-5 w-5" />}
                    label="Pickup address"
                    value={shipment.pickup}
                    meta={shipment.customer}
                  />
                  <RoutePoint
                    icon={<PiRoadHorizonBold className="h-5 w-5" />}
                    label="Current lane"
                    value={shipment.lane}
                    meta={`${shipment.tasker} · ${eta}`}
                  />
                  <RoutePoint
                    icon={<PiMapPinLineBold className="h-5 w-5" />}
                    label="Drop-off address"
                    value={shipment.dropoff}
                    meta={shipment.recipient}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <InfoPanel
                  title="Parcel"
                  rows={[
                    { label: "Type", value: packageType },
                    { label: "Weight", value: weight },
                    { label: "Value", value: shipment.value },
                    { label: "Visibility", value: "Customer tracking enabled" },
                  ]}
                />
                <InfoPanel
                  title="Admin context"
                  rows={[
                    { label: "Shipment ID", value: shipment.id },
                    { label: "Last update", value: shipment.updatedAt },
                    { label: "Owner", value: shipment.owner },
                    { label: "Support view", value: "Shared with inbox teams" },
                  ]}
                />
              </div>
            </div>
          </ShellCard>

          <ShellCard title="Tracking history" description="Latest delivery milestones from the Ntumai shipment timeline.">
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
        </div>

        <div className="space-y-6">
          <ShellCard title="Customer & rider" description="Primary contacts tied to this delivery.">
            <div className="space-y-4">
              <SidebarPerson
                icon={<PiUserCircleBold className="h-5 w-5" />}
                label="Customer"
                title={shipment.customer}
                subtitle={shipment.customerPhone}
              />
              <SidebarPerson
                icon={<PiTruckTrailerBold className="h-5 w-5" />}
                label="Tasker"
                title={shipment.tasker}
                subtitle={shipment.owner}
              />
              <SidebarPerson
                icon={<PiPackageBold className="h-5 w-5" />}
                label="Recipient"
                title={shipment.recipient}
                subtitle={shipment.dropoff}
              />
            </div>
          </ShellCard>

          <ShellCard title="Quick actions" description="Operational shortcuts for this tracked order.">
            <div className="space-y-3">
              <ActionRow
                icon={<PiPhoneCallBold className="h-4 w-4" />}
                label="Call customer"
                value={shipment.customerPhone}
              />
              <ActionRow
                icon={<PiShieldCheckBold className="h-4 w-4" />}
                label="Escalation owner"
                value={shipment.owner}
              />
              <ActionRow
                icon={<PiCopyBold className="h-4 w-4" />}
                label="Tracking share"
                value="Public link enabled"
              />
            </div>
          </ShellCard>

          <ShellCard title="Admin notes" description="How the movement should be read inside Ntumai admin.">
            <div className="space-y-3">
              <NoteCard
                title="Customer view"
                detail={`The mobile app currently shows ${eta.toLowerCase()} as the active arrival estimate.`}
              />
              <NoteCard
                title="Dispatch ownership"
                detail={`${shipment.owner} should intervene first if the route slips or tasker movement pauses.`}
              />
              <NoteCard
                title="Support alignment"
                detail="Use this same tracking detail as the source of truth when handling order status questions."
              />
            </div>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </Text>
      <Title as="h3" className="mt-1 text-base font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}

function RoutePoint({
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
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          {label}
        </Text>
        <Title as="h4" className="mt-1 text-sm font-semibold text-gray-900">
          {value}
        </Title>
        <Text className="mt-1 text-sm text-gray-500">{meta}</Text>
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <Title as="h4" className="text-sm font-semibold text-gray-900">
        {title}
      </Title>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <Text className="text-sm text-gray-500">{row.label}</Text>
            <Text className="text-right text-sm font-semibold text-gray-900">
              {row.value}
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
            isCurrent ? "border-primary bg-primary" : "border-gray-300 bg-white"
          }`}
        />
        {!isLast ? <span className="mt-2 w-px flex-1 bg-gray-200" /> : null}
      </div>
      <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Title as="h4" className="text-sm font-semibold text-gray-900">
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

function SidebarPerson({
  icon,
  label,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {label}
          </Text>
          <Title as="h4" className="mt-1 text-sm font-semibold text-gray-900">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text>
        </div>
      </div>
    </div>
  );
}

function ActionRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-gray-700 shadow-sm">
        {icon}
      </div>
      <div>
        <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          {label}
        </Text>
        <Text className="mt-1 text-sm font-semibold text-gray-900">{value}</Text>
      </div>
    </div>
  );
}

function NoteCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <Title as="h4" className="text-sm font-semibold text-gray-900">
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
