"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Input, Select, Switch, Table, Text, Title } from "rizzui";
import {
  PiBellBold,
  PiCircleBold,
  PiDownloadSimpleBold,
  PiMagnifyingGlassBold,
  PiMapPinAreaBold,
  PiPathBold,
  PiPlusBold,
  PiSlidersHorizontalBold,
  PiTargetBold,
  PiWaveTriangleBold,
} from "react-icons/pi";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import { Modal } from "@/components/modal";
import { useDrawer } from "@/app/shared/drawer-views/use-drawer";

type ZoneType = "surge" | "coverage" | "restricted" | "expansion";
type ZoneStatus = "live" | "monitoring" | "review" | "queued";

type Zone = {
  id: string;
  name: string;
  city: string;
  type: ZoneType;
  status: ZoneStatus;
  demandDelta: string;
  activeFleet: string;
  avgWait: string;
  trips: string;
  rules: string[];
  color: string;
  overlayClass: string;
  center: string;
};

type VersionRow = {
  id: string;
  detail: string;
  modifiedBy: string;
  time: string;
  live?: boolean;
};

const zones: Zone[] = [
  {
    id: "ZN-204",
    name: "Downtown Surge",
    city: "Lusaka Central",
    type: "surge",
    status: "live",
    demandDelta: "+12% demand",
    activeFleet: "84 live",
    avgWait: "3.8 min",
    trips: "428 trips",
    rules: ["1.5x priority boost", "Fast pickup window", "Peak auto-escalation"],
    color: "#f0b63f",
    overlayClass: "from-[#f0b63f]/45 to-[#d18f15]/20 border-[#e0a126]",
    center: "Cairo Rd / Levy Junction",
  },
  {
    id: "ZN-193",
    name: "Airport Safety Ring",
    city: "Airport Corridor",
    type: "restricted",
    status: "monitoring",
    demandDelta: "-4% throughput",
    activeFleet: "22 live",
    avgWait: "6.1 min",
    trips: "96 trips",
    rules: ["Night restrictions", "Pickup ID check", "Support watch"],
    color: "#ef6b61",
    overlayClass: "from-[#ef6b61]/40 to-[#ba2d2d]/15 border-[#e35b51]",
    center: "KKIA perimeter",
  },
  {
    id: "ZN-188",
    name: "Woodlands Coverage",
    city: "Woodlands",
    type: "coverage",
    status: "review",
    demandDelta: "+6% trips",
    activeFleet: "41 live",
    avgWait: "4.6 min",
    trips: "211 trips",
    rules: ["Coverage balancing", "Reserve tasker pool"],
    color: "#1a7f75",
    overlayClass: "from-[#1a7f75]/40 to-[#0a514c]/15 border-[#1a7f75]",
    center: "Woodlands Mall belt",
  },
  {
    id: "ZN-177",
    name: "Makeni Expansion",
    city: "Makeni East",
    type: "expansion",
    status: "queued",
    demandDelta: "+18 signups",
    activeFleet: "14 staged",
    avgWait: "Sim only",
    trips: "Launch pending",
    rules: ["Pilot launch", "Simulation only", "Overlap guardrail"],
    color: "#4b74d9",
    overlayClass: "from-[#4b74d9]/40 to-[#2649aa]/15 border-[#4b74d9]",
    center: "Makeni ring road",
  },
];

const dateOptions = [
  { label: "Past 7 days", value: "7_days" },
  { label: "Past 30 days", value: "30_days" },
  { label: "Today", value: "today" },
] as const;

const versionRows: VersionRow[] = [
  {
    id: "VER-1182",
    detail: "Downtown Surge multiplier raised from 1.3x to 1.5x for lunch and evening blocks.",
    modifiedBy: "Martha Bwalya",
    time: "29 Apr 2026, 08:44",
    live: true,
  },
  {
    id: "VER-1181",
    detail: "Airport Safety Ring restricted the pickup perimeter and added ID gating after 22:00.",
    modifiedBy: "George Munganga",
    time: "28 Apr 2026, 21:10",
  },
  {
    id: "VER-1180",
    detail: "Makeni Expansion simulation window opened with overlap detection set to strict.",
    modifiedBy: "Ruth Hachipuka",
    time: "28 Apr 2026, 16:32",
  },
];

