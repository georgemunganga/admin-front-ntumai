"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Input, Select, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiCalendarDotsBold,
  PiCalendarPlusBold,
  PiClockCountdownBold,
  PiMagnifyingGlassBold,
  PiMapPinLineBold,
  PiVanBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";

type RideStatus = "live" | "stable" | "review" | "monitoring" | "queued" | "at_risk";

type ScheduledRide = {
  id: string;
  rider: string;
  lane: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  etaWindow: string;
  supply: string;
  owner: string;
  service: string;
  status: RideStatus;
  priority: "standard" | "priority" | "critical";
  vehicle: string;
};

const ridesSeed: ScheduledRide[] = [
  {
    id: "SCH-2184",
    rider: "Kennedy Phiri",
    lane: "Airport inbound",
    pickup: "KKIA arrivals",
    dropoff: "Roma, Lusaka",
    date: "Today",
    time: "07:45",
    etaWindow: "07:45 - 08:10",
    supply: "Reserved driver",
    owner: "Airport desk",
    service: "Airport pickup",
    status: "stable",
    priority: "priority",
    vehicle: "Sedan",
  },
  {
    id: "SCH-2191",
    rider: "Ciela Corporate",
    lane: "B2B shuttle",
    pickup: "Ciela offices",
    dropoff: "Levy Junction",
    date: "Today",
    time: "08:30",
    etaWindow: "08:30 - 09:00",
    supply: "Pending lock",
    owner: "B2B dispatch",
    service: "Corporate ride",
    status: "review",
    priority: "critical",
    vehicle: "Van",
  },
  {
    id: "SCH-2206",
    rider: "Martha Chola",
    lane: "Medical recurring",
    pickup: "Woodlands clinic",
    dropoff: "UTH specialist wing",
    date: "Today",
    time: "11:00",
    etaWindow: "11:00 - 11:35",
    supply: "Reserved driver",
    owner: "Scheduling lane",
    service: "Medical transfer",
    status: "monitoring",
    priority: "priority",
    vehicle: "Sedan",
  },
  {
    id: "SCH-2213",
    rider: "Munda Family",
    lane: "Evening pre-booking",
    pickup: "Olympia Park",
    dropoff: "EastPark Mall",
    date: "Tomorrow",
    time: "18:10",
    etaWindow: "18:10 - 18:40",
    supply: "Open pool",
    owner: "Planning desk",
    service: "Consumer ride",
    status: "queued",
    priority: "standard",
    vehicle: "Hatchback",
  },
  {
    id: "SCH-2220",
    rider: "Mika Lodge",
    lane: "Hotel transfer",
    pickup: "Mika Convention Centre",
    dropoff: "KKIA departures",
    date: "Tomorrow",
    time: "20:00",
    etaWindow: "20:00 - 20:35",
    supply: "Pending lock",
    owner: "Hospitality desk",
    service: "Airport drop-off",
    status: "at_risk",
    priority: "critical",
    vehicle: "SUV",
  },
  {
    id: "SCH-2228",
    rider: "Green Harvest Team",
    lane: "Staff shuttle",
    pickup: "Mass Media",
    dropoff: "Chalala depot",
    date: "Friday",
    time: "17:20",
    etaWindow: "17:20 - 18:00",
    supply: "Reserve pool",
    owner: "B2B dispatch",
    service: "Corporate ride",
    status: "live",
    priority: "priority",
    vehicle: "Mini-bus",
  },
];

const dayOptions = [
  { label: "All dates", value: "all" },
  { label: "Today", value: "Today" },
  { label: "Tomorrow", value: "Tomorrow" },
  { label: "Friday", value: "Friday" },
];

const serviceOptions = [
  { label: "All services", value: "all" },
  { label: "Airport pickup", value: "Airport pickup" },
  { label: "Airport drop-off", value: "Airport drop-off" },
  { label: "Corporate ride", value: "Corporate ride" },
  { label: "Medical transfer", value: "Medical transfer" },
  { label: "Consumer ride", value: "Consumer ride" },
];

