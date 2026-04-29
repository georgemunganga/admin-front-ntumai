"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import { PiMagnifyingGlassBold, PiNotePencilBold, PiPlusBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import { routes } from "@/config/routes";
import { supportTemplates } from "@/components/support/template-data";

const channelOptions = [
  { label: "All channels", value: "all" },
  { label: "Email", value: "Email" },
  { label: "SMS", value: "SMS" },
  { label: "Push", value: "Push" },
];

export default function SupportTemplatesListPage() {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");

  const rows = useMemo(() => {
    return supportTemplates.filter((item) => {
      const channelMatch = channel === "all" || item.channel === channel;
      const q = query.trim().toLowerCase();
      const queryMatch =
        q.length === 0 ||
        [item.name, item.audience, item.subject, item.owner].join(" ").toLowerCase().includes(q);
      return channelMatch && queryMatch;
    });
  }, [query, channel]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Support", "Templates"]}
        eyebrow="Support Desk"
        title="Templates"
        description="Manage reusable message templates for customers, taskers, vendors, and ops alerts."
        action={
          <Link href={routes.supportDesk.createTemplate}>
            <Button className="h-11 rounded-2xl bg-primary px-4 text-white hover:bg-primary/90">
              <PiPlusBold className="me-1.5 h-4 w-4" />
              Create Template
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1">
          <Input
            placeholder="Search templates"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            rounded="lg"
          />
        </div>
        <div className="min-w-[220px]">
          <Select
            options={channelOptions}
            value={channel}
            onChange={(option: any) => setChannel(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]">
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
