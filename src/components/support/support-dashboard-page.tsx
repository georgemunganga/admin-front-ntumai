"use client";

import Link from "next/link";
import { Badge, Button, Table, Text, Title } from "rizzui";
import { PiArrowUpRightBold } from "react-icons/pi";
import { vendorDetailHrefByName } from "@/components/admin/ops-workflow-links";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import { routes } from "@/config/routes";

const ticketActivity = [
  { label: "Mon", opened: 92, solved: 81, overdue: 16 },
  { label: "Tue", opened: 88, solved: 77, overdue: 14 },
  { label: "Wed", opened: 104, solved: 86, overdue: 19 },
  { label: "Thu", opened: 97, solved: 90, overdue: 11 },
  { label: "Fri", opened: 115, solved: 93, overdue: 22 },
  { label: "Sat", opened: 73, solved: 70, overdue: 9 },
  { label: "Sun", opened: 69, solved: 64, overdue: 8 },
];

const problemTypes = [
  { label: "Refund trace", share: "31%", tone: "bg-primary" },
  { label: "Late delivery", share: "24%", tone: "bg-secondary" },
  { label: "Merchant visibility", share: "17%", tone: "bg-emerald-500" },
  { label: "Payment issue", share: "14%", tone: "bg-sky-500" },
];

const topCustomers = [
  { name: "Loveness Phiri", city: "Lusaka", tickets: 12, lane: "Refund recovery", href: routes.crm.customers },
  { name: "Chisomo Tembo", city: "Kitwe", tickets: 9, lane: "Service recovery", href: routes.crm.customers },
  { name: "Green Basket Market", city: "Kitwe", tickets: 7, lane: "Merchant support", href: vendorDetailHrefByName["Green Basket Market"] },
];

const agentActivity = [
  { name: "Support Ops", solved: 42, backlog: 6 },
  { name: "Finance Support", solved: 31, backlog: 4 },
  { name: "Trust Support", solved: 19, backlog: 3 },
];

const timezoneLoad = [
  { zone: "Lusaka", customers: "46%", detail: "Peak load 10:00-14:00" },
  { zone: "Copperbelt", customers: "28%", detail: "Peak load 12:00-16:00" },
  { zone: "Remote markets", customers: "12%", detail: "Peak load 09:00-11:00" },
];

