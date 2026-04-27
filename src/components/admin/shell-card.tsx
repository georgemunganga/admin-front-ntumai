"use client";

import cn from "@/utils/class-names";
import { Text, Title } from "rizzui";

type ShellCardProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

export default function ShellCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: ShellCardProps) {
  return (
    <section
      className={cn(
        "rounded-[26px] border border-gray-200 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.24)]",
        className,
      )}
    >
      {title || description || action ? (
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-gradient-to-r from-primary/5 via-white to-secondary/5 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            {title ? (
              <Title as="h3" className="text-base font-semibold text-gray-900">
                {title}
              </Title>
            ) : null}
            {description ? (
              <Text className="mt-1 text-xs leading-5 text-gray-500">{description}</Text>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn("px-5 py-4 sm:px-6", bodyClassName)}>{children}</div>
    </section>
  );
}
