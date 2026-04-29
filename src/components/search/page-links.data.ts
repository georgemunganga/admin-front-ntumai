import { routes } from "@/config/routes";

export const pageLinks = [
  { name: "Core" },
  { name: "Dashboard", href: routes.dashboard },
  { name: "Orders", href: routes.orders },
  { name: "Deliveries", href: routes.deliveries },
  { name: "Catalog", href: routes.catalog },
  { name: "Customers", href: routes.crm.customers },
  { name: "Taskers", href: routes.logistics.taskers },
  { name: "Partners", href: routes.vendors },
  { name: "Growth" },
  { name: "Content", href: routes.content },
  { name: "Support", href: routes.support },
  { name: "Control" },
  { name: "Settings", href: routes.settings },
];
