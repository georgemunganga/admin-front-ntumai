"use client";

import { Avatar, Badge, Button, Input, Text, Title } from "rizzui";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import PageHeader from "@/components/admin/page-header";
import ShellCard from "@/components/admin/shell-card";

const customerStats = [
  { label: "Active customers", value: "18.4K", meta: "Customers ordering or engaging in the current window" },
  { label: "VIP segments", value: "47", meta: "High-value accounts under retention watch" },
  { label: "Recovery cases", value: "13", meta: "Customers tied to refund or service-recovery handling" },
  { label: "Repeat purchase", value: "61%", meta: "Customers returning inside the current cycle" },
];

const customerCards = [
  { name: "Martha Chola", segment: "VIP Retention", status: "Active", metric: "42 orders", note: "High-value rider with recent ETA complaints" },
  { name: "Joseph Tembo", segment: "Service Recovery", status: "Review", metric: "3 open cases", note: "Refund follow-up still pending confirmation" },
  { name: "Natasha Mbewe", segment: "Growth Cohort", status: "Active", metric: "8 orders", note: "Eligible for win-back and loyalty offers" },
  { name: "Kelvin Mwansa", segment: "Trust Monitoring", status: "Flagged", metric: "2 disputes", note: "Account under extra policy review" },
  { name: "Loveness Banda", segment: "Corporate Rider", status: "Active", metric: "14 orders", note: "Business account usage trending upward" },
  { name: "Brian Soko", segment: "Dormant Risk", status: "Recovery", metric: "0 orders", note: "Needs targeted reactivation campaign" },
  { name: "Sandra Zulu", segment: "VIP Retention", status: "Active", metric: "26 orders", note: "Premium user with strong repeat behavior" },
  { name: "Peter Mulenga", segment: "Service Recovery", status: "Review", metric: "1 open case", note: "Late-order dispute awaiting closure" },
];

const statusClasses: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Review: "bg-amber-100 text-amber-700",
  Flagged: "bg-rose-100 text-rose-700",
  Recovery: "bg-sky-100 text-sky-700",
};

export default function CrmCustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "CRM", "Customers"]}
        eyebrow="Customer CRM"
        title="Customers"
        description="Work across customer segments, retention health, and service-recovery queues from one CRM surface."
        badge="CRM"
      />

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        {customerStats.map((stat) => (
          <ShellCard key={stat.label} className="space-y-2 p-5">
            <Text className="text-sm text-gray-500">{stat.label}</Text>
            <Title as="h3" className="text-[28px] font-semibold tracking-tight text-gray-900">
              {stat.value}
            </Title>
            <Text className="text-sm text-gray-500">{stat.meta}</Text>
          </ShellCard>
        ))}
      </div>

      <ShellCard
        title="Customer accounts"
        action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search customers..."
              prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
              className="min-w-[220px]"
              inputClassName="h-10 rounded-2xl"
            />
            <Button className="h-10 rounded-2xl bg-primary px-4 text-white hover:bg-primary-dark">
              Add Customer
            </Button>
          </div>
        }
      >
        <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {customerCards.map((customer) => (
            <div key={customer.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={customer.name} size="lg" rounded="lg" />
                  <div>
                    <Title as="h4" className="text-base font-semibold text-gray-900">
                      {customer.name}
                    </Title>
                    <Text className="text-sm text-gray-500">{customer.segment}</Text>
                  </div>
                </div>
                <Badge
                  variant="flat"
                  className={`rounded-2xl px-2.5 py-1 text-xs font-medium ${statusClasses[customer.status]}`}
                >
                  {customer.status}
                </Badge>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-gray-50 px-4 py-3">
                  <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Relationship signal
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-gray-900">{customer.metric}</Text>
                </div>
                <Text className="text-sm leading-6 text-gray-500">{customer.note}</Text>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <Button variant="outline" className="h-10 flex-1 rounded-2xl border-gray-200">
                  View
                </Button>
                <Button className="h-10 flex-1 rounded-2xl bg-primary text-white hover:bg-primary-dark">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}