export default function DispatchScheduledRidesPage() {
  const [day, setDay] = useState("Today");
  const [service, setService] = useState("all");
  const [query, setQuery] = useState("");

  const filteredRides = useMemo(() => {
    return ridesSeed.filter((ride) => {
      const matchesDay = day === "all" ? true : ride.date === day;
      const matchesService = service === "all" ? true : ride.service === service;
      const haystack = [
        ride.id,
        ride.rider,
        ride.lane,
        ride.pickup,
        ride.dropoff,
        ride.owner,
      ]
        .join(" ")
        .toLowerCase();
      return matchesDay && matchesService && haystack.includes(query.toLowerCase());
    });
  }, [day, query, service]);

  const groupedRides = useMemo(() => {
    return filteredRides.reduce<Record<string, ScheduledRide[]>>((acc, ride) => {
      acc[ride.date] = acc[ride.date] ? [...acc[ride.date], ride] : [ride];
      return acc;
    }, {});
  }, [filteredRides]);

  const nextRide = filteredRides[0] ?? ridesSeed[0];
  const atRiskCount = filteredRides.filter((ride) => ride.status === "at_risk" || ride.status === "review").length;
  const unlockedCount = filteredRides.filter((ride) => ride.supply !== "Reserved driver").length;

  function resetFilters() {
    setDay("Today");
    setService("all");
    setQuery("");
  }

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dispatch", "Scheduled Rides"]}
        eyebrow="Dispatch Ops"
        title="Scheduled rides"
        description="Appointment-style planning workspace for upcoming bookings, supply locking, and pre-trip intervention."
        badge="Planning"
        action={
          <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
            <PiCalendarPlusBold className="me-1.5 h-4 w-4" />
            New scheduled ride
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Upcoming rides"
          value={String(filteredRides.length)}
          change="Visible list"
          tone="neutral"
          detail="Advance bookings currently loaded into the dispatch schedule workspace."
        />
        <StatCard
          label="Need supply lock"
          value={String(unlockedCount)}
          change="Driver assignment"
          tone="warning"
          detail="Scheduled trips that still need a reserved driver or fallback supply decision."
        />
        <StatCard
          label="At-risk planning"
          value={String(atRiskCount)}
          change="Pre-trip watch"
          tone="warning"
          detail="Scheduled rides flagged for review before their pickup window opens."
        />
      </div>

      <ShellCard className="overflow-hidden border-0 bg-gradient-to-br from-[#f5efe4] via-white to-[#edf7f4] shadow-[0_18px_48px_-24px_rgba(15,23,42,0.34)]">
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Dispatch appointment board
                </Text>
                <Title as="h2" className="mt-3 text-[30px] font-semibold tracking-tight text-gray-1000">
                  {nextRide.date} next-up window
                </Title>
                <Text className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">
                  Use this workspace to lock drivers early, protect high-value bookings, and spot scheduled-demand issues before riders expect pickup.
                </Text>
              </div>
              <Badge
                variant="flat"
                className="rounded-2xl bg-white/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary shadow-sm"
              >
                {nextRide.service}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <HeroSignal
                icon={<PiClockCountdownBold className="h-5 w-5" />}
                label="Next pickup"
                value={nextRide.time}
                detail={nextRide.etaWindow}
                tone="warning"
              />
              <HeroSignal
                icon={<PiVanBold className="h-5 w-5" />}
                label="Supply state"
                value={nextRide.supply}
                detail={nextRide.owner}
                tone={nextRide.supply === "Reserved driver" ? "live" : "warning"}
              />
              <HeroSignal
                icon={<PiMapPinLineBold className="h-5 w-5" />}
                label="Lane"
                value={nextRide.lane}
                detail={nextRide.rider}
                tone="neutral"
              />
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <StageCard title="Pickup" value={nextRide.pickup} meta={nextRide.time} />
                <StageCard title="Drop-off" value={nextRide.dropoff} meta={nextRide.etaWindow} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <QueueCard
              title="Planning watch"
              items={[
                ["Airport inbound block", "Three pickups due inside one 25-minute corridor.", "review"],
                ["Corporate lock gap", "B2B evening shuttle still needs final vehicle confirmation.", "monitoring"],
                ["Reminder cycle", "Tomorrow reminders should be sent before 18:00.", "queued"],
              ]}
            />
            <QueueCard
              title="Operator focus"
              items={[
                ["Pre-position supply", "Move backup drivers closer to airport and mall corridors.", "live"],
                ["Protect medical runs", "Recurring patient rides should not slip behind consumer demand.", "stable"],
              ]}
            />
          </div>
        </div>
      </ShellCard>

      <ShellCard title="Ride filters" description="Slice the appointment board by date, service, or customer context.">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_140px]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search rider, lane, pickup, drop-off..."
            prefix={<PiMagnifyingGlassBold className="h-4 w-4 text-gray-400" />}
            inputClassName="h-11"
          />
          <Select
            options={dayOptions}
            value={day}
            onChange={(option: any) => setDay(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
          <Select
            options={serviceOptions}
            value={service}
            onChange={(option: any) => setService(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={resetFilters}>
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </ShellCard>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard title="Scheduled ride list" description="Appointment-style booking list ordered by ride day and pickup slot.">
          <div className="space-y-5">
            {Object.entries(groupedRides).map(([group, rides]) => (
              <div key={group} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <PiCalendarDotsBold className="h-4 w-4 text-primary" />
                    <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600">
                      {group}
                    </Text>
                  </div>
                  <Badge variant="flat" className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                    {rides.length} rides
                  </Badge>
                </div>

                {rides.map((ride) => (
                  <RideRow key={ride.id} ride={ride} />
                ))}
              </div>
            ))}

            {!filteredRides.length ? (
              <div className="rounded-[24px] border border-dashed border-gray-200 bg-gray-50/70 px-4 py-10 text-center">
                <Text className="font-semibold text-gray-900">No scheduled rides match the current filters.</Text>
                <Text className="mt-2 text-sm text-gray-500">
                  Reset the board or widen the service/date scope to repopulate the list.
                </Text>
              </div>
            ) : null}
          </div>
        </ShellCard>

        <ShellCard title="Next action lane" description="Quick dispatch context for the currently visible ride set.">
          <div className="space-y-4">
            <ContextTile
              title="Driver lock policy"
              detail="Critical or airport-linked rides should move from open pool to reserved driver before the pickup window enters the final hour."
            />
            <ContextTile
              title="Mobile app alignment"
              detail="These are pre-booked ride requests coming from the customer app and business booking flows, so timing promises need to stay more stable than on-demand dispatch."
            />
            <ContextTile
              title="Exception prevention"
              detail="Use this board to catch weak supply commitments before they become live dispatch exceptions."
            />
            <div className="rounded-[24px] border border-gray-100 bg-gray-50/80 p-4">
              <div className="flex items-start gap-3">
                <PiWarningCircleBold className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <Text className="font-semibold text-gray-900">Scheduling alert</Text>
                  <Text className="mt-1 text-sm leading-6 text-gray-500">
                    {atRiskCount
                      ? `${atRiskCount} scheduled rides need review before their pickup windows open.`
                      : "No current pre-trip scheduling risks are showing in the filtered set."}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function HeroSignal({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: "live" | "warning" | "neutral";
}) {
  const toneClass = {
    live: "bg-[#ebf7f0] text-[#136a4b]",
    warning: "bg-[#fff4db] text-[#8b5e00]",
    neutral: "bg-[#e9f3ff] text-[#1257a6]",
  };

  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass[tone]}`}>
        {icon}
      </div>
      <Text className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </Text>
      <Title as="h3" className="mt-1 text-base font-semibold text-gray-1000">
        {value}
      </Title>
      <Text className="mt-1 text-sm text-gray-500">{detail}</Text>
    </div>
  );
}

function StageCard({
  title,
  value,
  meta,
}: {
  title: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-[#fbfbf8] p-4">
      <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {title}
      </Text>
      <Text className="mt-2 font-semibold text-gray-1000">{value}</Text>
      <Text className="mt-1 text-sm text-gray-500">{meta}</Text>
    </div>
  );
}

function QueueCard({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string, string]>;
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm">
      <Title as="h3" className="text-base font-semibold text-gray-1000">
        {title}
      </Title>
      <div className="mt-4 space-y-3">
        {items.map(([name, detail, status]) => (
          <div key={name} className="rounded-[20px] border border-gray-100 bg-[#fbfbf8] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Text className="font-semibold text-gray-900">{name}</Text>
                <Text className="mt-1 text-sm text-gray-500">{detail}</Text>
              </div>
              <StatusBadge status={status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RideRow({ ride }: { ride: ScheduledRide }) {
  return (
    <div className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50/70">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="flat" className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
              {ride.id}
            </Badge>
            <StatusBadge status={ride.status} />
            {ride.priority === "critical" ? (
              <Badge variant="flat" className="rounded-full bg-red-lighter/70 px-2.5 py-1 text-[11px] text-red-dark">
                Critical
              </Badge>
            ) : null}
          </div>

          <div>
            <Title as="h4" className="text-base font-semibold text-gray-1000">
              {ride.rider}
            </Title>
            <Text className="mt-1 text-sm text-gray-500">
              {ride.lane} · {ride.service} · {ride.vehicle}
            </Text>
          </div>

          <div className="grid gap-3 text-sm text-gray-500 md:grid-cols-2 xl:grid-cols-4">
            <DetailPair label="Pickup" value={ride.pickup} />
            <DetailPair label="Drop-off" value={ride.dropoff} />
            <DetailPair label="Pickup time" value={ride.time} />
            <DetailPair label="Supply" value={ride.supply} />
          </div>
        </div>

        <div className="min-w-[210px] rounded-[20px] border border-gray-100 bg-gray-50/80 p-4">
          <DetailPair label="ETA window" value={ride.etaWindow} />
          <div className="mt-3 border-t border-gray-200 pt-3">
            <DetailPair label="Owner" value={ride.owner} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
        {label}
      </Text>
      <Text className="mt-1 font-medium text-gray-900">{value}</Text>
    </div>
  );
}

function ContextTile({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}
