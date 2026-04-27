"use client";

import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiCaretRightBold,
  PiMagnifyingGlassBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { useDrawer } from "@/app/shared/drawer-views/use-drawer";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { Modal } from "@/components/modal";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type ExceptionType =
  | "no_tasker_available"
  | "pickup_delayed"
  | "tasker_offline"
  | "customer_unreachable"
  | "vendor_not_ready"
  | "handoff_failed";
type Priority = "low" | "medium" | "high" | "critical";
type DecisionAction = "reassign" | "escalate" | "cancel";

type DispatchException = {
  id: string;
  reference: string;
  type: ExceptionType;
  status: ReviewStatus;
  priority: Priority;
  city: string;
  lane: string;
  owner: string;
  age: string;
  issue: string;
  customer: string;
  tasker: string;
  vendor: string;
  timeline: Array<{
    label: string;
    detail: string;
    time: string;
  }>;
  notes: string[];
};

const typeLabels: Record<ExceptionType, string> = {
  no_tasker_available: "No tasker available",
  pickup_delayed: "Pickup delayed",
  tasker_offline: "Tasker offline mid-job",
  customer_unreachable: "Customer unreachable",
  vendor_not_ready: "Vendor not ready",
  handoff_failed: "Handoff failed",
};

const tabs = [
  { value: "all", label: "All exceptions" },
  { value: "no_tasker_available", label: "No tasker" },
  { value: "pickup_delayed", label: "Pickup delayed" },
  { value: "tasker_offline", label: "Tasker offline" },
  { value: "vendor_not_ready", label: "Vendor not ready" },
  { value: "handoff_failed", label: "Handoff failed" },
] as const;

const seed: DispatchException[] = [
  {
    id: "EXC-4021",
    reference: "DEL-88014",
    type: "pickup_delayed",
    status: "review",
    priority: "critical",
    city: "Lusaka",
    lane: "CBD dispatch lane",
    owner: "Dispatch pod A",
    age: "11m",
    issue: "Pickup is 19 minutes behind SLA and the vendor has not marked the parcel ready despite tasker arrival.",
    customer: "Joseph Tembo",
    tasker: "Moses Banda",
    vendor: "QuickBite Express",
    timeline: [
      { label: "Tasker assigned", detail: "Tasker accepted the delivery and arrived at pickup point.", time: "09:02" },
      { label: "Pickup overdue", detail: "Vendor still has not confirmed handoff readiness.", time: "09:11" },
      { label: "Exception opened", detail: "Dispatch lane escalated the pickup delay.", time: "09:13" },
    ],
    notes: ["Likely vendor-side preparation delay. Dispatch may need support handoff if customer contacts us first."],
  },
  {
    id: "EXC-4015",
    reference: "BKG-55021",
    type: "no_tasker_available",
    status: "queued",
    priority: "high",
    city: "Ndola",
    lane: "Airport corridor",
    owner: "Dispatch pod B",
    age: "18m",
    issue: "Matching exhausted the nearby pool and no tasker accepted the booking after 3 assignment rounds.",
    customer: "Natasha Mbewe",
    tasker: "Unassigned",
    vendor: "Direct task booking",
    timeline: [
      { label: "Booking created", detail: "Customer task request entered matching queue.", time: "08:44" },
      { label: "Matching exhausted", detail: "Three candidate rounds timed out or rejected.", time: "08:55" },
      { label: "Queue hold", detail: "Dispatch should decide on manual assignment or cancellation.", time: "08:58" },
    ],
    notes: ["This should surface next to live supply shortage signals."],
  },
  {
    id: "EXC-4007",
    reference: "DEL-87962",
    type: "tasker_offline",
    status: "at_risk",
    priority: "critical",
    city: "Kitwe",
    lane: "Market square west",
    owner: "Dispatch pod A",
    age: "26m",
    issue: "Tasker stopped sending location updates after pickup and has not answered the masked call-back.",
    customer: "Martha Chola",
    tasker: "Ruth Mwape",
    vendor: "Green Basket Market",
    timeline: [
      { label: "Pickup completed", detail: "Vendor handoff was marked complete.", time: "08:12" },
      { label: "Heartbeat lost", detail: "Tracking lost tasker updates for 9 minutes.", time: "08:19" },
      { label: "Escalation opened", detail: "Dispatch raised a live-delivery safety and SLA risk.", time: "08:24" },
    ],
    notes: ["High-priority case. If contact is not restored, Support and Risk may both need the case context."],
  },
  {
    id: "EXC-3998",
    reference: "DEL-87920",
    type: "customer_unreachable",
    status: "monitoring",
    priority: "medium",
    city: "Lusaka",
    lane: "Woodlands returns",
    owner: "Recovery desk",
    age: "31m",
    issue: "Tasker reached dropoff but customer phone is unreachable and alternate contact did not answer.",
    customer: "Brian Zulu",
    tasker: "Mercy Zulu",
    vendor: "HomeBox Supplies",
    timeline: [
      { label: "Tasker arrived", detail: "Dropoff point reached successfully.", time: "07:48" },
      { label: "Call attempt failed", detail: "Customer and alternate contact both did not answer.", time: "07:56" },
      { label: "Recovery monitoring", detail: "Awaiting return-or-wait decision.", time: "08:03" },
    ],
    notes: ["Could become a failed handoff if wait threshold expires."],
  },
  {
    id: "EXC-3989",
    reference: "DEL-87874",
    type: "vendor_not_ready",
    status: "queued",
    priority: "high",
    city: "Kabwe",
    lane: "Town center east",
    owner: "Vendor ops handoff",
    age: "39m",
    issue: "Merchant accepted the order but prep did not start on time and pickup readiness remains unset.",
    customer: "Agnes Mumba",
    tasker: "Derrick Phiri",
    vendor: "CityCare Pharmacy",
    timeline: [
      { label: "Order accepted", detail: "Merchant accepted but did not progress prep state.", time: "07:09" },
      { label: "Prep SLA missed", detail: "Dispatch marked prep as late after threshold breach.", time: "07:28" },
      { label: "Vendor ops alert", detail: "Vendor-side readiness intervention needed.", time: "07:34" },
    ],
    notes: ["Best handled with merchant-side readiness context, not only trip tracking."],
  },
];

function DispatchDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: DispatchException;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "reassign" ? "manual_reassignment" : action === "escalate" ? "cross_team_escalation" : "operational_cancellation",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "reassign"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "escalate"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "reassign" ? "Reassign exception" : action === "escalate" ? "Escalate case" : "Cancel workflow"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the dispatch outcome for {item.reference} so the next team sees the same operational trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Manual reassignment", value: "manual_reassignment" },
            { label: "Cross-team escalation", value: "cross_team_escalation" },
            { label: "Vendor-side delay", value: "vendor_side_delay" },
            { label: "Tasker unreachable", value: "tasker_unreachable" },
            { label: "Operational cancellation", value: "operational_cancellation" },
          ]}
          value={reasonCode}
          onChange={(option: any) => setReasonCode(option?.value ?? "")}
          selectClassName="rounded-2xl"
        />
        <div>
          <Text className="mb-2 text-sm font-medium text-gray-700">Operator note</Text>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Add the dispatch decision, customer impact, or handoff reason."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "reassign" ? "Confirm reassignment" : action === "escalate" ? "Confirm escalation" : "Confirm cancellation"}
        </Button>
      </div>
    </div>
  );
}

function DispatchExceptionDrawer({
  item,
  onApplyDecision,
}: {
  item: DispatchException;
  onApplyDecision: (id: string, action: DecisionAction, reasonCode: string, note: string) => void;
}) {
  const { closeDrawer } = useDrawer();
  const [decision, setDecision] = useState<DecisionAction | null>(null);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-100 px-6 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <Title as="h3" className="text-xl font-semibold text-gray-900">{item.reference}</Title>
            <Text className="mt-2 text-sm text-gray-500">
              {typeLabels[item.type]} · {item.city} · {item.lane}
            </Text>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Priority" value={item.priority.toUpperCase()} />
          <InfoTile label="Queue owner" value={item.owner} />
          <InfoTile label="Age" value={item.age} />
          <InfoTile label="Exception type" value={typeLabels[item.type]} />
        </div>

        <section className="rounded-3xl border border-gray-200 bg-gray-50/70 p-5">
          <Title as="h4" className="text-sm font-semibold text-gray-900">Current issue</Title>
          <Text className="mt-3 text-sm leading-6 text-gray-600">{item.issue}</Text>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <InfoTile label="Customer" value={item.customer} />
          <InfoTile label="Tasker" value={item.tasker} />
          <InfoTile label="Vendor / source" value={item.vendor} />
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">Timeline</Title>
          <div className="mt-4 space-y-3">
            {item.timeline.map((entry) => (
              <div key={`${entry.label}-${entry.time}`} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{entry.label}</Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-500">{entry.detail}</Text>
                  </div>
                  <Text className="text-xs font-medium text-gray-500">{entry.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">Internal notes</Title>
          <div className="mt-4 space-y-3">
            {item.notes.map((note) => (
              <div key={note} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <Text className="text-sm leading-6 text-gray-600">{note}</Text>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-gray-100 px-6 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            className="h-11 rounded-2xl border-red-200 px-4 text-red-dark hover:border-red-dark hover:bg-red-lighter/50"
            onClick={() => setDecision("cancel")}
          >
            Cancel
          </Button>
          <Button
            className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90"
            onClick={() => setDecision("escalate")}
          >
            Escalate
          </Button>
          <Button
            className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
            onClick={() => setDecision("reassign")}
          >
            Reassign
          </Button>
        </div>
      </div>

      <Modal isOpen={decision !== null} onClose={() => setDecision(null)} size="md" rounded="lg">
        {decision ? (
          <DispatchDecisionModal
            item={item}
            action={decision}
            onClose={() => setDecision(null)}
            onSubmit={({ reasonCode, note }) => {
              onApplyDecision(item.id, decision, reasonCode, note);
              setDecision(null);
              closeDrawer();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</Text>
      <Text className="mt-2 font-semibold text-gray-900">{value}</Text>
    </div>
  );
}

export default function DispatchExceptionQueuePage() {
  const { openDrawer } = useDrawer();
  const [exceptions, setExceptions] = useState(seed);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  const visibleExceptions = useMemo(() => {
    return exceptions.filter((item) => {
      const matchesType = activeTab === "all" ? true : item.type === activeTab;
      const matchesOwner = ownerFilter === "all" ? true : item.owner === ownerFilter;
      const haystack = [
        item.id,
        item.reference,
        item.issue,
        item.customer,
        item.tasker,
        item.vendor,
        item.city,
        item.owner,
      ]
        .join(" ")
        .toLowerCase();
      return matchesType && matchesOwner && haystack.includes(query.toLowerCase());
    });
  }, [activeTab, exceptions, ownerFilter, query]);

  const ownerOptions = useMemo(() => {
    const owners = Array.from(new Set(exceptions.map((item) => item.owner)));
    return [{ label: "All owners", value: "all" }, ...owners.map((owner) => ({ label: owner, value: owner }))];
  }, [exceptions]);

  const counts = useMemo(
    () => ({
      open: exceptions.filter((item) => item.status === "review" || item.status === "queued").length,
      critical: exceptions.filter((item) => item.priority === "critical").length,
      liveRisk: exceptions.filter((item) => item.status === "at_risk" || item.status === "monitoring").length,
    }),
    [exceptions],
  );

  const openException = (item: DispatchException) => {
    openDrawer({
      placement: "right",
      containerClassName: "w-full max-w-[620px] bg-white p-0",
      view: (
        <DispatchExceptionDrawer
          item={item}
          onApplyDecision={(id, action, reasonCode, note) => {
            setExceptions((current) =>
              current.map((entry) => {
                if (entry.id !== id) return entry;
                if (action === "reassign") {
                  return {
                    ...entry,
                    status: "monitoring",
                    owner: "Dispatch reassignment",
                    issue: "Manual reassignment or route recovery is now in progress.",
                    notes: [`Reassigned: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                    timeline: [
                      { label: "Reassignment action taken", detail: note || `Reassigned with reason code ${reasonCode}.`, time: "Now" },
                      ...entry.timeline,
                    ],
                  };
                }
                if (action === "escalate") {
                  return {
                    ...entry,
                    status: "review",
                    owner: "Cross-team escalation",
                    issue: "Case is now waiting on another ops team with dispatch context attached.",
                    notes: [`Escalated: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                    timeline: [
                      { label: "Cross-team escalation sent", detail: note || `Escalated with reason code ${reasonCode}.`, time: "Now" },
                      ...entry.timeline,
                    ],
                  };
                }
                return {
                  ...entry,
                  status: "paused",
                  owner: "Dispatch closed",
                  issue: "Operational flow was cancelled and should now follow the downstream resolution path.",
                  notes: [`Cancelled: ${reasonCode}. ${note}`.trim(), ...entry.notes],
                  timeline: [
                    { label: "Operational cancellation applied", detail: note || `Cancelled with reason code ${reasonCode}.`, time: "Now" },
                    ...entry.timeline,
                  ],
                };
              }),
            );
          }}
        />
      ),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dispatch", "Exceptions"]}
        eyebrow="Dispatch Ops"
        title="Dispatch exception queue"
        description="Handle real operational breakage from a proper recovery queue instead of a passive logistics list."
        badge="Queue"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Open exceptions"
          value={String(counts.open)}
          change="Needs operator action"
          tone="neutral"
          detail="Exceptions still waiting for dispatch triage or intervention."
        />
        <StatCard
          label="Critical cases"
          value={String(counts.critical)}
          change="Live risk"
          tone="warning"
          detail="Exceptions with the highest customer, SLA, or safety impact."
        />
        <StatCard
          label="Live monitoring"
          value={String(counts.liveRisk)}
          change="Still unstable"
          tone="warning"
          detail="Cases that may recover, but are not yet safely resolved."
        />
      </div>

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            const count = tab.value === "all" ? exceptions.length : exceptions.filter((item) => item.type === tab.value).length;
            return (
              <button
                key={tab.value}
                className="relative flex items-center gap-2 py-2 text-sm outline-none"
                onClick={() => setActiveTab(tab.value)}
              >
                <span className={isActive ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-800"}>
                  {tab.label}
                </span>
                <Badge size="sm" variant={isActive ? "solid" : "flat"}>
                  {count}
                </Badge>
                <span className={`absolute -bottom-px left-0 h-0.5 w-full ${isActive ? "bg-primary" : "bg-transparent"}`} />
              </button>
            );
          })}
        </nav>
      </div>

      <ShellCard title="Recovery queue" description="Queue-first dispatch exception handling with case inspection and controlled action paths.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              placeholder="Search exception, reference, customer, tasker, vendor, or issue"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-11"
            />
            <Select
              options={ownerOptions}
              value={ownerFilter}
              onChange={(option: any) => setOwnerFilter(option?.value ?? "all")}
              className="min-w-[220px]"
              selectClassName="h-11 rounded-2xl"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={() => setExceptions(seed)}>
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset demo state
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table variant="modern" className="min-w-[1120px]">
            <Table.Header>
              <Table.Row>
                <Table.Head className="bg-gray-100">Reference</Table.Head>
                <Table.Head className="bg-gray-100">Exception type</Table.Head>
                <Table.Head className="bg-gray-100">Issue</Table.Head>
                <Table.Head className="bg-gray-100">Owner</Table.Head>
                <Table.Head className="bg-gray-100">Age</Table.Head>
                <Table.Head className="bg-gray-100">Status</Table.Head>
                <Table.Head className="bg-gray-100 text-right">Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleExceptions.map((item) => (
                <Table.Row key={item.id} className="cursor-pointer" onClick={() => openException(item)}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.reference}
                        initials={item.reference.slice(0, 2)}
                        className="bg-primary/10 text-primary"
                      />
                      <div>
                        <Text className="font-semibold text-gray-900">{item.reference}</Text>
                        <Text className="mt-1 text-sm text-gray-500">
                          {item.id} · {item.city} · {item.lane}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text className="font-medium text-gray-900">{typeLabels[item.type]}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{item.priority.toUpperCase()} priority</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-start gap-2">
                      <PiWarningCircleBold className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground" />
                      <Text className="text-sm leading-6 text-gray-600">{item.issue}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-medium text-gray-900">{item.owner}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-medium text-gray-900">{item.age}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={item.status} />
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button
                      variant="text"
                      className="h-auto p-0 text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        openException(item);
                      }}
                    >
                      Review
                      <PiCaretRightBold className="ms-1 h-4 w-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </ShellCard>
    </div>
  );
}
