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
import { customerDetailHrefByName } from "@/components/admin/ops-workflow-links";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { routes } from "@/config/routes";
import { Modal } from "@/components/modal";

type ReviewStatus = "review" | "queued" | "monitoring" | "live" | "paused" | "at_risk";
type PaymentLane = "retry" | "chargeback" | "reconciliation";
type DecisionAction = "retry" | "escalate" | "close";

type PaymentCase = {
  id: string;
  reference: string;
  lane: PaymentLane;
  customerName: string;
  city: string;
  status: ReviewStatus;
  amount: string;
  method: string;
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

const laneLabels: Record<PaymentLane, string> = {
  retry: "Retry handling",
  chargeback: "Chargeback review",
  reconciliation: "Reconciliation",
};

const tabs = [
  { value: "all", label: "All payments" },
  { value: "retry", label: "Retries" },
  { value: "chargeback", label: "Chargebacks" },
  { value: "reconciliation", label: "Reconciliation" },
] as const;

const seed: PaymentCase[] = [
  {
    id: "PAYM-4204",
    reference: "ORD-88314",
    lane: "retry",
    customerName: "Loveness Phiri",
    city: "Lusaka",
    status: "review",
    amount: "ZMW 186",
    method: "Card ••• 2204",
    owner: "Payments ops",
    age: "10m",
    issue: "Primary card capture failed, wallet fallback was not attempted, and the customer is still trying to complete checkout.",
    sourceSummary: "Checkout failure with eligible wallet fallback path",
    riskFlags: ["Retry candidate", "Fallback available"],
    timeline: [
      { label: "Capture failed", detail: "Gateway returned a soft decline during checkout.", time: "09:21" },
      { label: "Fallback missed", detail: "Wallet backup path did not trigger after the decline.", time: "09:23" },
      { label: "Retry review opened", detail: "Payments ops should decide the next recovery step.", time: "09:27" },
    ],
    notes: ["Likely a clean retry or fallback release case."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Loveness Phiri"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "PAYM-4198",
    reference: "ORD-88297",
    lane: "chargeback",
    customerName: "Chisomo Tembo",
    city: "Kitwe",
    status: "monitoring",
    amount: "ZMW 312",
    method: "Visa ••• 1930",
    owner: "Chargeback desk",
    age: "24m",
    issue: "Issuer-side reversal was opened after the order completed, but merchant evidence suggests the service was delivered correctly.",
    sourceSummary: "Completed order with early chargeback notice and merchant evidence",
    riskFlags: ["Issuer dispute", "Evidence pack attached"],
    timeline: [
      { label: "Chargeback notice received", detail: "Issuer event entered the chargeback lane.", time: "08:46" },
      { label: "Merchant evidence attached", detail: "Proof of fulfillment and completion added.", time: "08:58" },
      { label: "Awaiting desk review", detail: "Chargeback desk should choose representment or closure.", time: "09:05" },
    ],
    notes: ["Needs a finance decision before support promises any customer recovery."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Chisomo Tembo"] },
      { label: "Disputes", href: routes.supportDesk.disputes },
      { label: "Orders", href: routes.sales.orders },
    ],
  },
  {
    id: "PAYM-4189",
    reference: "SET-88244",
    lane: "reconciliation",
    customerName: "Agnes Mumba",
    city: "Kabwe",
    status: "at_risk",
    amount: "ZMW 412",
    method: "Wallet + card split",
    owner: "Ledger reconciliation",
    age: "38m",
    issue: "Internal ledger shows a split-payment settlement, but the provider only confirmed the card leg and never posted the wallet movement.",
    sourceSummary: "Split-payment mismatch between internal ledger and provider confirmation",
    riskFlags: ["Ledger mismatch", "Provider confirmation gap"],
    timeline: [
      { label: "Mismatch detected", detail: "Settlement audit found provider and wallet drift.", time: "08:04" },
      { label: "Customer balance frozen", detail: "Finance blocked downstream refund actions pending reconciliation.", time: "08:12" },
      { label: "Risk escalation attached", detail: "This should not be closed until ledger parity is restored.", time: "08:20" },
    ],
    notes: ["Do not close until payment-source parity is confirmed."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Agnes Mumba"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Support tickets", href: routes.supportDesk.tickets },
    ],
  },
  {
    id: "PAYM-4174",
    reference: "ORD-88183",
    lane: "retry",
    customerName: "Brian Zulu",
    city: "Ndola",
    status: "queued",
    amount: "ZMW 92",
    method: "MTN MoMo ••• 0184",
    owner: "Retry runner",
    age: "49m",
    issue: "Mobile-money payment timed out, but the customer immediately retried and may be charged again if the original pending event settles late.",
    sourceSummary: "Pending mobile-money timeout with duplicate-charge risk on rerun",
    riskFlags: ["Pending timeout", "Duplicate-risk"],
    timeline: [
      { label: "Timeout recorded", detail: "Provider did not confirm within the checkout window.", time: "07:31" },
      { label: "Rerun queued", detail: "Case was moved into retry holding to prevent duplicate capture.", time: "07:43" },
    ],
    notes: ["Should only rerun after the old pending event is definitively dead."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Brian Zulu"] },
      { label: "Refund approvals", href: routes.sales.refunds },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "PAYM-4168",
    reference: "SET-88092",
    lane: "reconciliation",
    customerName: "Natasha Chinyama",
    city: "Lusaka",
    status: "paused",
    amount: "ZMW 54",
    method: "Wallet credit",
    owner: "Finance governance",
    age: "1h 04m",
    issue: "Wallet credit was created manually during support recovery, but the matching ledger annotation is incomplete so governance paused the payment case.",
    sourceSummary: "Manual wallet credit missing full ledger audit context",
    riskFlags: ["Manual adjustment", "Audit gap"],
    timeline: [
      { label: "Credit issued", detail: "Support-triggered manual wallet credit posted.", time: "06:48" },
      { label: "Audit gap found", detail: "Finance could not trace the full ledger note chain.", time: "06:56" },
      { label: "Governance hold applied", detail: "Case should stay paused until annotation is corrected.", time: "07:03" },
    ],
    notes: ["Needs audit completion, not just payment closure."],
    links: [
      { label: "Customer profile", href: customerDetailHrefByName["Natasha Chinyama"] },
      { label: "Activity logs", href: routes.platform.activityLogs },
      { label: "Support escalations", href: routes.supportDesk.escalations },
    ],
  },
];

function PaymentDecisionModal({
  item,
  action,
  onClose,
  onSubmit,
}: {
  item: PaymentCase;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "retry" ? "retry_released" : action === "escalate" ? "escalated_for_review" : "case_closed",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "retry"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "escalate"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">{item.id}</Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "retry" ? "Release retry" : action === "escalate" ? "Escalate payment case" : "Close payment case"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        Record the payment-ops outcome for {item.reference} so Finance, Support, and Risk see the same trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Retry released", value: "retry_released" },
            { label: "Wallet fallback released", value: "wallet_fallback_released" },
            { label: "Escalated for review", value: "escalated_for_review" },
            { label: "Gateway verification pending", value: "gateway_verification_pending" },
            { label: "Case closed", value: "case_closed" },
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
            placeholder="Add the retry, escalation, or closure context the next operator will need."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`h-11 rounded-2xl px-4 ${tone}`} onClick={() => onSubmit({ reasonCode, note })}>
          {action === "retry" ? "Confirm retry" : action === "escalate" ? "Confirm escalation" : "Confirm closure"}
        </Button>
      </div>
    </div>
  );
}

