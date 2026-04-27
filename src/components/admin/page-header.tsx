"use client";

import { Badge, Text, Title } from "rizzui";

type PageHeaderProps = {
  breadcrumb?: string[];
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  breadcrumb,
  eyebrow,
  title,
  description,
  badge,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-2">
        {breadcrumb?.length ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {breadcrumb.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <span>{item}</span>
                {index < breadcrumb.length - 1 ? <span>/</span> : null}
              </span>
            ))}
          </div>
        ) : null}
        {eyebrow ? (
          <Text className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            {eyebrow}
          </Text>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Title as="h1" className="text-2xl font-semibold tracking-tight">
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
        {description ? (
          <Text className="max-w-2xl text-sm leading-7 text-gray-500">
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
