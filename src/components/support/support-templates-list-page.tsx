"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Input, Select, Table, Text } from "rizzui";
import { PiDownloadSimpleBold, PiMagnifyingGlassBold, PiNotePencilBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import StatCard from "@/components/admin/stat-card";
import { routes } from "@/config/routes";
import {
  listSupportTemplateChannels,
  listSupportTemplates,
} from "@/repositories/admin/support-templates";

export default function SupportTemplatesListPage() {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const templates = useMemo(() => listSupportTemplates(), []);
  const channelOptions = useMemo(
    () => [{ label: "All channels", value: "all" }].concat(listSupportTemplateChannels().map((value) => ({ label: value, value }))),
    [],
  );

  const rows = useMemo(() => {
    return templates.filter((item) => {
      const channelMatch = channel === "all" || item.channel === channel;
      const q = query.trim().toLowerCase();
      const queryMatch =
        q.length === 0 ||
        [item.name, item.audience, item.subject, item.owner].join(" ").toLowerCase().includes(q);
      return channelMatch && queryMatch;
    });
  }, [channel, query, templates]);

  const liveCount = templates.filter((item) => item.status === "live").length;
  const reviewCount = templates.filter((item) => item.status === "review").length;
  const queuedCount = templates.filter((item) => item.status === "queued").length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Templates"]}
        eyebrow="Support Desk"
        title="Support Templates"
        description="Manage reusable customer, vendor, and tasker communications that staff use to run mobile support, dispatch, and payout workflows."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="h-11 rounded-2xl px-4">
              <PiDownloadSimpleBold className="me-1.5 h-4 w-4" />
              Export
            </Button>
            <Link href={routes.supportDesk.createTemplate}>
              <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
                <PiPlusBold className="me-1.5 h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total templates" value={String(templates.length).padStart(2, "0")} change="Workspace" tone="neutral" detail="All customer, vendor, tasker, and internal communication templates." />
        <StatCard label="Live" value={String(liveCount).padStart(2, "0")} change="Published" tone="positive" detail="Templates currently cleared for active use in support flows." />
        <StatCard label="Review" value={String(reviewCount).padStart(2, "0")} change="Pending" tone="warning" detail="Templates waiting on copy, product, or compliance review." />
        <StatCard label="Queued" value={String(queuedCount).padStart(2, "0")} change="Drafts" tone="neutral" detail="Templates prepared but not yet approved for live release." />
      </div>

      <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Input
            type="search"
            placeholder="Search by anything..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="size-4" />}
            inputClassName="h-10"
            className="w-full max-w-md"
          />
          <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
            <div className="min-w-[220px]">
              <Select
                options={channelOptions}
                value={channel}
                onChange={(option: any) => setChannel(option?.value ?? "all")}
                selectClassName="rounded-2xl"
              />
            </div>
            <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-2 text-primary">
              {rows.length} shown
            </Badge>
          </div>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Channel</Table.Head>
              <Table.Head>Audience</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Owner</Table.Head>
              <Table.Head>Updated</Table.Head>
              <Table.Head className="text-right">Action</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Link href={routes.supportDesk.templateDetails(item.id)} className="font-medium text-gray-900 hover:text-primary">
                    {item.name}
                  </Link>
                  <Text className="mt-1 text-xs text-gray-500">{item.subject}</Text>
                  <Text className="mt-1 text-xs text-gray-400">{item.workflow.summary}</Text>
                </Table.Cell>
                <Table.Cell>{item.channel}</Table.Cell>
                <Table.Cell>{item.audience}</Table.Cell>
                <Table.Cell>
                  <Badge
                    variant="flat"
                    className={`rounded-2xl px-3 py-1 ${
                      item.status === "live"
                        ? "bg-primary/10 text-primary"
                        : item.status === "review"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.owner}</Table.Cell>
                <Table.Cell>{item.updatedAt}</Table.Cell>
                <Table.Cell className="text-right">
                  <Link href={routes.supportDesk.editTemplate(item.id)}>
                    <Button size="sm" variant="outline" className="rounded-2xl px-3">
                      <PiNotePencilBold className="me-1.5 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
