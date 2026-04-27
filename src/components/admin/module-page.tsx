"use client";

import PageHeader from "@/components/admin/page-header";
import { Badge, Text, Title } from "rizzui";

export type ModulePageSection = {
  title: string;
  description: string;
  items: string[];
};

export type ModulePageConfig = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  sections: ModulePageSection[];
};

export default function ModulePage({
  eyebrow,
  title,
  description,
  badge,
  sections,
}: ModulePageConfig) {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", title]}
        eyebrow={eyebrow}
        title={title}
        description={description}
        badge={badge}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <Title as="h3" className="text-xl font-semibold text-gray-900">
              {section.title}
            </Title>
            <Text className="mt-2 text-sm leading-7 text-gray-500">
              {section.description}
            </Text>
            <div className="mt-5 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <Badge
                  key={item}
                  variant="flat"
                  className="rounded-2xl bg-primary/10 px-3 py-1.5 text-primary"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
