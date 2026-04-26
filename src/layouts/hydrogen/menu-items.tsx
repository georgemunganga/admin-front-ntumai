import { routes } from "@/config/routes";
import {
  PiArrowsSplitDuotone,
  PiChartLineUpDuotone,
  PiGearSixDuotone,
  PiHandCoinsDuotone,
  PiHouseLineDuotone,
  PiLifebuoyDuotone,
  PiPackageDuotone,
  PiStorefrontDuotone,
  PiTruckDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

type MenuItem = {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  dropdownItems?: Array<{ name: string; href: string }>;
};

export const menuItems: MenuItem[] = [
  { name: "Overview" },
  {
    name: "Dashboard",
    href: routes.dashboard,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: "Orders",
    href: routes.orders,
    icon: <PiHandCoinsDuotone />,
  },
  {
    name: "Deliveries",
    href: routes.deliveries,
    icon: <PiTruckDuotone />,
  },
  {
    name: "Catalog",
    href: routes.catalog,
    icon: <PiPackageDuotone />,
  },
  {
    name: "Customers",
    href: routes.customers,
    icon: <PiUsersDuotone />,
  },
  {
    name: "Drivers",
    href: routes.drivers,
    icon: <PiArrowsSplitDuotone />,
  },
  {
    name: "Partners",
    href: routes.vendors,
    icon: <PiStorefrontDuotone />,
  },
  { name: "Growth" },
  {
    name: "Content",
    href: routes.content,
    icon: <PiChartLineUpDuotone />,
  },
  {
    name: "Support",
    href: routes.support,
    icon: <PiLifebuoyDuotone />,
  },
  { name: "System" },
  {
    name: "Settings",
    href: routes.settings,
    icon: <PiGearSixDuotone />,
  },
];
