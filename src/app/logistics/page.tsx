import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function LogisticsPage() {
  redirect(routes.logistics.shipments);
}
