"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Avatar, Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiCaretRightBold,
  PiMagnifyingGlassBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import { useDrawer } from "@/app/shared/drawer-views/use-drawer";
import { vendorDetailHrefByName } from "@/components/admin/ops-workflow-links";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { Modal } from "@/components/modal";
import { routes } from "@/config/routes";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type EscalationLane = "trust" | "vip" | "partner";
type DecisionAction = "assign" | "escalate" | "close";

type EscalationCase = {
  id: string;
  accountName: string;
  lane: EscalationLane;
  city: string;
  status: ReviewStatus;
  owner: string;
  age: string;
  summary: string;
  impact: string;
  tags: string[];
  timeline: Array<{
    label: string;
    detail: string;
    time: string;
  }>;
  notes: string[];
  links: Array<{
    label: string;
    href: string;
  }>;
};

const laneLabels: Record<EscalationLane, string> = {
  trust: "Trust",
  vip: "VIP",
  partner: "Partner",
};

const tabs = [
  { value: "all", label: "All escalations" },
  { value: "trust", label: "Trust" },
  { value: "vip", label: "VIP" },
  { value: "partner", label: "Partner" },
] as const;

const seed: EscalationCase[] = [
  {
    id: "ESC-4210",
    accountName: "Natasha Chinyama",
    lane: "trust",
    city: "Lusaka",
    status: "review",
    owner: "Trust support",
    age: "14m",
    summary: "Customer and tasker both filed conduct complaints after a delivery chat escalated into abuse claims.",
    impact: "Support cannot close the case until trust decides whether account action is needed.",
    tags: ["Conduct review", "Two-sided complaint"],
    timeline: [
      { label: "Escalation opened", detail: "Support marked the case as sensitive and routed it to trust.", time: "09:16" },
      { label: "Evidence bundle attached", detail: "Chat log, call attempts, and complaint notes were added.", time: "09:24" },
      { label: "Awaiting trust decision", detail: "Escalation is active pending a final account-action call.", time: "09:31" },
    ],
    notes: ["Do not let frontline support close this without trust sign-off."],
    links: [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Disputes", href: routes.supportDesk.disputes },
    ],
  },
  {
    id: "ESC-4201",
    accountName: "Chisomo Tembo",
    lane: "vip",
    city: "Kitwe",
    status: "monitoring",
    owner: "VIP recovery",
    age: "26m",
    summary: "A high-value customer had two failed orders in one day and is threatening to stop using the platform.",
    impact: "Requires white-glove service recovery and coordinated follow-up from support and operations.",
    tags: ["VIP recovery", "Retention risk"],
    timeline: [
      { label: "Escalation opened", detail: "Customer profile was flagged for premium recovery handling.", time: "08:52" },
      { label: "Ops notes added", detail: "Operations confirmed one issue was route-related, the other merchant-related.", time: "09:03" },
      { label: "Recovery proposal pending", detail: "Support lead should approve the response package.", time: "09:12" },
    ],
    notes: ["Likely a same-day recovery case if handled tightly."],
    links: [
      { label: "Customers", href: routes.crm.customers },
      { label: "Manual dispatch", href: routes.dispatch.manualDispatch },
    ],
  },
  {
    id: "ESC-4193",
    accountName: "Green Basket Market",
    lane: "partner",
    city: "Kitwe",
    status: "at_risk",
    owner: "Partner escalation desk",
    age: "41m",
    summary: "Merchant reports a storefront outage during peak demand and says active orders are failing to route correctly.",
    impact: "Commercial exposure is elevated because the outage affects multiple customer orders and partner confidence.",
    tags: ["Storefront outage", "Commercial risk"],
    timeline: [
      { label: "Escalation opened", detail: "Merchant-support ticket was promoted to escalation after repeated failures.", time: "08:07" },
      { label: "Marketplace context added", detail: "Publishing and routing anomalies were linked into the case.", time: "08:19" },
      { label: "Cross-team risk raised", detail: "Escalation needs support, marketplace, and ops coordination.", time: "08:28" },
    ],
    notes: ["Needs a coordinated update, not isolated replies from separate teams."],
    links: [
      { label: "Vendor record", href: vendorDetailHrefByName["Green Basket Market"] },
      { label: "Shipments", href: routes.logistics.shipments },
    ],
  },
  {
    id: "ESC-4184",
    accountName: "Brian Zulu",
    lane: "vip",
    city: "Ndola",
    status: "queued",
    owner: "Support lead",
    age: "53m",
    summary: "Customer has repeated refund and lateness complaints and requested direct leadership review.",
    impact: "Escalation should decide if this remains in care or moves into finance-linked service recovery.",
    tags: ["Leadership review", "Repeat complaints"],
    timeline: [
      { label: "Escalation opened", detail: "Customer requested leadership review after repeated service failures.", time: "07:29" },
      { label: "History added", detail: "Past refunds and ticket clusters were attached to the case.", time: "07:44" },
    ],
    notes: ["This may move into disputes if a new refund request is added."],
    links: [
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Disputes", href: routes.supportDesk.disputes },
    ],
  },
  {
    id: "ESC-4178",
    accountName: "CityCare Pharmacy",
    lane: "partner",
    city: "Ndola",
    status: "paused",
    owner: "Compliance support",
    age: "1h 08m",
    summary: "Restricted-category merchant escalation is blocked because compliance still has an unresolved review on one document.",
    impact: "Support should not promise a launch or reopen service until compliance clears the blocker.",
    tags: ["Restricted category", "Compliance dependency"],
    timeline: [
      { label: "Escalation opened", detail: "Merchant complained about delayed enablement and order visibility.", time: "06:45" },
      { label: "Compliance dependency found", detail: "A pending document review blocks the commercial resolution path.", time: "06:56" },
      { label: "Paused", detail: "Escalation should wait until compliance closes the dependency.", time: "07:03" },
    ],
    notes: ["This is blocked upstream, not a pure support issue."],
    links: [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Vendor record", href: vendorDetailHrefByName["CityCare Pharmacy"] },
    ],
  },
];

function EscalationDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: EscalationCase;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "assign" ? "assigned_for_follow_up" : action === "escalate" ? "cross_team_escalation" : "escalation_closed",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "assign"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "escalate"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "assign" ? "Assign escalation" : action === "escalate" ? "Escalate further" : "Close escalation"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the escalation outcome for {item.accountName} so support and partner teams read the same case trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Assigned for follow-up", value: "assigned_for_follow_up" },
            { label: "Cross-team escalation", value: "cross_team_escalation" },
            { label: "Trust handoff", value: "trust_handoff" },
            { label: "Partner ops handoff", value: "partner_ops_handoff" },
            { label: "Escalation closed", value: "escalation_closed" },
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
            placeholder="Add the assignment, escalation, or closure context the next operator will need."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "assign" ? "Confirm assignment" : action === "escalate" ? "Confirm escalation" : "Confirm closure"}
        </Button>
      </div>
    </div>
  );
}

function EscalationDrawer({
  item,
  onApplyDecision,
}: {
  item: EscalationCase;
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
            <Title as="h3" className="text-xl font-semibold text-gray-900">{item.accountName}</Title>
            <Text className="mt-2 text-sm text-gray-500">
              {laneLabels[item.lane]} escalation · {item.city}
            </Text>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Escalation lane" value={laneLabels[item.lane]} />
          <InfoTile label="Current owner" value={item.owner} />
          <InfoTile label="Age in queue" value={item.age} />
          <InfoTile label="City" value={item.city} />
        </div>

        <SectionBlock title="Case summary">
          <Text className="text-sm leading-6 text-gray-600">{item.summary}</Text>
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Impact</Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600">{item.impact}</Text>
          </div>
        </SectionBlock>

        <SectionBlock title="Related workflow">
          <div className="flex flex-wrap gap-3">
            {item.links.map((link) => (
              <Link key={link.label} href={link.href}>
                <Button variant="outline" className="h-10 rounded-2xl px-4">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Escalation tags">
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="flat" color="warning" rounded="pill">
                {tag}
              </Badge>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Escalation trail">
          <div className="space-y-4">
            {item.timeline.map((entry) => (
              <div key={`${entry.label}-${entry.time}`} className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <Text className="font-semibold text-gray-900">{entry.label}</Text>
                    <Text className="text-xs uppercase tracking-[0.18em] text-gray-400">{entry.time}</Text>
                  </div>
                  <Text className="mt-1 text-sm leading-6 text-gray-600">{entry.detail}</Text>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Operator notes">
          <div className="space-y-3">
            {item.notes.map((note) => (
              <div key={note} className="rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-4 py-3">
                <Text className="text-sm leading-6 text-gray-700">{note}</Text>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>

      <div className="border-t border-gray-100 px-6 py-5">
        <div className="flex flex-wrap gap-3">
          <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90" onClick={() => setDecision("assign")}>
            Assign
          </Button>
          <Button className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90" onClick={() => setDecision("escalate")}>
            Escalate
          </Button>
          <Button className="h-11 rounded-2xl bg-red-dark px-4 text-white hover:bg-red-dark/90" onClick={() => setDecision("close")}>
            Close
          </Button>
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={closeDrawer}>
            Close panel
          </Button>
        </div>
      </div>

      {decision ? (
        <Modal isOpen onClose={() => setDecision(null)} containerClassName="max-w-xl">
          <EscalationDecisionModal
            item={item}
            action={decision}
            onClose={() => setDecision(null)}
            onSubmit={({ reasonCode, note }) => {
              onApplyDecision(item.id, decision, reasonCode, note);
              setDecision(null);
              closeDrawer();
            }}
          />
        </Modal>
      ) : null}
    </div>
  );
}

export default function SupportEscalationQueuePage() {
  const { openDrawer } = useDrawer();
  const [lane, setLane] = useState<(typeof tabs)[number]["value"]>("all");
  const [owner, setOwner] = useState("all");
  const [query, setQuery] = useState("");
  const [cases, setCases] = useState(seed);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesLane = lane === "all" ? true : item.lane === lane;
      const matchesOwner = owner === "all" ? true : item.owner === owner;
      const needle = query.trim().toLowerCase();
      const haystack = [item.id, item.accountName, item.city, item.summary, item.impact].join(" ").toLowerCase();
      return matchesLane && matchesOwner && (!needle || haystack.includes(needle));
    });
  }, [cases, lane, owner, query]);

  const ownerOptions = useMemo(() => {
    const values = Array.from(new Set(seed.map((item) => item.owner)));
    return [{ label: "All owners", value: "all" }, ...values.map((value) => ({ label: value, value }))];
  }, []);

  const stats = useMemo(() => {
    const active = filteredCases.length;
    const crossTeam = filteredCases.filter((item) => item.status === "at_risk" || item.status === "review").length;
    const partner = filteredCases.filter((item) => item.lane === "partner").length;
    return { active, crossTeam, partner };
  }, [filteredCases]);

  function applyDecision(id: string, action: DecisionAction, reasonCode: string, note: string) {
    setCases((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const status: ReviewStatus = action === "assign" ? "live" : action === "escalate" ? "monitoring" : "paused";
        const timelineLabel =
          action === "assign" ? "Escalation assigned" : action === "escalate" ? "Cross-team escalation sent" : "Escalation closed";
        return {
          ...item,
          status,
          owner: action === "escalate" ? "Cross-team escalation" : item.owner,
          notes: [note || `Decision recorded: ${reasonCode}.`, ...item.notes],
          timeline: [
            {
              label: timelineLabel,
              detail: `Operator action saved with code ${reasonCode}.`,
              time: "Just now",
            },
            ...item.timeline,
          ],
        };
      }),
    );
  }

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Escalations"]}
        eyebrow="Support CRM"
        title="Escalations"
        description="High-priority escalations."
        badge="Escalations"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active escalations"
          value={String(stats.active)}
          change="Working set"
          tone="warning"
          detail="Escalations currently sitting in the active senior-support queue."
        />
        <StatCard
          label="Cross-team risk"
          value={String(stats.crossTeam)}
          change="Needs attention"
          tone="warning"
          detail="Cases with risk or coordination pressure that should not sit unattended."
        />
        <StatCard
          label="Partner cases"
          value={String(stats.partner)}
          change="Commercial impact"
          tone="neutral"
          detail="Merchant-facing escalations with operational or commercial consequences."
        />
      </div>

      <ShellCard
        title="Escalation queue"
        description="Assign, escalate, close."
      >
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = lane === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setLane(tab.value)}
                  className={`inline-flex h-10 items-center rounded-2xl px-4 text-sm font-semibold transition ${
                    active ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_140px]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search escalations, accounts, impact..."
              rounded="lg"
              prefix={<PiMagnifyingGlassBold className="h-4 w-4 text-gray-400" />}
            />
            <Select
              options={ownerOptions}
              value={owner}
              onChange={(option: any) => setOwner(option?.value ?? "all")}
              selectClassName="rounded-2xl"
            />
            <Button
              variant="outline"
              className="h-11 rounded-2xl px-4"
              onClick={() => {
                setLane("all");
                setOwner("all");
                setQuery("");
              }}
            >
              <PiArrowClockwiseBold className="me-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
          <Table>
            <Table.Header>
              <Table.Row className="bg-gray-50/80">
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Escalation</Table.Head>
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Lane</Table.Head>
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Impact</Table.Head>
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Owner</Table.Head>
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Status</Table.Head>
                <Table.Head className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Open</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredCases.map((item) => (
                <Table.Row key={item.id} className="border-t border-gray-100 text-sm text-gray-700">
                  <Table.Cell className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={item.accountName} size="sm" rounded="full" />
                      <div>
                        <Text className="font-semibold text-gray-900">{item.accountName}</Text>
                        <Text className="text-xs uppercase tracking-[0.18em] text-gray-400">{item.id}</Text>
                        <Text className="mt-2 text-sm leading-6 text-gray-500">{item.summary}</Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4">
                    <div>
                      <Badge variant="flat" color="warning" rounded="pill">{laneLabels[item.lane]}</Badge>
                      <Text className="mt-2 text-sm text-gray-500">{item.city}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4">
                    <Text className="font-semibold text-gray-900">{item.impact}</Text>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4">
                    <Text className="font-semibold text-gray-900">{item.owner}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.age} in queue</Text>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <Link href={item.links[0].href} className="text-xs font-semibold text-gray-500 transition hover:text-primary">
                        {item.links[0].label}
                      </Link>
                      <Button
                        variant="text"
                        className="h-auto p-0 text-primary hover:text-primary/80"
                        onClick={() =>
                          openDrawer({
                            view: <EscalationDrawer item={item} onApplyDecision={applyDecision} />,
                            placement: "right",
                            containerClassName: "max-w-[540px]",
                          })
                        }
                      >
                        Open
                        <PiCaretRightBold className="ms-1 h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {!filteredCases.length ? (
          <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-8 text-center">
            <PiWarningCircleBold className="mx-auto h-8 w-8 text-primary/60" />
            <Title as="h4" className="mt-3 text-base font-semibold text-gray-900">No escalations match this filter set</Title>
            <Text className="mt-2 text-sm text-gray-500">Clear one or more filters to return to the active escalation queue.</Text>
          </div>
        ) : null}
      </ShellCard>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{title}</Text>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</Text>
      <Text className="mt-2 text-sm font-semibold text-gray-900">{value}</Text>
    </div>
  );
}
