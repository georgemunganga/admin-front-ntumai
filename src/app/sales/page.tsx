import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function SalesPage() {
  redirect(routes.sales.invoices);
}
