import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function DriversPage() {
  redirect(routes.logistics.drivers);
}
