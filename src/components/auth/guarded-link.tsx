"use client";

import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";
import { useAdminActionGuard } from "@/components/auth/use-admin-action-guard";

type GuardRequirement = "read" | "write" | "delete";

type GuardedLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string;
    requirement?: GuardRequirement;
    deniedMessage?: string;
  }
>;

export default function GuardedLink({
  children,
  className,
  requirement = "read",
  deniedMessage,
  ...linkProps
}: GuardedLinkProps) {
  const { isAllowed, openDeniedModal } = useAdminActionGuard();

  if (isAllowed(requirement)) {
    return (
      <Link {...linkProps} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className={className}
      onClick={() => openDeniedModal(requirement, deniedMessage)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDeniedModal(requirement, deniedMessage);
        }
      }}
    >
      {children}
    </span>
  );
}
