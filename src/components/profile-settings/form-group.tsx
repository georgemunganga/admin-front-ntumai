"use client";

import { Text, Title } from "rizzui";
import cn from "@/utils/class-names";

export default function FormGroup({
  title,
  description,
  className,
  children,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>) {
  return (
    <div className={cn("grid gap-5 @3xl:grid-cols-12", className)}>
      <div className="@3xl:col-span-4">
        <Title as="h3" className="text-base font-semibold text-gray-900">
          {title}
        </Title>
        {description ? <Text className="mt-2 text-sm leading-6 text-gray-500">{description}</Text> : null}
      </div>
      <div className="@3xl:col-span-8">{children}</div>
    </div>
  );
}