function PaymentDrawer({
  item,
  onApplyDecision,
}: {
  item: PaymentCase;
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
          <InfoTile label="Amount" value={item.amount} />
          <InfoTile label="Payment method" value={item.method} />
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

        <SectionBlock title="Risk and ops flags">
          <div className="flex flex-wrap gap-2">
            {item.riskFlags.map((flag) => (
              <Badge key={flag} variant="flat" color="warning" rounded="pill">
                {flag}
              </Badge>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Payment trail">
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
          <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90" onClick={() => setDecision("retry")}>
            Release retry
          </Button>
          <Button className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90" onClick={() => setDecision("escalate")}>
            Escalate
          </Button>
          <Button className="h-11 rounded-2xl bg-red-dark px-4 text-white hover:bg-red-dark/90" onClick={() => setDecision("close")}>
            Close case
          </Button>
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={closeDrawer}>
            Close
          </Button>
        </div>
      </div>

      {decision ? (
        <Modal isOpen onClose={() => setDecision(null)} containerClassName="max-w-xl">
          <PaymentDecisionModal
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

export default function PaymentOpsQueuePage() {
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
    const chargebacks = filteredCases.filter((item) => item.lane === "chargeback").length;
    return { open, urgent, chargebacks };
  }, [filteredCases]);

  function applyDecision(id: string, action: DecisionAction, reasonCode: string, note: string) {
    setCases((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const status: ReviewStatus = action === "retry" ? "live" : action === "escalate" ? "monitoring" : "paused";
        const timelineLabel =
          action === "retry" ? "Retry released" : action === "escalate" ? "Case escalated" : "Case closed";
        return {
          ...item,
          status,
          owner: action === "escalate" ? "Finance and risk" : item.owner,
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
        breadcrumb={["Home", "Sales", "Payments"]}
        eyebrow="Commerce"
        title="Payments"
        description="Payment issues and retries."
        badge="Payments"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Open payment cases"
          value={String(stats.open)}
          change="Working set"
          tone="warning"
          detail="Payment issues currently sitting in the active finance queue."
        />
        <StatCard
          label="Urgent review"
          value={String(stats.urgent)}
          change="Needs decision"
          tone="warning"
          detail="Cases with retry or ledger-risk pressure that should not stay unattended."
        />
        <StatCard
          label="Chargeback review"
          value={String(stats.chargebacks)}
          change="Dispute lane"
          tone="neutral"
          detail="Issuer-side reversals and representment decisions in the current queue."
        />
      </div>

      <ShellCard
        title="Payment operations queue"
        description="Review and act."
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
              placeholder="Search payments, orders, customers..."
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
                    <Text className="mt-1 text-sm text-gray-500">{item.method}</Text>
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
                            view: <PaymentDrawer item={item} onApplyDecision={applyDecision} />,
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
            <Title as="h4" className="mt-3 text-base font-semibold text-gray-900">No payment cases match this filter set</Title>
            <Text className="mt-2 text-sm text-gray-500">Clear one or more filters to return to the active payment queue.</Text>
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
