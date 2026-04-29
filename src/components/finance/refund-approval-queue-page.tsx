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
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { routes } from "@/config/routes";
import { Modal } from "@/components/modal";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type RefundLane = "auto_policy" | "manual" | "partial";
type DecisionAction = "approve" | "hold" | "deny";

type RefundCase = {
  id: string;
  reference: string;
  lane: RefundLane;
  customerName: string;
  city: string;
  status: ReviewStatus;
  amount: string;
  destination: string;
  owner: string;
  age: string;
  issue: string;
  sourceSummary: string;
  riskFlags: string[];
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

const laneLabels: Record<RefundLane, string> = {
  auto_policy: "Auto-policy",
  manual: "Manual review",
  partial: "Partial recovery",
};

const tabs = [
  { value: "all", label: "All refunds" },
  { value: "auto_policy", label: "Auto-policy" },
  { value: "manual", label: "Manual" },
  { value: "partial", label: "Partial" },
] as const;

const seed: RefundCase[] = [
  {
    id: "REF-4204",
    reference: "ORD-88214",
    lane: "manual",
    customerName: "Loveness Phiri",
    city: "Lusaka",
    status: "review",
    amount: "ZMW 186",
    destination: "Wallet refund",
    owner: "Refund desk",
    age: "12m",
    issue: "Merchant delay and missing-item evidence point to recovery, but the amount needs finance sign-off because the order also included a platform coupon.",
    sourceSummary: "Coupon-linked order with missing-item claim and refund request",
    riskFlags: ["Coupon adjustment", "Merchant evidence attached"],
    timeline: [
      { label: "Refund request opened", detail: "Support sent the case into finance review.", time: "09:11" },
      { label: "Coupon offset flagged", detail: "Recovery value should exclude the platform-funded promo share.", time: "09:18" },
      { label: "Manual review started", detail: "Refund desk should validate the final payable amount.", time: "09:23" },
    ],
    notes: ["Likely approvable after separating promo-funded value from merchant-funded value."],
    links: [
      { label: "Support disputes", href: routes.supportDesk.disputes },
      { label: "Payments", href: routes.sales.payments },
    ],
  },
  {
    id: "REF-4198",
    reference: "ORD-88197",
    lane: "partial",
    customerName: "Chisomo Tembo",
    city: "Kitwe",
    status: "monitoring",
    amount: "ZMW 72",
    destination: "Wallet refund",
    owner: "Service recovery",
    age: "26m",
    issue: "Delivery arrived late, but the order was completed. Support proposed a partial goodwill credit rather than a full refund.",
    sourceSummary: "Completed delivery with lateness-based partial recovery",
    riskFlags: ["Service recovery", "No merchant fault"],
    timeline: [
      { label: "Case escalated", detail: "Support proposed partial recovery after delay review.", time: "08:41" },
      { label: "Policy checked", detail: "Service recovery thresholds matched the partial-credit lane.", time: "08:54" },
      { label: "Waiting release", detail: "Finance should confirm wallet disbursement value.", time: "09:03" },
    ],
    notes: ["Good candidate for fast approval if no duplicate credit exists."],
    links: [
      { label: "Support tickets", href: routes.supportDesk.tickets },
      { label: "Customers", href: routes.crm.customers },
    ],
  },
  {
    id: "REF-4189",
    reference: "ORD-88144",
    lane: "manual",
    customerName: "Agnes Mumba",
    city: "Kabwe",
    status: "at_risk",
    amount: "ZMW 412",
    destination: "Card reversal",
    owner: "Payments review",
    age: "39m",
    issue: "Customer was charged twice during checkout retry. One capture appears to have settled, and the other is still unresolved in the gateway trail.",
    sourceSummary: "Potential duplicate charge linked to payment gateway retry path",
    riskFlags: ["Duplicate capture", "Gateway mismatch"],
    timeline: [
      { label: "Refund request created", detail: "Customer reported a duplicated charge after payment retry.", time: "08:02" },
      { label: "Gateway mismatch found", detail: "Only one order settlement is visible in the marketplace ledger.", time: "08:15" },
      { label: "Risk hold applied", detail: "Do not release reversal until payments confirms source movement.", time: "08:23" },
    ],
    notes: ["This should not auto-approve until gateway reconciliation is complete."],
    links: [
      { label: "Payments", href: routes.sales.payments },
      { label: "Support disputes", href: routes.supportDesk.disputes },
    ],
  },
  {
    id: "REF-4174",
    reference: "ORD-88083",
    lane: "auto_policy",
    customerName: "Brian Zulu",
    city: "Ndola",
    status: "queued",
    amount: "ZMW 92",
    destination: "Wallet refund",
    owner: "Auto-refund monitor",
    age: "51m",
    issue: "Order canceled after delay threshold passed, but the refund is still waiting for wallet confirmation after the auto-policy engine approved it.",
    sourceSummary: "Auto-approved cancellation refund awaiting wallet posting",
    riskFlags: ["Wallet posting pending"],
    timeline: [
      { label: "Auto-policy approved", detail: "Delay threshold released the refund automatically.", time: "07:24" },
      { label: "Disbursement queued", detail: "Wallet posting has not yet been confirmed.", time: "07:37" },
    ],
    notes: ["This should clear as soon as wallet confirmation lands."],
    links: [
      { label: "Payments", href: routes.sales.payments },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "REF-4168",
    reference: "ORD-88022",
    lane: "partial",
    customerName: "Natasha Chinyama",
    city: "Lusaka",
    status: "paused",
    amount: "ZMW 54",
    destination: "Wallet credit",
    owner: "Refund governance",
    age: "1h 07m",
    issue: "Support proposed partial recovery, but the customer account is tied to an open abuse review so disbursement is paused pending trust clearance.",
    sourceSummary: "Partial recovery blocked behind trust and abuse review",
    riskFlags: ["Trust dependency", "Abuse review open"],
    timeline: [
      { label: "Recovery proposed", detail: "Support recommended a partial wallet credit.", time: "06:42" },
      { label: "Trust dependency found", detail: "Customer account is linked to an unresolved abuse review.", time: "06:53" },
      { label: "Refund paused", detail: "Finance should wait for trust clearance before releasing value.", time: "07:00" },
    ],
    notes: ["No credit should be issued until the abuse review closes."],
    links: [
      { label: "Support escalations", href: routes.supportDesk.escalations },
      { label: "Safety compliance", href: routes.risk.compliance },
    ],
  },
];

function RefundDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: RefundCase;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "approve" ? "refund_approved" : action === "hold" ? "manual_hold" : "refund_denied",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "approve"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "hold"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "approve" ? "Approve refund" : action === "hold" ? "Place refund on hold" : "Deny refund"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the finance outcome for {item.reference} so Support, Payments, and Refund Ops see the same trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Refund approved", value: "refund_approved" },
            { label: "Partial recovery approved", value: "partial_recovery_approved" },
            { label: "Manual hold", value: "manual_hold" },
            { label: "Gateway verification pending", value: "gateway_verification_pending" },
            { label: "Refund denied", value: "refund_denied" },
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
            placeholder="Add the release, hold, or denial context the next operator will need."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "approve" ? "Confirm approval" : action === "hold" ? "Confirm hold" : "Confirm denial"}
        </Button>
      </div>
    </div>
  );
}

