import { routes } from "@/config/routes";
import {
  PiArrowsSplitDuotone,
  PiChartLineUpDuotone,
  PiChatsCircleDuotone,
  PiFolderLockDuotone,
  PiGearSixDuotone,
  PiHeadsetDuotone,
  PiHouseLineDuotone,
  PiMapTrifoldDuotone,
  PiReceiptDuotone,
  PiShieldCheckeredDuotone,
  PiStackDuotone,
  PiTruckDuotone,
} from "react-icons/pi";

export type MenuItem = {
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
  { name: "Operations" },
  {
    name: "Dispatch",
    href: routes.dispatch.home,
    icon: <PiMapTrifoldDuotone />,
    badge: "LIVE",
    dropdownItems: [
      { name: "Live Map", href: routes.dispatch.liveMap },
      { name: "Bookings / Trips", href: routes.sales.bookings },
      { name: "Scheduled Rides", href: routes.dispatch.scheduledRides },
      { name: "Manual Dispatch", href: routes.dispatch.manualDispatch },
    ],
  },
  {
    name: "Logistics",
    href: routes.logistics.home,
    icon: <PiTruckDuotone />,
    badge: "OPS",
    dropdownItems: [
      { name: "Shipments", href: routes.logistics.shipments },
      { name: "Tracking", href: routes.logistics.tracking },
      { name: "Taskers", href: routes.logistics.taskers },
      { name: "Exceptions", href: routes.logistics.exceptions },
      { name: "Zones & Geofencing", href: routes.logistics.zones },
      { name: "Service Types", href: routes.logistics.serviceTypes },
      { name: "Pricing & Commission", href: routes.logistics.pricing },
    ],
  },
  {
    name: "Fleet",
    href: routes.fleet.home,
    icon: <PiArrowsSplitDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.fleet.overview },
      { name: "Tasker Applications", href: routes.fleet.driverApplications },
      { name: "Tasker Documents", href: routes.fleet.driverDocuments },
      { name: "Tasker Incentives", href: routes.fleet.driverIncentives },
      { name: "Tasker Payouts", href: routes.fleet.driverPayouts },
      { name: "Vehicles", href: routes.fleet.vehicles },
    ],
  },
  { name: "Commerce" },
  {
    name: "Sales",
    href: routes.sales.home,
    icon: <PiReceiptDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.sales.overview },
      { name: "Orders", href: routes.sales.orders },
      { name: "Bookings", href: routes.sales.bookings },
      { name: "Invoices", href: routes.sales.invoices },
      { name: "Payments", href: routes.sales.payments },
      { name: "Refunds", href: routes.sales.refunds },
      { name: "Payouts", href: routes.sales.payouts },
    ],
  },
  {
    name: "Marketplace",
    href: routes.marketplace.home,
    icon: <PiStackDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.marketplace.overview },
      { name: "Vendor Applications", href: routes.marketplace.vendorApplications },
      { name: "Products", href: routes.marketplace.products },
      { name: "Vendors", href: routes.marketplace.vendors },
      { name: "Categories", href: routes.marketplace.categories },
      { name: "Reviews", href: routes.marketplace.reviews },
    ],
  },
  {
    name: "CRM",
    href: routes.crm.home,
    icon: <PiChatsCircleDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.crm.overview },
      { name: "Customers", href: routes.crm.customers },
      { name: "Riders", href: routes.crm.riders },
      { name: "Corporate Accounts", href: routes.crm.corporateAccounts },
      { name: "Wallets", href: routes.crm.wallets },
      { name: "Ratings & Reviews", href: routes.crm.ratingsReviews },
      { name: "Blocked Users", href: routes.crm.blockedUsers },
    ],
  },
  { name: "Risk & Support" },
  {
    name: "Support",
    href: routes.supportDesk.home,
    icon: <PiHeadsetDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.supportDesk.overview },
      { name: "Inbox", href: routes.supportDesk.inbox },
      { name: "Tickets", href: routes.supportDesk.tickets },
      { name: "Escalations", href: routes.supportDesk.escalations },
      { name: "Disputes", href: routes.supportDesk.disputes },
      { name: "Templates", href: routes.supportDesk.templates },
    ],
  },
  {
    name: "Risk",
    href: routes.risk.home,
    icon: <PiShieldCheckeredDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.risk.overview },
      { name: "Fraud & Risk", href: routes.risk.fraud },
      { name: "SOS / Emergency", href: routes.risk.emergency },
      { name: "Safety & Compliance", href: routes.risk.compliance },
    ],
  },
  { name: "Growth" },
  {
    name: "Growth",
    href: routes.growth.home,
    icon: <PiChartLineUpDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.growth.overview },
      { name: "Promotions", href: routes.growth.promotions },
      { name: "Tasker Incentives", href: routes.growth.campaigns },
      { name: "Notifications", href: routes.growth.notifications },
    ],
  },
  { name: "Platform" },
  {
    name: "Platform",
    href: routes.platform.home,
    icon: <PiGearSixDuotone />,
    dropdownItems: [
      { name: "Overview", href: routes.platform.overview },
      { name: "Reports & Analytics", href: routes.platform.reports },
      { name: "Content Management", href: routes.platform.content },
      { name: "App Version Control", href: routes.platform.appControl },
      { name: "System Health", href: routes.platform.health },
      { name: "Admin Users & Roles", href: routes.rolesPermissions },
      { name: "Admin Activity Logs", href: routes.platform.activityLogs },
      { name: "Settings", href: routes.platform.settings },
    ],
  },
  {
    name: "Roles & Permissions",
    href: routes.rolesPermissions,
    icon: <PiFolderLockDuotone />,
  },
];
