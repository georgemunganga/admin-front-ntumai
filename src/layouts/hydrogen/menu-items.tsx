import { routes } from "@/config/routes";
import {
  PiArrowsSplitDuotone,
  PiChartLineUpDuotone,
  PiChatsCircleDuotone,
  PiGearSixDuotone,
  PiHouseLineDuotone,
  PiPackageDuotone,
  PiReceiptDuotone,
  PiStorefrontDuotone,
  PiTruckDuotone,
} from "react-icons/pi";

type MenuItem = {
  name: string;
  href?: string;
  icon?: React.ReactNode;
  dropdownItems?: Array<{ name: string; href: string }>;
  badge?: string;
};

export const menuItems: MenuItem[] = [
  { name: "Overview" },
  {
    name: "Dashboard",
    href: routes.dashboard,
    icon: <PiHouseLineDuotone />,
  },
  { name: "Commerce" },
  {
    name: "Sales",
    href: routes.sales.home,
    icon: <PiReceiptDuotone />,
    badge: "LIVE",
    dropdownItems: [
      { name: "Orders", href: routes.sales.orders },
      { name: "Invoices", href: routes.sales.invoices },
      { name: "Customers", href: routes.sales.customers },
      { name: "Refunds", href: routes.sales.refunds },
    ],
  },
  {
    name: "Catalog",
    href: routes.commerce.catalog,
    icon: <PiPackageDuotone />,
  },
  {
    name: "Partners",
    href: routes.commerce.vendors,
    icon: <PiStorefrontDuotone />,
  },
  { name: "Operations" },
  {
    name: "Deliveries",
    href: routes.operations.deliveries,
    icon: <PiTruckDuotone />,
  },
  {
    name: "Drivers",
    href: routes.operations.drivers,
    icon: <PiArrowsSplitDuotone />,
  },
  { name: "Service" },
  {
    name: "Support",
    href: routes.supportDesk.home,
    icon: <PiChatsCircleDuotone />,
    dropdownItems: [
      { name: "Inbox", href: routes.supportDesk.inbox },
      { name: "Tickets", href: routes.supportDesk.tickets },
      { name: "Escalations", href: routes.supportDesk.escalations },
    ],
  },
  {
    name: "Content",
    href: routes.content,
    icon: <PiChartLineUpDuotone />,
  },
  { name: "System" },
  {
    name: "Settings",
    href: routes.settings,
    icon: <PiGearSixDuotone />,
  },
];
