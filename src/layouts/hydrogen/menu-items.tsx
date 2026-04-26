import { routes } from "@/config/routes";
import {
  PiChartLineUpDuotone,
  PiChatsCircleDuotone,
  PiGearSixDuotone,
  PiHouseLineDuotone,
  PiMapTrifoldDuotone,
  PiReceiptDuotone,
  PiStackDuotone,
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
    name: "Marketplace",
    href: routes.marketplace.home,
    icon: <PiStackDuotone />,
    dropdownItems: [
      { name: "Products", href: routes.marketplace.products },
      { name: "Vendors", href: routes.marketplace.vendors },
      { name: "Categories", href: routes.marketplace.categories },
    ],
  },
  { name: "Operations" },
  {
    name: "Logistics",
    href: routes.logistics.home,
    icon: <PiMapTrifoldDuotone />,
    badge: "OPS",
    dropdownItems: [
      { name: "Shipments", href: routes.logistics.shipments },
      { name: "Tracking", href: routes.logistics.tracking },
      { name: "Drivers", href: routes.logistics.drivers },
    ],
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
