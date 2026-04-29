import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function CrmPage() {
  redirect(routes.crm.customers);
}
