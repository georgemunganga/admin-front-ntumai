import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function CustomersPage() {
  redirect(routes.crm.customers);
}
