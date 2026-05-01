"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiCaretRightBold,
  PiMagnifyingGlassBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import StatusBadge from "@/components/admin/status-badge";
import { useDrawer } from "@/app/shared/drawer-views/use-drawer";
import { routes } from "@/config/routes";
import { Modal } from "@/components/modal";
import { applyTaskerKycDecision } from "@/repositories/admin/taskers";

type ApplicationStatus =
  | "review"
  | "queued"
  | "monitoring"
  | "live"
  | "paused"
  | "at_risk";

type ReviewStage =
  | "initial_review"
  | "documents_check"
  | "road_readiness"
  | "final_approval"
  | "resubmission";

type DecisionAction = "approve" | "changes" | "reject";

type TaskerApplication = {
  id: string;
  applicant: string;
  city: string;
  mode: "walking" | "bicycle" | "motorbike" | "truck";
  stage: ReviewStage;
  status: ApplicationStatus;
  submittedAt: string;
  age: string;
  owner: string;
  score: number;
  phone: string;
  blockers: string[];
  tags: string[];
  documents: Array<{
    label: string;
    state: "approved" | "pending" | "rejected" | "missing";
    note: string;
  }>;
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

const stageLabels: Record<ReviewStage, string> = {
  initial_review: "Initial review",
  documents_check: "Documents check",
  road_readiness: "Road readiness",
  final_approval: "Final approval",
  resubmission: "Resubmission",
};

const modeLabels: Record<TaskerApplication["mode"], string> = {
  walking: "Walking",
  bicycle: "Bicycle",
  motorbike: "Motorbike",
  truck: "Truck",
};

const stageTabs = [
  { value: "all", label: "All applications" },
  { value: "initial_review", label: "Initial review" },
  { value: "documents_check", label: "Documents" },
  { value: "road_readiness", label: "Road readiness" },
  { value: "final_approval", label: "Final approval" },
  { value: "resubmission", label: "Resubmissions" },
] as const;

const applicationsSeed: TaskerApplication[] = [
  {
    id: "TSK-24018",
    applicant: "Mwaka Bwalya",
    city: "Lusaka",
    mode: "motorbike",
    stage: "final_approval",
    status: "review",
    submittedAt: "Today, 08:12",
    age: "2h 14m",
    owner: "Fleet review",
    score: 92,
    phone: "+260 977 410 233",
    blockers: ["Final approval pending"],
    tags: ["KYC clear", "Vehicle verified", "Ready to activate"],
    documents: [
      { label: "National ID", state: "approved", note: "Matches account profile" },
      { label: "Driver permit", state: "approved", note: "Valid until Nov 2027" },
      { label: "Motorbike inspection", state: "approved", note: "Passed roadworthiness gate" },
      { label: "Profile photo", state: "approved", note: "Meets quality standard" },
    ],
    timeline: [
      { label: "Application submitted", detail: "Tasker finished onboarding wizard", time: "08:12" },
      { label: "KYC approved", detail: "Risk team cleared ID and selfie match", time: "09:04" },
      { label: "Vehicle passed", detail: "Inspection uploaded and accepted", time: "09:48" },
      { label: "Waiting final sign-off", detail: "Activation can be completed now", time: "10:06" },
    ],
    notes: [
      "Strong candidate for same-day activation.",
      "Customer-support experience noted in profile.",
    ],
    links: [
      { label: "Taskers", href: routes.logistics.taskers },
      { label: "Tasker documents", href: routes.fleet.driverDocuments },
    ],
  },
  {
    id: "TSK-24007",
    applicant: "Natasha Chinyama",
    city: "Kitwe",
    mode: "bicycle",
    stage: "documents_check",
    status: "queued",
    submittedAt: "Today, 07:41",
    age: "2h 45m",
    owner: "Compliance queue",
    score: 76,
    phone: "+260 969 002 180",
    blockers: ["Address proof missing", "Photo blur on ID upload"],
    tags: ["Resubmission likely", "Needs contact"],
    documents: [
      { label: "National ID", state: "pending", note: "Image too soft on reverse side" },
      { label: "Address proof", state: "missing", note: "No supporting document uploaded" },
      { label: "Vehicle requirement", state: "approved", note: "Bicycle mode does not require inspection" },
      { label: "Profile photo", state: "approved", note: "Accepted" },
    ],
    timeline: [
      { label: "Application submitted", detail: "Basic onboarding completed", time: "07:41" },
      { label: "Auto-check flagged", detail: "Document image quality is low", time: "08:03" },
      { label: "Needs resubmission", detail: "Awaiting address proof and clearer ID image", time: "08:15" },
    ],
    notes: ["Candidate should be nudged before end of day to avoid churn."],
    links: [
      { label: "Tasker documents", href: routes.fleet.driverDocuments },
      { label: "Support inbox", href: routes.supportDesk.inbox },
    ],
  },
  {
    id: "TSK-23992",
    applicant: "Ruth Mulenga",
    city: "Ndola",
    mode: "truck",
    stage: "road_readiness",
    status: "monitoring",
    submittedAt: "Yesterday, 16:20",
    age: "18h",
    owner: "Inspection desk",
    score: 81,
    phone: "+260 978 118 221",
    blockers: ["Insurance expiry in 12 days", "Fleet asset verification pending"],
    tags: ["Commercial mode", "Escalate if not cleared today"],
    documents: [
      { label: "National ID", state: "approved", note: "Passed" },
      { label: "Commercial permit", state: "approved", note: "Valid" },
      { label: "Insurance", state: "pending", note: "Near expiry, requires manual review" },
      { label: "Truck inspection", state: "pending", note: "Fleet asset verification not closed" },
    ],
    timeline: [
      { label: "Application submitted", detail: "Commercial tasker onboarding completed", time: "16:20" },
      { label: "Inspection started", detail: "Commercial asset review opened", time: "17:05" },
      { label: "Escalation hold", detail: "Insurance horizon requires human confirmation", time: "08:10" },
    ],
    notes: ["High-value mode applicant. Do not reject until insurance follow-up is complete."],
    links: [
      { label: "Tasker documents", href: routes.fleet.driverDocuments },
      { label: "Safety compliance", href: routes.risk.compliance },
    ],
  },
  {
    id: "TSK-23971",
    applicant: "Brian Zulu",
    city: "Lusaka",
    mode: "walking",
    stage: "resubmission",
    status: "at_risk",
    submittedAt: "Yesterday, 11:02",
    age: "1d",
    owner: "Risk review",
    score: 44,
    phone: "+260 971 550 908",
    blockers: ["Duplicate ID risk", "Face mismatch under review"],
    tags: ["High risk", "Manual call-back needed"],
    documents: [
      { label: "National ID", state: "rejected", note: "Potential duplicate document usage" },
      { label: "Selfie match", state: "rejected", note: "Mismatch confidence too high" },
      { label: "Address proof", state: "approved", note: "Accepted" },
      { label: "Profile photo", state: "approved", note: "Accepted" },
    ],
    timeline: [
      { label: "Application submitted", detail: "Entered review flow", time: "11:02" },
      { label: "Risk flag raised", detail: "Duplicate document pattern detected", time: "11:31" },
      { label: "Resubmission requested", detail: "Identity evidence must be replaced", time: "12:14" },
    ],
    notes: ["Do not activate until duplicate check is resolved."],
    links: [
      { label: "Safety compliance", href: routes.risk.compliance },
      { label: "Support escalations", href: routes.supportDesk.escalations },
    ],
  },
  {
    id: "TSK-23958",
    applicant: "Agnes Mumba",
    city: "Kabwe",
    mode: "motorbike",
    stage: "initial_review",
    status: "queued",
    submittedAt: "Yesterday, 09:16",
    age: "1d",
    owner: "Onboarding queue",
    score: 68,
    phone: "+260 963 404 802",
    blockers: ["Intro review not started"],
    tags: ["New applicant"],
    documents: [
      { label: "National ID", state: "pending", note: "Awaiting first pass" },
      { label: "Driver permit", state: "pending", note: "Awaiting first pass" },
      { label: "Motorbike inspection", state: "missing", note: "Not uploaded yet" },
      { label: "Profile photo", state: "approved", note: "Accepted" },
    ],
    timeline: [
      { label: "Application submitted", detail: "Profile created from tasker onboarding", time: "09:16" },
      { label: "Queued for review", detail: "Awaiting first-touch by fleet team", time: "09:18" },
    ],
    notes: ["Good candidate, but still very early in pipeline."],
    links: [
      { label: "Tasker documents", href: routes.fleet.driverDocuments },
      { label: "Taskers", href: routes.logistics.taskers },
    ],
  },
];

function getStageCount(applications: TaskerApplication[], stage: ReviewStage) {
  return applications.filter((item) => item.stage === stage).length;
}

function TaskerApplicationDecisionModal({
  application,
  action,
  onClose,
  onSubmit,
}: {
  application: TaskerApplication;
  action: DecisionAction;
  onClose: () => void;
  onSubmit: (payload: { reasonCode: string; note: string }) => void;
}) {
  const [reasonCode, setReasonCode] = useState(
    action === "approve" ? "activation_ready" : action === "changes" ? "needs_resubmission" : "risk_rejection",
  );
  const [note, setNote] = useState("");

  const tone =
    action === "approve"
      ? "bg-primary text-white hover:bg-primary/90"
      : action === "changes"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        : "bg-red-dark text-white hover:bg-red-dark/90";

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7">
      <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
        {application.id}
      </Text>
      <Title as="h3" className="mt-2 text-xl font-semibold text-gray-900">
        {action === "approve"
          ? "Approve tasker application"
          : action === "changes"
            ? "Request changes"
            : "Reject application"}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">
        {application.applicant} is currently in {stageLabels[application.stage].toLowerCase()}. Record a reason code so the next staff member can understand the decision trail.
      </Text>

      <div className="mt-6 space-y-4">
        <Select
          label="Reason code"
          options={[
            { label: "Activation ready", value: "activation_ready" },
            { label: "Needs document resubmission", value: "needs_resubmission" },
            { label: "Road readiness hold", value: "road_readiness_hold" },
            { label: "Risk rejection", value: "risk_rejection" },
            { label: "Duplicate account concern", value: "duplicate_account" },
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
            placeholder="Add the decision context that the next reviewer or support agent will need."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={`h-11 rounded-2xl px-4 ${tone}`}
          onClick={() => onSubmit({ reasonCode, note })}
        >
          {action === "approve" ? "Confirm approval" : action === "changes" ? "Send back for changes" : "Confirm rejection"}
        </Button>
      </div>
    </div>
  );
}

function TaskerApplicationDrawer({
  application,
  onApplyDecision,
}: {
  application: TaskerApplication;
  onApplyDecision: (applicationId: string, action: DecisionAction, reasonCode: string, note: string) => void;
}) {
  const { closeDrawer } = useDrawer();
  const [decision, setDecision] = useState<DecisionAction | null>(null);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-100 px-6 py-5">
        <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
          {application.id}
        </Text>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <Title as="h3" className="text-xl font-semibold text-gray-900">
              {application.applicant}
            </Title>
            <Text className="mt-2 text-sm text-gray-500">
              {application.city} · {modeLabels[application.mode]} · Submitted {application.submittedAt}
            </Text>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile label="Stage" value={stageLabels[application.stage]} />
          <InfoTile label="Readiness score" value={`${application.score}%`} />
          <InfoTile label="Queue owner" value={application.owner} />
          <InfoTile label="Phone" value={application.phone} />
        </div>

        <section className="rounded-3xl border border-gray-200 bg-gray-50/70 p-5">
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Current blockers
          </Title>
          <div className="mt-4 flex flex-wrap gap-2">
            {application.blockers.map((blocker) => (
              <Badge key={blocker} variant="flat" className="rounded-2xl bg-red-lighter/70 px-3 py-1.5 text-red-dark">
                {blocker}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {application.tags.map((tag) => (
              <Badge key={tag} variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Related workflow
          </Title>
          <div className="mt-4 flex flex-wrap gap-3">
            {application.links.map((link) => (
              <Link key={link.label} href={link.href}>
                <Button variant="outline" className="h-10 rounded-2xl px-4">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Review checkpoints
          </Title>
          <div className="mt-4 space-y-3">
            {application.documents.map((document) => (
              <div key={document.label} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{document.label}</Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-500">{document.note}</Text>
                  </div>
                  <StatusBadge status={document.state === "approved" ? "live" : document.state === "pending" ? "review" : document.state === "missing" ? "queued" : "at_risk"} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Timeline
          </Title>
          <div className="mt-4 space-y-3">
            {application.timeline.map((item) => (
              <div key={`${item.label}-${item.time}`} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{item.label}</Text>
                    <Text className="mt-1 text-sm leading-6 text-gray-500">{item.detail}</Text>
                  </div>
                  <Text className="text-xs font-medium text-gray-500">{item.time}</Text>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Title as="h4" className="text-sm font-semibold text-gray-900">
            Internal notes
          </Title>
          <div className="mt-4 space-y-3">
            {application.notes.map((note) => (
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
            onClick={() => setDecision("reject")}
          >
            Reject
          </Button>
          <Button
            className="h-11 rounded-2xl bg-secondary px-4 text-secondary-foreground hover:bg-secondary/90"
            onClick={() => setDecision("changes")}
          >
            Request changes
          </Button>
          <Button
            className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90"
            onClick={() => setDecision("approve")}
          >
            Approve
          </Button>
        </div>
      </div>

      <Modal isOpen={decision !== null} onClose={() => setDecision(null)} size="md" rounded="lg">
        {decision ? (
          <TaskerApplicationDecisionModal
            application={application}
            action={decision}
            onClose={() => setDecision(null)}
            onSubmit={({ reasonCode, note }) => {
              onApplyDecision(application.id, decision, reasonCode, note);
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

export default function TaskerApplicationQueuePage() {
  const { openDrawer } = useDrawer();
  const [applications, setApplications] = useState(applicationsSeed);
  const [activeTab, setActiveTab] = useState<(typeof stageTabs)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  const visibleApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStage = activeTab === "all" ? true : application.stage === activeTab;
      const matchesOwner = ownerFilter === "all" ? true : application.owner === ownerFilter;
      const haystack = [
        application.id,
        application.applicant,
        application.city,
        application.owner,
        application.blockers.join(" "),
        application.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return matchesStage && matchesOwner && haystack.includes(query.toLowerCase());
    });
  }, [activeTab, applications, ownerFilter, query]);

  const ownerOptions = useMemo(() => {
    const owners = Array.from(new Set(applications.map((item) => item.owner)));
    return [{ label: "All owners", value: "all" }, ...owners.map((owner) => ({ label: owner, value: owner }))];
  }, [applications]);

  const counts = useMemo(
    () => ({
      pending: applications.filter((item) => item.status === "queued" || item.status === "review").length,
      ready: applications.filter((item) => item.stage === "final_approval" && item.status === "review").length,
      blocked: applications.filter((item) => item.status === "at_risk" || item.status === "monitoring").length,
    }),
    [applications],
  );

  const openApplication = (application: TaskerApplication) => {
    openDrawer({
      placement: "right",
      containerClassName: "w-full max-w-[620px] bg-white p-0",
      view: (
        <TaskerApplicationDrawer
          application={application}
          onApplyDecision={(applicationId, action, reasonCode, note) => {
            // Fire the live API call (non-blocking — optimistic UI handles the UX)
            const kycStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "pending_review";
            applyTaskerKycDecision(applicationId, kycStatus, reasonCode, note).catch(() => {
              // Silent fail — the local state update still provides feedback to the user
            });
            setApplications((current) =>
              current.map((item) => {
                if (item.id !== applicationId) return item;
                if (action === "approve") {
                  return {
                    ...item,
                    status: "live",
                    blockers: ["Activation complete"],
                    tags: [...item.tags.filter((tag) => tag !== "Ready to activate"), "Activated"],
                    owner: "Fleet activated",
                    notes: [`Approved with reason code ${reasonCode}. ${note}`.trim(), ...item.notes],
                    timeline: [
                      {
                        label: "Application approved",
                        detail: note || `Approved by fleet using reason code ${reasonCode}.`,
                        time: "Now",
                      },
                      ...item.timeline,
                    ],
                  };
                }
                if (action === "changes") {
                  return {
                    ...item,
                    stage: "resubmission",
                    status: "review",
                    blockers: ["Awaiting candidate resubmission"],
                    owner: "Candidate follow-up",
                    notes: [`Sent back for changes: ${reasonCode}. ${note}`.trim(), ...item.notes],
                    timeline: [
                      {
                        label: "Changes requested",
                        detail: note || `Sent back using reason code ${reasonCode}.`,
                        time: "Now",
                      },
                      ...item.timeline,
                    ],
                  };
                }
                return {
                  ...item,
                  status: "paused",
                  blockers: ["Application rejected"],
                  owner: "Closed by risk",
                  notes: [`Rejected: ${reasonCode}. ${note}`.trim(), ...item.notes],
                  timeline: [
                    {
                      label: "Application rejected",
                      detail: note || `Rejected using reason code ${reasonCode}.`,
                      time: "Now",
                    },
                    ...item.timeline,
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
        breadcrumb={["Home", "Fleet", "Tasker Applications"]}
        eyebrow="Fleet Ops"
        title="Tasker application queue"
        description="Activation, resubmission, and risk review across the incoming Ntumai tasker pipeline."
        badge="Queue"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Pending work"
          value={String(counts.pending)}
          change={`${getStageCount(applications, "initial_review")} in first review`}
          tone="neutral"
          detail="Applications still waiting for first touch or formal review decisions."
        />
        <StatCard
          label="Ready to activate"
          value={String(counts.ready)}
          change="Final sign-off queue"
          tone="positive"
          detail="Candidates that have cleared most checks and only need final approval."
        />
        <StatCard
          label="Blocked or risky"
          value={String(counts.blocked)}
          change="Needs intervention"
          tone="warning"
          detail="Applications slowed by document issues, inspections, or risk flags."
        />
      </div>

      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <nav className="flex items-center gap-5 border-b border-gray-200">
          {stageTabs.map((tab) => {
            const isActive = tab.value === activeTab;
            const count = tab.value === "all" ? applications.length : getStageCount(applications, tab.value);
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

      <ShellCard title="Review queue" description="Move candidates forward, return them for changes, or hold risky applications.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              type="search"
              placeholder="Search applicant, ID, city, blocker, or owner"
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
          <Button variant="outline" className="h-11 rounded-2xl px-4" onClick={() => setApplications(applicationsSeed)}>
            <PiArrowClockwiseBold className="me-2 h-4 w-4" />
            Reset demo state
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table variant="modern" className="min-w-[1100px]">
            <Table.Header>
              <Table.Row>
                <Table.Head className="bg-gray-100">Applicant</Table.Head>
                <Table.Head className="bg-gray-100">Stage</Table.Head>
                <Table.Head className="bg-gray-100">Blockers</Table.Head>
                <Table.Head className="bg-gray-100">Owner</Table.Head>
                <Table.Head className="bg-gray-100">Age</Table.Head>
                <Table.Head className="bg-gray-100">Status</Table.Head>
                <Table.Head className="bg-gray-100 text-right">Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleApplications.map((application) => (
                <Table.Row key={application.id} className="cursor-pointer" onClick={() => openApplication(application)}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={application.applicant}
                        initials={application.applicant
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                        className="bg-primary/10 text-primary"
                      />
                      <div>
                        <Text className="font-semibold text-gray-900">{application.applicant}</Text>
                        <Text className="mt-1 text-sm text-gray-500">
                          {application.id} · {application.city} · {modeLabels[application.mode]}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Text className="font-medium text-gray-900">{stageLabels[application.stage]}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{application.submittedAt}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="space-y-1">
                      {application.blockers.slice(0, 2).map((blocker) => (
                        <div key={blocker} className="flex items-center gap-2 text-sm text-gray-600">
                          <PiWarningCircleBold className="h-4 w-4 text-secondary-foreground" />
                          <span>{blocker}</span>
                        </div>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-medium text-gray-900">{application.owner}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="font-medium text-gray-900">{application.age}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={application.status} />
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex flex-col items-end gap-2">
                      <Link
                        href={application.links[0].href}
                        className="text-xs font-semibold text-gray-500 transition hover:text-primary"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {application.links[0].label}
                      </Link>
                      <Button variant="text" className="h-auto p-0 text-primary" onClick={(event) => {
                        event.stopPropagation();
                        openApplication(application);
                      }}>
                        Review
                        <PiCaretRightBold className="ms-1 h-4 w-4" />
                      </Button>
                    </div>
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
