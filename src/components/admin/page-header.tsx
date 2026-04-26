"use client";

import { Badge, Text, Title } from "rizzui";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm shadow-gray-100/80 lg:flex-row lg:items-end lg:justify-between lg:p-8">
      <div className="max-w-3xl">
        {eyebrow ? (
          <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            {eyebrow}
          </Text>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Title as="h1" className="text-[28px] font-semibold tracking-tight">
            {title}
          </Title>
          {badge ? (
            <Badge
              variant="flat"
              className="rounded-2xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
            >
              {badge}
            </Badge>
          ) : null}
        </div>
        <Text className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
          {description}
        </Text>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
