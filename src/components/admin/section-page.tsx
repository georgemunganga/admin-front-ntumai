"use client";

import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";
import DataTable from "@/components/admin/data-table";
import StatusBadge from "@/components/admin/status-badge";
import { Badge, Button, Text, Title } from "rizzui";

type Insight = {
  label: string;
  value: string;
  detail: string;
};

type QueueItem = {
  title: string;
  meta: string;
  status: string;
};

type SectionRow = {
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
};

type SectionPageProps = {
  breadcrumb?: string[];
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  insights: Insight[];
  rows: SectionRow[];
  queue: QueueItem[];
};

export default function SectionPage({
  breadcrumb,
  eyebrow,
  title,
  description,
  badge,
  insights,
  rows,
  queue,
}: SectionPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={breadcrumb}
        eyebrow={eyebrow}
        title={title}
        description={description}
        badge={badge}
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="h-11 rounded-2xl border-2 border-primary px-5 font-semibold text-primary">
              Export
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-5 font-semibold text-white">
              Create
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <ShellCard title="Snapshot">
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4"
              >
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {item.label}
                </Text>
                <Title as="h3" className="mt-3 text-2xl font-semibold">
                  {item.value}
                </Title>
                <Text className="mt-1.5 text-xs leading-5 text-gray-500">
                  {item.detail}
                </Text>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard title="Action queue">
          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.title}
                className="rounded-[20px] border border-gray-100 bg-gray-50/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Title as="h4" className="text-sm font-semibold">
                      {item.title}
                    </Title>
                    <Text className="mt-1 text-sm text-gray-500">
                      {item.meta}
                    </Text>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>

      <ShellCard
        title="Working set"
        action={
          <Badge
            variant="flat"
            className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
          >
            Preview
          </Badge>
        }
      >
        <DataTable
          rows={rows.map((row) => ({
            primary: (
              <div className="truncate">
                <Text className="font-semibold text-gray-900">{row.primary}</Text>
              </div>
            ),
            secondary: row.secondary,
            tertiary: row.tertiary,
            status: <StatusBadge status={row.status} />,
          }))}
          columns={[
            { key: "primary", label: "Name" },
            { key: "secondary", label: "Context" },
            { key: "tertiary", label: "Owner / Detail" },
            { key: "status", label: "Status", className: "md:justify-self-end" },
          ]}
        />
      </ShellCard>
    </div>
  );
}
