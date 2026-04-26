import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function ContentPage() {
  redirect(routes.platform.content);
}