function RefundDrawer({
  item,
  onApplyDecision,
}: {
  item: RefundCase;
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
              {laneLabels[item.lane]} · {item.customerName} · {item.city}
            </Text>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Refund amount" value={item.amount} />
          <InfoTile label="Destination" value={item.destination} />
          <InfoTile label="Current owner" value={item.owner} />
          <InfoTile label="Age in queue" value={item.age} />
        </div>

        <SectionBlock title="Case summary">
          <Text className="text-sm leading-6 text-gray-600">{item.issue}</Text>
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Source context</Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600">{item.sourceSummary}</Text>
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

        <SectionBlock title="Risk and policy flags">
          <div className="flex flex-wrap gap-2">
            {item.riskFlags.map((flag) => (
              <Badge key={flag} variant="flat" color="warning" rounded="pill">
                {flag}
              </Badge>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Refund trail">
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
          <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90" onClick={() => setDecision("approve")}>
            Approve refund
          </Button>
          <Button className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90" onClick={() => setDecision("hold")}>
            Hold
          </Button>
          <Button className="h-11 rounded-2xl bg-red-dark px-4 text-white hover:bg-red-dark/90" onClick={() => setDecision("deny")}>
            Deny
          </Button>
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={closeDrawer}>
            Close
          </Button>
        </div>
      </div>

      {decision ? (
        <Modal isOpen onClose={() => setDecision(null)} containerClassName="max-w-xl">
          <RefundDecisionModal
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

export default function RefundApprovalQueuePage() {
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
      const haystack = [item.id, item.reference, item.customerName, item.city, item.issue].join(" ").toLowerCase();
      return matchesLane && matchesOwner && (!needle || haystack.includes(needle));
    });
  }, [cases, lane, owner, query]);

  const ownerOptions = useMemo(() => {
    const values = Array.from(new Set(seed.map((item) => item.owner)));
    return [{ label: "All owners", value: "all" }, ...values.map((value) => ({ label: value, value }))];
  }, []);

  const stats = useMemo(() => {
    const open = filteredCases.length;
    const urgent = filteredCases.filter((item) => item.status === "review" || item.status === "at_risk").length;
    const partial = filteredCases.filter((item) => item.lane === "partial").length;
    return { open, urgent, partial };
  }, [filteredCases]);

  function applyDecision(id: string, action: DecisionAction, reasonCode: string, note: string) {
    setCases((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const status: ReviewStatus = action === "approve" ? "live" : action === "hold" ? "monitoring" : "paused";
        const timelineLabel =
          action === "approve" ? "Refund approved" : action === "hold" ? "Refund held" : "Refund denied";

        return {
          ...item,
          status,
          owner: action === "hold" ? "Finance follow-up" : item.owner,
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
        breadcrumb={["Home", "Sales", "Refunds"]}
        eyebrow="Commerce"
        title="Refunds"
        description="Refund requests and exceptions."
        badge="Refunds"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Open refund claims"
          value={String(stats.open)}
          change="Working set"
          tone="warning"
          detail="Claims currently sitting in the active refund queue."
        />
        <StatCard
          label="Urgent review"
          value={String(stats.urgent)}
          change="Needs decision"
          tone="warning"
          detail="Cases with review or risk pressure that should not wait in the queue."
        />
        <StatCard
          label="Partial recovery"
          value={String(stats.partial)}
          change="Service recovery"
          tone="neutral"
          detail="Claims using calibrated compensation instead of a full refund."
        />
      </div>

      <ShellCard
        title="Refund approval queue"
        description="Review and decide."
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
              placeholder="Search refunds, orders, customers..."
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
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Case</Table.Head>
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Lane</Table.Head>
                <Table.Head className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Amount</Table.Head>
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
                      <Avatar name={item.customerName} size="sm" rounded="full" />
                      <div>
                        <Text className="font-semibold text-gray-900">{item.reference}</Text>
                        <Text className="text-xs uppercase tracking-[0.18em] text-gray-400">{item.id}</Text>
                        <Text className="mt-2 text-sm leading-6 text-gray-500">{item.issue}</Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4">
                    <div>
                      <Badge variant="flat" color="info" rounded="pill">{laneLabels[item.lane]}</Badge>
                      <Text className="mt-2 text-sm text-gray-500">{item.city}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-4">
                    <Text className="font-semibold text-gray-900">{item.amount}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.destination}</Text>
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
                            view: <RefundDrawer item={item} onApplyDecision={applyDecision} />,
                            placement: "right",
                            containerClassName: "max-w-[540px]",
                          })
                        }
                      >
                        Review case
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
            <Title as="h4" className="mt-3 text-base font-semibold text-gray-900">No refunds match this filter set</Title>
            <Text className="mt-2 text-sm text-gray-500">Clear one or more filters to return to the active refund queue.</Text>
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
