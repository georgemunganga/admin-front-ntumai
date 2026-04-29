import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function LogisticsDriversPage() {
  redirect(routes.logistics.taskers);
}
