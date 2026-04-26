"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { crmWalletRows } from "@/components/admin/section-data";
import { Text } from "rizzui";

export default function CrmWalletsPage() {
  return (
    <div className="@container space-y-6">
      <PageHeader
        eyebrow="Customer CRM"
        title="Wallets"
        description="Review wallet balances, manual credits and debits, refund reversals, and abuse-related holds."
        badge="Wallets"
      />

      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-12">
        <div className="@4xl:col-span-full grid gap-4 md:grid-cols-3">
          <StatCard
            label="Manual adjustments"
            value="13"
            change="Awaiting action"
            tone="warning"
            detail="Customer wallet changes still needing finance or support confirmation."
          />
          <StatCard
            label="Failed reversals"
            value="9"
            change="Payment issue"
            tone="warning"
            detail="Refund or correction flows where wallet state does not yet match payment events."
          />
          <StatCard
            label="Promo grants"
            value="21"
            change="Scheduled"
            tone="positive"
            detail="Campaign-based wallet credits prepared for activation or release."
          />
        </div>

        <ShellCard
          title="Wallet control lanes"
          description="Core operational groups for customer balances."
          className="@4xl:col-span-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Manual credits and debits", "Support- and finance-driven balance corrections"],
              ["Refund reconciliation", "Wallet updates tied to failed or partial payment reversals"],
              ["Growth wallet credits", "Campaign and referral grants for eligible customers"],
              ["Fraud and abuse holds", "Wallet accounts paused pending risk investigation"],
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
          description="Wallet issues needing immediate resolution."
          className="@4xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              ["Reversal mismatch", "Several refund flows completed in payments but not in customer balances", "monitoring"],
              ["Abuse freeze review", "A wallet segment is still under investigation before release", "review"],
              ["Promo grant release", "A campaign credit batch is queued behind finance confirmation", "queued"],
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
          title="Wallet working set"
          description="Current wallet-operation priorities."
          className="@4xl:col-span-full"
        >
          <DataTable
            rows={crmWalletRows.map((row) => ({
              primary: row.primary,
              secondary: row.secondary,
              tertiary: row.tertiary,
              status: <StatusBadge status={row.status} />,
            }))}
            columns={[
              { key: "primary", label: "Wallet lane" },
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
