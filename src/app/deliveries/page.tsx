import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function DeliveriesPage() {
  redirect(routes.logistics.shipments);
}
