import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function DispatchPage() {
  redirect(routes.dispatch.liveMap);
}
