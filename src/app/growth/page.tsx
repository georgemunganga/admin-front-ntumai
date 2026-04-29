import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function GrowthPage() {
  redirect(routes.growth.promotions);
}
