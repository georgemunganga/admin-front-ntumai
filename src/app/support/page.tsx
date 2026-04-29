import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function SupportPage() {
  redirect(routes.supportDesk.inbox);
}
