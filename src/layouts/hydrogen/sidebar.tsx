"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Title, Collapse } from "rizzui";
import { cn } from "@/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import SimpleBar from "@/components/ui/simplebar";
import { menuItems, type MenuItem } from "@/layouts/hydrogen/menu-items";
import { useAuth } from "@/components/auth/auth-provider";
import { canAccessAdminPath } from "@/repositories/admin/admin-permissions";

function getVisibleMenuItems(items: MenuItem[], user: ReturnType<typeof useAuth>["user"]) {
  const visible: MenuItem[] = [];
  let pendingSection: MenuItem | null = null;

  for (const item of items) {
    if (!item.href) {
      pendingSection = item;
      continue;
    }

    const visibleDropdownItems = item.dropdownItems?.filter((dropdownItem) =>
      canAccessAdminPath(dropdownItem.href, user),
    );
    const hasVisibleDropdownItems = Boolean(visibleDropdownItems?.length);
    const canVisitParent = canAccessAdminPath(item.href, user);

    if (!canVisitParent && !hasVisibleDropdownItems) {
      continue;
    }

    if (pendingSection) {
      visible.push(pendingSection);
      pendingSection = null;
    }

    visible.push({
      ...item,
      dropdownItems: visibleDropdownItems,
    });
  }

  return visible;
}

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const visibleMenuItems = getVisibleMenuItems(menuItems, user);
  return (
    <aside
      className={cn(
        "fixed bottom-0 start-0 z-50 h-full w-[270px] border-e border-primary/30 bg-primary 2xl:w-72",
        className
      )}
    >
      <div className="sticky top-0 z-40 border-b border-white/10 bg-primary/95 px-5 pb-5 pt-5 backdrop-blur 2xl:px-6 2xl:pt-6">
        <Link
          href={"/"}
          prefetch={false}
          aria-label="Site Logo"
          className="block text-white/90 hover:text-white"
        >
          <Image
            src="/brand/ntumai-logo-light.png"
            alt="Ntumai Admin"
            width={208}
            height={60}
            className="h-14 w-auto"
            priority
          />
          <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-white/85">
            Control Center
          </span>
        </Link>
      </div>

      <SimpleBar className="h-[calc(100%-80px)] bg-primary">
        <div className="mt-4 bg-primary pb-3 3xl:mt-6">
          {visibleMenuItems.map((item, index) => {
            const isActive = pathname === (item?.href as string);
            const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
              (dropdownItem) => dropdownItem.href === pathname
            );
            const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

            return (
              <Fragment key={item.name + "-" + index}>
                {item?.href ? (
                  <>
                    {item?.dropdownItems ? (
                      <Collapse
                        defaultOpen={isDropdownOpen}
                        header={({ open, toggle }) => (
                          <div
                            onClick={toggle}
                            className={cn(
                              "group relative mx-2.5 flex cursor-pointer items-center justify-between rounded-2xl px-2.5 py-2.5 font-medium lg:my-1 2xl:mx-4 2xl:my-2",
                              isDropdownOpen
                                ? "bg-white text-primary shadow-sm shadow-black/10"
                                : "text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <span className="flex items-center">
                              {item?.icon && (
                                <span
                                  className={cn(
                                    "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                    isDropdownOpen
                                      ? "text-primary"
                                      : "text-white group-hover:text-white"
                                  )}
                                >
                                  {item?.icon}
                                </span>
                              )}
                              {item.name}
                            </span>

                            <PiCaretDownBold
                              strokeWidth={3}
                              className={cn(
                                "h-3.5 w-3.5 -rotate-90 text-white transition-transform duration-200 rtl:rotate-90",
                                isDropdownOpen && "text-primary",
                                open && "rotate-0 rtl:rotate-0"
                              )}
                            />
                          </div>
                        )}
                      >
                        {item?.dropdownItems?.map((dropdownItem, index) => {
                          const isChildActive =
                            pathname === (dropdownItem?.href as string);

                          return (
                            <Link
                              href={dropdownItem?.href}
                              prefetch={false}
                              key={dropdownItem?.name + index}
                              className={cn(
                                "mx-3 mb-0.5 flex items-center justify-between rounded-2xl px-3 py-2.5 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-4",
                                isChildActive
                                  ? "bg-white/16 text-secondary"
                                  : "text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              <div className="flex items-center truncate">
                                <span
                                  className={cn(
                                    "me-3 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
                                    isChildActive
                                      ? "bg-secondary ring-[1px] ring-secondary/70"
                                      : "opacity-40"
                                  )}
                                />{" "}
                                <span className="truncate">
                                  {dropdownItem?.name}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </Collapse>
                    ) : (
                      <Link
                        href={item?.href}
                        prefetch={false}
                        className={cn(
                          "group relative mx-2.5 my-0.5 flex items-center justify-between rounded-2xl px-2.5 py-2.5 font-medium capitalize lg:my-1 2xl:mx-4 2xl:my-2",
                          isActive
                            ? "bg-white/14 text-white shadow-sm shadow-black/10"
                            : "text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                isActive
                                  ? "text-white"
                                  : "text-white group-hover:text-white"
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item?.badge ? (
                          <span className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                            isActive ? "bg-white/16 text-secondary" : "bg-white/12 text-white"
                          )}>
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    )}
                  </>
                ) : (
                  <Title
                    as="h6"
                      className={cn(
                      "mb-2 truncate px-5 text-xs font-normal uppercase tracking-widest text-white/80 2xl:px-6",
                      index !== 0 && "mt-6 3xl:mt-7"
                    )}
                  >
                    {item.name}
                  </Title>
                )}
              </Fragment>
            );
          })}
        </div>
      </SimpleBar>
    </aside>
  );
}
