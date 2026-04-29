import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function MarketplacePage() {
  redirect(routes.marketplace.vendors);
}