export default function LogisticsZonesGeofencingPage() {
  const { openDrawer, closeDrawer } = useDrawer();
  const [query, setQuery] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0].id);
  const [dateFilter, setDateFilter] = useState("7_days");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [simulationMode, setSimulationMode] = useState(true);

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];

  const visibleZones = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return zones.filter((zone) => {
      const haystack = [zone.name, zone.city, zone.type, zone.center].join(" ").toLowerCase();
      return !needle || haystack.includes(needle);
    });
  }, [query]);

  const versionColumns = useMemo<ColumnDef<VersionRow>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "detail", header: "Edit details" },
      { accessorKey: "modifiedBy", header: "Modified by" },
      {
        accessorKey: "time",
        header: "Timestamp",
        cell: ({ row }) => (
          <div className="flex items-center justify-between gap-3">
            <Text className="text-sm text-gray-600">{row.original.time}</Text>
            {row.original.live ? (
              <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
                Current Live
              </Badge>
            ) : null}
          </div>
        ),
      },
    ],
    [],
  );

  const versionsTable = useReactTable({
    data: versionRows,
    columns: versionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Logistics", "Zones & Geofencing"]}
        eyebrow="Logistics Kit"
        title="Zones & geofencing"
        description="Operational control for service boundaries, surge lanes, safety restrictions, and live market coverage."
      />

      <div className="rounded-[26px] border border-white/30 bg-white/80 p-4 shadow-[0_18px_38px_-24px_rgba(15,23,42,0.4)] backdrop-blur-md">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Zambia</span>
            <span>/</span>
            <span className="font-semibold text-primary">Lusaka Market</span>
            <span>/</span>
            <span>Zone operations</span>
          </div>
          <div className="grid gap-3 xl:grid-cols-[320px_auto]">
            <Input
              type="search"
              placeholder="Search zones, corridors, or markets..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-10"
            />
            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <Button
                className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
                onClick={() => {
                  setWizardStep(1);
                  setIsCreateOpen(true);
                }}
              >
                <PiPlusBold className="me-1.5 h-4 w-4" />
                Create New Zone
              </Button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition duration-200 hover:border-primary hover:text-primary"
              >
                <PiBellBold className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4">
          {visibleZones.map((zone) => {
            const active = selectedZoneId === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`w-full rounded-[24px] border p-4 text-left transition duration-200 ${
                  active
                    ? "border-primary bg-primary/5 shadow-[0_16px_32px_-24px_rgba(37,99,235,0.6)]"
                    : "border-gray-200 bg-white hover:border-primary/35"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Text className="font-semibold text-gray-900">{zone.name}</Text>
                      <ZoneTypeChip type={zone.type} />
                    </div>
                    <Text className="mt-1 text-sm text-gray-500">{zone.city}</Text>
                  </div>
                  <Switch checked={zone.status === "live"} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <ZoneMetric label="Signal" value={zone.demandDelta} />
                  <ZoneMetric label="Fleet" value={zone.activeFleet} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{zone.avgWait}</span>
                  <span>{zone.trips}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="rounded-2xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition duration-200 hover:bg-gray-200"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedZoneId(zone.id);
                      openDrawer({
                        placement: "right",
                        containerClassName: "w-full max-w-[560px] bg-white p-0",
                        view: <ZoneDetailDrawer zone={zone} onClose={closeDrawer} />,
                      });
                    }}
                  >
                    Open detail
                  </button>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[30px] border border-[#0e2039] bg-[#071423] p-5 shadow-[0_24px_54px_-30px_rgba(2,6,23,0.85)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_30%)]" />
            <div className="relative">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8ab4ff]">
                    Live market canvas
                  </Text>
                  <Title as="h3" className="mt-2 text-xl font-semibold text-white">
                    {selectedZone.name}
                  </Title>
                  <Text className="mt-1 text-sm text-slate-300">{selectedZone.center}</Text>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="flat" className="rounded-2xl bg-white/10 px-3 py-1 text-white">
                    {selectedZone.activeFleet}
                  </Badge>
                  <Badge variant="flat" className="rounded-2xl bg-[#f0b63f]/15 px-3 py-1 text-[#ffd887]">
                    {selectedZone.demandDelta}
                  </Badge>
                </div>
              </div>

              <div className="relative h-[460px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0c1d34_0%,#091120_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
                <div className="absolute left-[16%] top-[18%] h-[34%] w-[28%] rotate-[-7deg] rounded-[32%] border-2 bg-gradient-to-br opacity-90 blur-[0.2px] transition duration-200 ${selectedZone.overlayClass}" />
                <div className={`absolute left-[16%] top-[18%] h-[34%] w-[28%] rotate-[-7deg] rounded-[32%] border-2 bg-gradient-to-br opacity-90 ${selectedZone.overlayClass}`} />
                <div className="absolute left-[47%] top-[26%] h-[26%] w-[20%] rotate-[10deg] rounded-[38%] border-2 border-[#ef6b61] bg-gradient-to-br from-[#ef6b61]/35 to-[#8f1d1d]/10" />
                <div className="absolute left-[58%] top-[56%] h-[22%] w-[18%] rotate-[-4deg] rounded-[34%] border-2 border-[#4b74d9] bg-gradient-to-br from-[#4b74d9]/35 to-[#243f8c]/10" />

                <div className="absolute left-5 top-5 rounded-[22px] border border-white/10 bg-[#08101d]/80 p-3 text-white shadow-lg backdrop-blur">
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Overlay metrics
                  </Text>
                  <div className="mt-3 space-y-3">
                    <MapProgressCard label="Active Fleet" value={selectedZone.activeFleet} progress={74} tone="blue" />
                    <MapProgressCard label="Surge Heat" value={selectedZone.demandDelta} progress={61} tone="amber" />
                  </div>
                </div>

                <div className="absolute bottom-5 right-5 rounded-[22px] border border-white/10 bg-[#08101d]/85 p-4 text-white shadow-lg backdrop-blur">
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Map legend
                  </Text>
                  <div className="mt-3 space-y-2 text-sm">
                    <LegendRow color="bg-[#f0b63f]" label="Surge zone" />
                    <LegendRow color="bg-[#ef6b61]" label="Restricted zone" />
                    <LegendRow color="bg-[#4b74d9]" label="Expansion zone" />
                    <LegendRow color="bg-[#1a7f75]" label="Coverage zone" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#18304f] bg-[#0a1524] px-4 py-3 text-white">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <Text className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live Drivers</Text>
                    <Text className="mt-1 font-semibold">{selectedZone.activeFleet}</Text>
                  </div>
                  <div>
                    <Text className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Active Alerts</Text>
                    <Text className="mt-1 font-semibold">3 flagged lanes</Text>
                  </div>
                  <div>
                    <Text className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Avg Wait</Text>
                    <Text className="mt-1 font-semibold">{selectedZone.avgWait}</Text>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-2xl border-white/15 bg-white/5 px-4 text-white hover:bg-white/10"
                  onClick={() =>
                    openDrawer({
                      placement: "right",
                      containerClassName: "w-full max-w-[560px] bg-white p-0",
                      view: <ZoneDetailDrawer zone={selectedZone} onClose={closeDrawer} />,
                    })
                  }
                >
                  Open Zone Detail
                </Button>
              </div>
            </div>
          </div>

          <ShellCard title="Global geofencing settings" description="System-wide simulation, conflict resolution, and audit history.">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="rounded-[22px] border border-gray-200 bg-gray-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Simulation mode
                      </Text>
                      <Title as="h4" className="mt-2 text-lg font-semibold text-gray-900">
                        Preview without touching live drivers
                      </Title>
                      <Text className="mt-2 text-sm leading-6 text-gray-500">
                        Run overlap and pricing checks against staged polygons before publishing to taskers or dispatch.
                      </Text>
                    </div>
                    <Switch checked={simulationMode} onChange={() => setSimulationMode((state) => !state)} />
                  </div>
                </div>

                <ConfigCard
                  title="Overlap detection"
                  detail="Strict polygon intersection alerts are active for surge, coverage, and restricted zones."
                  value="Strict"
                />
                <ConfigCard
                  title="Conflict resolution"
                  detail="Restricted zones override surge rules, and manual dispatch exceptions win over automated expansions."
                  value="Priority stack"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-base font-semibold text-gray-900">
                      Version history
                    </Title>
                    <Text className="mt-1 text-sm text-gray-500">
                      Audit log of live and staged geometry changes.
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      options={dateOptions as any}
                      value={dateFilter}
                      onChange={(option: any) => setDateFilter(option?.value ?? "7_days")}
                      selectClassName="rounded-2xl"
                    />
                    <Button variant="outline" className="h-10 rounded-2xl px-4">
                      <PiDownloadSimpleBold className="me-1.5 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="custom-scrollbar overflow-x-auto">
                  <Table variant="modern" className="min-w-[760px]">
                    <Table.Header>
                      {versionsTable.getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <Table.Head key={header.id} className="bg-gray-100">
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </Table.Head>
                          ))}
                        </Table.Row>
                      ))}
                    </Table.Header>
                    <Table.Body>
                      {versionsTable.getRowModel().rows.map((row) => (
                        <Table.Row key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <Table.Cell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Table.Cell>
                          ))}
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </div>
            </div>
          </ShellCard>
        </div>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} customSize={1180} rounded="xl">
        <ZoneCreateWizard
          step={wizardStep}
          onStepChange={setWizardStep}
          onClose={() => setIsCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}

function ZoneMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-3 py-2">
      <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Text className="mt-1 text-sm font-semibold text-gray-900">{value}</Text>
    </div>
  );
}

function ZoneTypeChip({ type }: { type: ZoneType }) {
  const labels = {
    surge: "Surge",
    coverage: "Coverage",
    restricted: "Restricted",
    expansion: "Expansion",
  };

  const tones = {
    surge: "bg-[#fff3da] text-[#986600]",
    coverage: "bg-[#e7f8f2] text-[#146a4d]",
    restricted: "bg-[#ffe3e0] text-[#b5392d]",
    expansion: "bg-[#e8efff] text-[#2649aa]",
  };

  return <span className={`rounded-2xl px-2.5 py-1 text-[11px] font-semibold ${tones[type]}`}>{labels[type]}</span>;
}

function MapProgressCard({
  label,
  value,
  progress,
  tone,
}: {
  label: string;
  value: string;
  progress: number;
  tone: "blue" | "amber";
}) {
  const barTone = tone === "blue" ? "bg-[#6aa2ff]" : "bg-[#f0b63f]";

  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between gap-3">
        <Text className="text-sm text-slate-300">{label}</Text>
        <Text className="text-sm font-semibold text-white">{value}</Text>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${barTone}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-slate-300">{label}</span>
    </div>
  );
}

function ConfigCard({
  title,
  detail,
  value,
}: {
  title: string;
  detail: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
          {value}
        </Badge>
      </div>
      <Text className="mt-2 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function ZoneCreateWizard({
  step,
  onStepChange,
  onClose,
}: {
  step: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="rounded-[30px] bg-white p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Create new zone
          </Text>
          <Title as="h3" className="mt-2 text-2xl font-semibold text-gray-900">
            Guided geofence creation
          </Title>
          <Text className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            Define zone info, draw the boundary, then configure dispatch and pricing rules before it goes live.
          </Text>
        </div>
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {[
          { id: 1, label: "Info" },
          { id: 2, label: "Draw" },
          { id: 3, label: "Rules" },
        ].map((item) => (
          <div
            key={item.id}
            className={`inline-flex items-center rounded-2xl px-4 py-2 text-sm font-semibold ${
              step === item.id
                ? "bg-primary text-white"
                : step > item.id
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="me-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
              {item.id}
            </span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative h-[520px] overflow-hidden rounded-[28px] border border-[#10213b] bg-[#071423]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:38px_38px]" />
          <div className="absolute left-5 top-5 flex flex-col gap-3 rounded-[22px] border border-white/10 bg-[#08101d]/85 p-3 text-white shadow-lg backdrop-blur">
            <ToolbarButton icon={<PiPathBold className="h-4 w-4" />} label="Polygon" active={step === 2} />
            <ToolbarButton icon={<PiCircleBold className="h-4 w-4" />} label="Circle" active={false} />
            <ToolbarButton icon={<PiPlusBold className="h-4 w-4" />} label="Zoom in" active={false} />
            <ToolbarButton icon={<PiSlidersHorizontalBold className="h-4 w-4" />} label="Zoom out" active={false} />
          </div>

          <div className="absolute left-[24%] top-[22%] h-[38%] w-[34%] rotate-[-6deg] rounded-[30%] border-2 border-[#f0b63f] bg-gradient-to-br from-[#f0b63f]/35 to-[#9d6a11]/10" />

          <div className="absolute bottom-5 left-5 rounded-[22px] border border-white/10 bg-[#08101d]/85 px-4 py-3 text-white shadow-lg backdrop-blur">
            <Text className="text-sm font-semibold">3 admins editing Lusaka market</Text>
            <Text className="mt-1 text-xs text-slate-300">George, Martha, Ruth</Text>
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-gray-200 bg-gray-50/60 p-5">
          {step === 1 ? (
            <>
              <Input label="Zone name" rounded="lg" defaultValue="Downtown Lunch Surge" />
              <Select
                label="Zone type"
                options={[
                  { label: "Surge", value: "surge" },
                  { label: "Coverage", value: "coverage" },
                  { label: "Restricted", value: "restricted" },
                  { label: "Expansion", value: "expansion" },
                ]}
                defaultValue={{ label: "Surge", value: "surge" }}
                selectClassName="rounded-2xl"
              />
              <Input label="Market / city" rounded="lg" defaultValue="Lusaka Central" />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <InfoBlock title="Drawing mode" detail="Use polygon points for organic city corridors or a circle for quick perimeter staging." />
              <InfoBlock title="Boundary health" detail="Current draft intersects one existing coverage zone and will need conflict review before publish." />
              <InfoBlock title="Precision" detail="Snap-to-road is enabled for dense urban delivery corridors." />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Input label="Priority boost multiplier" rounded="lg" defaultValue="1.5x" />
              <Input label="Time windows" rounded="lg" defaultValue="11:00 - 14:00, 17:00 - 20:00" />
              <Input label="Alert threshold" rounded="lg" defaultValue="Avg wait above 5 min" />
            </>
          ) : null}

          <div className="rounded-[22px] border border-gray-200 bg-white p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Rules snapshot</Text>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>Priority boost</span>
                <span className="font-semibold text-gray-900">1.5x</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Overlap policy</span>
                <span className="font-semibold text-gray-900">Restricted wins</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Publish mode</span>
                <span className="font-semibold text-gray-900">Sim first</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3 pt-2">
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4"
              onClick={() => onStepChange(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
              onClick={() => {
                if (step === 3) {
                  onClose();
                  return;
                }
                onStepChange(step + 1);
              }}
            >
              {step === 3 ? "Finish zone" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition duration-200 ${
        active ? "bg-primary text-white" : "bg-white/5 text-slate-200 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoBlock({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[22px] border border-gray-200 bg-white p-4">
      <Text className="font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm leading-6 text-gray-500">{detail}</Text>
    </div>
  );
}

function ZoneDetailDrawer({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-100 px-6 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Zone detail
        </Text>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <Title as="h3" className="text-xl font-semibold text-gray-900">
              {zone.name}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">
              {zone.city} · {zone.center}
            </Text>
          </div>
          <ZoneTypeChip type={zone.type} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="rounded-[26px] border border-[#0e2039] bg-[#071423] p-4 text-white">
          <div className="grid gap-4 sm:grid-cols-2">
            <MapProgressCard label="Active Fleet" value={zone.activeFleet} progress={72} tone="blue" />
            <MapProgressCard label="Surge Heat" value={zone.demandDelta} progress={63} tone="amber" />
          </div>
        </div>

        <section className="space-y-4">
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Real-time metrics
          </Title>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailMetric label="Total Trips" value={zone.trips} />
            <DetailMetric label="Avg Wait" value={zone.avgWait} />
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Active ruleset
          </Title>
          <div className="mt-4 space-y-3">
            {zone.rules.map((rule) => (
              <div key={rule} className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="text-sm font-medium text-gray-800">{rule}</Text>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Zone configuration
          </Title>
          <div className="mt-4 space-y-3">
            <Button className="h-11 w-full rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              Edit Zone Configuration
            </Button>
            <Button variant="outline" className="h-11 w-full rounded-2xl border-red-200 px-4 text-red-700 hover:bg-red-50">
              Archive Zone
            </Button>
          </div>
        </section>
      </div>

      <div className="border-t border-gray-100 px-6 py-5">
        <Button variant="outline" className="h-11 w-full rounded-2xl px-4" onClick={onClose}>
          Close detail
        </Button>
      </div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Title as="h4" className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </Title>
    </div>
  );
}
