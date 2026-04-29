import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function PlatformPage() {
  redirect(routes.platform.reports);
}
