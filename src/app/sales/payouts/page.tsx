"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import {
  PiArrowsDownUpBold,
  PiCalendarBlankBold,
  PiDownloadSimpleBold,
  PiFadersHorizontalBold,
  PiMagnifyingGlassBold,
  PiPlusBold,
} from "react-icons/pi";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import StatCard from "@/components/admin/stat-card";

type PayoutTab =
  | "account_statement"
  | "payouts"
  | "deposits"
  | "reversed_payouts"
  | "pending_approvals"
  | "rejected_payouts";

type PayoutRecord = {
  id: string;
  merchantReference: string;
  beneficiary: string;
  bankAccount: string;
  type: PayoutTab;
  amount: string;
  status: "completed" | "processing" | "reversed" | "pending" | "rejected";
  createdAt: string;
};

const bankAccountOptions = [
  { label: "HDFC Bank •••• 4402", value: "hdfc_4402" },
  { label: "Axis Bank •••• 9914", value: "axis_9914" },
  { label: "ICICI Bank •••• 2288", value: "icici_2288" },
];

const periodOptions = [
  { label: "Past 7 days", value: "7_days" },
  { label: "Past 30 days", value: "30_days" },
  { label: "This month", value: "this_month" },
];

const tabItems: Array<{ label: string; value: PayoutTab }> = [
  { label: "Account Statement", value: "account_statement" },
  { label: "Payouts", value: "payouts" },
  { label: "Deposits", value: "deposits" },
  { label: "Reversed Payouts", value: "reversed_payouts" },
  { label: "Pending Approvals", value: "pending_approvals" },
  { label: "Rejected Payouts", value: "rejected_payouts" },
];

const payoutRecords: PayoutRecord[] = [
  {
    id: "PYT-88014",
    merchantReference: "MREF-420011",
    beneficiary: "Ntumai Tasker Settlement",
    bankAccount: "HDFC Bank •••• 4402",
    type: "payouts",
    amount: "₹0.00",
    status: "processing",
    createdAt: "29 Apr 2026, 09:12",
  },
  {
    id: "DEP-88002",
    merchantReference: "MREF-420004",
    beneficiary: "Treasury Top-up",
    bankAccount: "HDFC Bank •••• 4402",
    type: "deposits",
    amount: "₹7.00",
    status: "completed",
    createdAt: "28 Apr 2026, 17:40",
  },
  {
    id: "REV-87981",
    merchantReference: "MREF-419980",
    beneficiary: "Vendor Settlement Reversal",
    bankAccount: "Axis Bank •••• 9914",
    type: "reversed_payouts",
    amount: "₹0.00",
    status: "reversed",
    createdAt: "27 Apr 2026, 14:08",
  },
  {
    id: "APP-87954",
    merchantReference: "MREF-419945",
    beneficiary: "Marketplace Store Approval",
    bankAccount: "ICICI Bank •••• 2288",
    type: "pending_approvals",
    amount: "₹0.00",
    status: "pending",
    createdAt: "26 Apr 2026, 11:15",
  },
  {
    id: "REJ-87932",
    merchantReference: "MREF-419903",
    beneficiary: "Errand Refund Payout",
    bankAccount: "Axis Bank •••• 9914",
    type: "rejected_payouts",
    amount: "₹0.00",
    status: "rejected",
    createdAt: "25 Apr 2026, 08:51",
  },
  {
    id: "AST-87910",
    merchantReference: "MREF-419860",
    beneficiary: "Opening Statement Entry",
    bankAccount: "HDFC Bank •••• 4402",
    type: "account_statement",
    amount: "₹7.00",
    status: "completed",
    createdAt: "24 Apr 2026, 09:00",
  },
];

