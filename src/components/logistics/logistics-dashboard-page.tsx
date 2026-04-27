"use client";

import { Badge, Text, Title } from "rizzui";
import { PiClockCountdownBold, PiMapPinLineDuotone, PiTruckDuotone } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";

const overviewStats = [
  { label: "Live shipments", value: "148", meta: "23 high-priority stops" },
  { label: "Drivers online", value: "86", meta: "12 in reserve pool" },
  { label: "On-time rate", value: "94.8%", meta: "Stable vs 7-day average" },
  { label: "SLA risks", value: "09", meta: "4 require dispatch action" },
];

const routeLanes = [
  { name: "CBD dispatch lane", status: "Flowing", orders: "31 open drops", eta: "14 min median" },
  { name: "Airport corridor", status: "Watch", orders: "18 live jobs", eta: "22 min median" },
  { name: "Woodlands returns", status: "Escalated", orders: "7 recovery trips", eta: "31 min median" },
];

const activeTrips = [
  { id: "TRK-4002", driver: "Moses Banda", route: "Roma -> Kabulonga", state: "Live", updated: "2 min ago" },
  { id: "TRK-3999", driver: "Ruth Mwape", route: "CBD -> Longacres", state: "Queued", updated: "6 min ago" },
  { id: "TRK-3991", driver: "Derrick Phiri", route: "Airport -> Ibex", state: "Delayed", updated: "9 min ago" },
  { id: "TRK-3988", driver: "Mercy Zulu", route: "Woodlands -> Chalala", state: "Recovered", updated: "11 min ago" },
];

export default function LogisticsDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics"]}
        eyebrow="Logistics Kit"
        title="Logistics Control"
        description="Coordinate live deliveries, driver capacity, and city-zone performance from the operations desk."
      />

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="mt-3 text-[28px] font-semibold tracking-tight">
              {stat.value}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">{stat.meta}</Text>
          </div>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Route Lanes
              </Text>
              <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
                Dispatch pressure by operating zone
              </Title>
            </div>
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
              Live map sync
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {routeLanes.map((lane) => (
              <div key={lane.name} className="rounded-2xl bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <PiMapPinLineDuotone className="h-5 w-5 text-primary" />
                  <Badge variant="flat" className="rounded-2xl bg-white px-3 py-1 text-gray-700">
                    {lane.status}
                  </Badge>
                </div>
                <Title as="h4" className="mt-4 text-base font-semibold text-gray-900">
                  {lane.name}
                </Title>
                <Text className="mt-2 text-sm text-gray-500">{lane.orders}</Text>
                <Text className="mt-1 text-sm text-gray-500">{lane.eta}</Text>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <PiClockCountdownBold className="h-5 w-5 text-primary" />
            <div>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Watchtower
              </Text>
              <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
                Live trip feed
              </Title>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {activeTrips.map((trip) => (
              <div key={trip.id} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Text className="text-sm font-semibold text-gray-900">{trip.id}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{trip.driver}</Text>
                  </div>
                  <TripState state={trip.state} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <PiTruckDuotone className="h-4 w-4 text-primary" />
                  <span>{trip.route}</span>
                </div>
                <Text className="mt-2 text-xs text-gray-500">{trip.updated}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TripState({ state }: { state: string }) {
  const styles: Record<string, string> = {
    Live: "bg-primary/10 text-primary",
    Queued: "bg-amber-50 text-amber-700",
    Delayed: "bg-red-50 text-red-700",
    Recovered: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${styles[state] ?? styles.Live}`}>
      {state}
    </span>
  );
}