export default function SupportDashboardPage() {
  const maxActivity = Math.max(...ticketActivity.map((item) => item.opened));

  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support"]}
        eyebrow="Support Desk"
        title="Support"
        description="Monitor support demand, recovery pressure, and active handoffs across customer, vendor, tasker, and finance lanes."
        action={
          <div className="flex flex-wrap gap-3">
            <a href={routes.supportDesk.inbox}>
              <Button variant="outline" className="h-11 rounded-2xl px-4">
                Open Inbox
              </Button>
            </a>
            <a href={routes.supportDesk.tickets}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                Review Tickets
              </Button>
            </a>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tickets" value="12,450" change="Support desk" tone="neutral" detail="All support cases across customer, merchant, and tasker flows." />
        <StatCard label="Unassigned" value="3,590" change="Needs owner" tone="warning" detail="Cases still waiting on a primary operator or lane owner." />
        <StatCard label="Open tickets" value="7,890" change="Live queue" tone="positive" detail="Tickets currently active across inbox, disputes, and escalations." />
        <StatCard label="Solved tickets" value="1,160" change="This cycle" tone="neutral" detail="Resolved tickets already closed in the current reporting window." />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.7fr_1fr]">
        <ShellCard title="Daily Ticket Activity" description="Opened, solved, and overdue ticket mix across the current week.">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <Legend tone="bg-primary" label="New" />
              <Legend tone="bg-secondary" label="Solved" />
              <Legend tone="bg-red-500" label="Overdue" />
            </div>
            <div className="grid gap-3">
              {ticketActivity.map((item) => (
                <div key={item.label} className="grid items-center gap-3 sm:grid-cols-[56px_1fr_150px]">
                  <Text className="font-medium text-gray-700">{item.label}</Text>
                  <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
                    <div className="bg-primary" style={{ width: `${(item.opened / maxActivity) * 100}%` }} />
                    <div className="bg-secondary" style={{ width: `${(item.solved / maxActivity) * 100}%` }} />
                    <div className="bg-red-500" style={{ width: `${(item.overdue / maxActivity) * 100}%` }} />
                  </div>
                  <Text className="text-xs text-gray-500">
                    {item.opened} opened · {item.solved} solved · {item.overdue} overdue
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>

        <ShellCard title="Satisfaction Rate" description="Current quality posture across live support lanes.">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-gray-200 bg-gray-50/70 p-5">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Customer sentiment</Text>
              <Title as="h3" className="mt-3 text-4xl font-semibold tracking-tight">
                92%
              </Title>
              <Text className="mt-2 text-sm text-gray-500">Resolved cases without reopening across the current support cycle.</Text>
            </div>
            {problemTypes.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-medium text-gray-900">{item.label}</Text>
                  <Text className="text-sm text-gray-500">{item.share}</Text>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`${item.tone} h-full rounded-full`} style={{ width: item.share }} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ShellCard title="Customers With Most Tickets" description="Highest-repeat support accounts needing closer operator attention.">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Account</Table.Head>
                <Table.Head>City</Table.Head>
                <Table.Head>Tickets</Table.Head>
                <Table.Head>Current lane</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topCustomers.map((customer) => (
                <Table.Row key={customer.name}>
                  <Table.Cell>
                    <Link href={customer.href} className="font-semibold text-gray-900 hover:text-primary">
                      {customer.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{customer.city}</Table.Cell>
                  <Table.Cell>{customer.tickets}</Table.Cell>
                  <Table.Cell>{customer.lane}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </ShellCard>

        <ShellCard title="Customer Type" description="Current ticket source mix across Ntumai segments.">
          <div className="space-y-4">
            {[
              { label: "Customers", share: "54%", tone: "bg-primary" },
              { label: "Vendors", share: "23%", tone: "bg-secondary" },
              { label: "Taskers", share: "15%", tone: "bg-emerald-500" },
              { label: "Internal ops", share: "8%", tone: "bg-sky-500" },
            ].map((segment) => (
              <div key={segment.label}>
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-medium text-gray-900">{segment.label}</Text>
                  <Text className="text-sm text-gray-500">{segment.share}</Text>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`${segment.tone} h-full rounded-full`} style={{ width: segment.share }} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ShellCard
          title="Employees Activity"
          description="Operator throughput and backlog by team."
          action={<Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">Live desk</Badge>}
        >
          <div className="space-y-4">
            {agentActivity.map((agent) => (
              <div key={agent.name} className="rounded-[22px] border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-semibold text-gray-900">{agent.name}</Text>
                  <Button variant="text" className="h-auto p-0 text-primary">
                    View
                    <PiArrowUpRightBold className="ms-1 h-4 w-4" />
                  </Button>
                </div>
                <Text className="mt-2 text-sm text-gray-500">
                  {agent.solved} solved · {agent.backlog} backlog
                </Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Customer Timezone" description="Regional demand concentration to guide staffing windows.">
          <div className="space-y-4">
            {timezoneLoad.map((zone) => (
              <div key={zone.zone} className="rounded-[22px] border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Text className="font-semibold text-gray-900">{zone.zone}</Text>
                  <Badge variant="flat" className="rounded-2xl bg-secondary/15 px-3 py-1 text-secondary-foreground">
                    {zone.customers}
                  </Badge>
                </div>
                <Text className="mt-2 text-sm text-gray-500">{zone.detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-4 w-4 rounded-[2px] ${tone}`} />
      <span>{label}</span>
    </div>
  );
}
