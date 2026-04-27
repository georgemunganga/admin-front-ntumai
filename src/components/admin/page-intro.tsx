"use client";

import { Text, Title } from "rizzui";

type PageIntroProps = {
  breadcrumb: string[];
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function PageIntro({
  breadcrumb,
  title,
  description,
  action,
}: PageIntroProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {breadcrumb.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
              <span>{item}</span>
              {index < breadcrumb.length - 1 ? <span>/</span> : null}
            </span>
          ))}
        </div>
        <Title as="h1" className="text-2xl font-semibold">
          {title}
        </Title>
        {description ? (
          <Text className="max-w-3xl text-sm leading-7 text-gray-500">
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
