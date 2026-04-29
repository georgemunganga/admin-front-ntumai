"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "rizzui";
import cn from "@/utils/class-names";
import { routes } from "@/config/routes";

const menuItems = [
  { label: "Profile", value: routes.profileSettings.profile },
  { label: "Password", value: routes.profileSettings.password },
  { label: "Notifications", value: routes.profileSettings.notification },
];

export default function ProfileSettingsNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[62px] z-20 -mx-4 border-b border-muted bg-white px-4 md:-mx-5 md:px-5 lg:-mx-8 lg:top-[71px] lg:px-8 xl:-mx-6 xl:px-6 3xl:-mx-[33px] 3xl:px-[33px] 4xl:-mx-10 4xl:px-10">
      <div className="relative flex h-[52px] items-center overflow-x-auto">
        <div className="flex gap-3 md:gap-5 lg:gap-8">
          {menuItems.map((menu) => (
            <Link
              href={menu.value}
              key={menu.value}
              className={cn(
                "group relative whitespace-nowrap py-2.5 font-medium text-gray-500 before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:bg-gray-1000 before:transition-all hover:text-gray-900",
                pathname === menu.value
                  ? "before:visible before:w-full before:opacity-100"
                  : "before:invisible before:w-0 before:opacity-0",
              )}
            >
              <Text
                as="span"
                className="inline-flex rounded-md px-2.5 py-1.5 transition-all duration-200 group-hover:bg-gray-100/70"
              >
                {menu.label}
              </Text>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
