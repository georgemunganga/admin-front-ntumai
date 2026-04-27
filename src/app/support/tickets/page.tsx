"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { supportTicketRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function SupportTicketsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Tickets"]}
        eyebrow="Support CRM"
        title="Support tickets"
        description="Manage the main service queue for rider, driver, and merchant tickets across the platform."
        badge="Tickets"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Open tickets"
            value="143"
            change="+12 new"
            tone="warning"
            detail="Customer, driver, and merchant issues still awaiting first action or resolution."
          />
          <StatCard
            label="SLA watch"
            value="12"
            change="Need action"
            tone="warning"
            detail="Tickets approaching or exceeding target response and resolution windows."
          />
          <StatCard
            label="Resolved today"
            value="89"
            change="+21 cleared"
            tone="positive"
            detail="Tickets successfully moved through the support workflow in the current operating day."
          />
        </div>

        <ShellCard
          title="Support lanes"
          description="Major support flows managed by frontline and specialist teams."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Billing and wallet issues", "Tickets tied to reversals, refunds, or balance mismatches"],
              ["Service failure complaints", "Late deliveries, bad ETAs, and incomplete resolution flows"],
              ["Merchant support", "Partner-facing issues needing ops or catalog follow-up"],
              ["Routine resolution", "Normal cases moving through scripted support workflows"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <Text className="font-semibold text-gray-900">{title}</Text>
                <Text className="mt-3 text-sm leading-6 text-gray-500">{detail}</Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Attention queue"
          description="Ticket groups requiring support-lead focus."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Billing dispute spike", "A set of wallet-linked tickets is pushing beyond normal resolution time", "review"],
              ["Zone service backlog", "One delivery corridor is producing a high ticket inflow after route delays", "monitoring"],
              ["Merchant callback batch", "Partners are waiting on operations responses before closure", "queued"],
            ].map(([title, meta, status]) => (
              <div key={title} className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Text className="font-semibold text-gray-900">{title}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{meta}</Text>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard
          title="Ticket working set"
          description="Current service queue priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={supportTicketRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Ticket lane" },
              { key: "secondary", label: "Context" },
              { key: "tertiary", label: "Owner" },
              { key: "status", label: "Status", className: "md:justify-self-end" },
            ]}
          />
        </ShellCard>
      </div>
    </div>
  );
}