export default function SalesPayoutsPage() {
  const [account, setAccount] = useState(bankAccountOptions[0].value);
  const [period, setPeriod] = useState(periodOptions[0].value);
  const [activeTab, setActiveTab] = useState<PayoutTab>("payouts");
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return payoutRecords.filter((row) => {
      const matchesTab = row.type === activeTab;
      const haystack = [
        row.id,
        row.merchantReference,
        row.beneficiary,
        row.bankAccount,
        row.amount,
        row.createdAt,
      ]
        .join(" ")
        .toLowerCase();

      return matchesTab && (!needle || haystack.includes(needle));
    });
  }, [activeTab, query]);

  const columns = useMemo<ColumnDef<PayoutRecord>[]>(
    () => [
      {
        accessorKey: "merchantReference",
        header: "Merchant Reference ID",
        cell: ({ row }) => (
          <div>
            <Text className="font-semibold text-gray-900">{row.original.merchantReference}</Text>
            <Text className="text-xs text-gray-500">{row.original.id}</Text>
          </div>
        ),
      },
      {
        accessorKey: "beneficiary",
        header: "Beneficiary",
        cell: ({ row }) => (
          <div>
            <Text className="text-sm font-medium text-gray-800">{row.original.beneficiary}</Text>
            <Text className="text-xs text-gray-500">{row.original.bankAccount}</Text>
          </div>
        ),
      },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <PayoutStatus status={row.original.status} />,
      },
      { accessorKey: "createdAt", header: "Created At" },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Sales", "Payouts"]}
        eyebrow="Finance Ops"
        title="Payouts"
        description="Select a bank account to make a transfer or track analytics."
      />

      <ShellCard bodyClassName="space-y-5">
        <div className="grid gap-3 xl:grid-cols-[280px_220px_auto]">
          <Select
            options={bankAccountOptions as any}
            value={account}
            onChange={(option: any) => setAccount(option?.value ?? bankAccountOptions[0].value)}
            selectClassName="rounded-2xl"
          />
          <Select
            options={periodOptions as any}
            value={period}
            onChange={(option: any) => setPeriod(option?.value ?? periodOptions[0].value)}
            selectClassName="rounded-2xl"
          />
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiPlusBold className="me-1.5 h-4 w-4" />
              Add Money
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiArrowsDownUpBold className="me-1.5 h-4 w-4" />
              Make a Transfer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            label="Available Balance"
            value="₹7.00"
            change="Live balance"
            tone="positive"
            detail="Funds available in the selected payout account."
          />
          <StatCard
            label="Payout Volume"
            value="₹0.00"
            change="0 payouts"
            tone="neutral"
            detail="Processed payout value for the selected reporting window."
          />
        </div>
      </ShellCard>

      <ShellCard title="Records" description="Track statement lines, transfers, approvals, and payout outcomes.">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {tabItems.map((tab) => {
              const active = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_180px_auto_auto]">
            <Input
              type="search"
              placeholder="Search Merchant Reference ID"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              inputClassName="h-10"
            />
            <Button variant="outline" className="h-10 rounded-2xl justify-start px-4 text-gray-700">
              <PiCalendarBlankBold className="me-2 h-4 w-4" />
              Past 7 days
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl px-4 text-gray-700">
              <PiFadersHorizontalBold className="me-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl px-4 text-gray-700">
              Reset
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl px-4 text-gray-700">
              <PiDownloadSimpleBold className="me-2 h-4 w-4" />
              Download
            </Button>
          </div>

          <div className="custom-scrollbar overflow-x-auto">
            <Table variant="modern" className="min-w-[980px]">
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
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
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Table.Row key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={columns.length} className="py-12 text-center">
                      <div className="space-y-2">
                        <Title as="h4" className="text-base font-semibold text-gray-900">
                          No records found
                        </Title>
                        <Text className="text-sm text-gray-500">
                          There are no records in this payout view for the current search and filter state.
                        </Text>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </ShellCard>
    </div>
  );
}

function PayoutStatus({ status }: { status: PayoutRecord["status"] }) {
  const tones: Record<PayoutRecord["status"], string> = {
    completed: "bg-emerald-50 text-emerald-700",
    processing: "bg-primary/10 text-primary",
    reversed: "bg-amber-50 text-amber-700",
    pending: "bg-gray-100 text-gray-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <Badge variant="flat" className={`rounded-2xl px-3 py-1 text-xs font-semibold ${tones[status]}`}>
      {status.replace("_", " ")}
    </Badge>
  );
}
