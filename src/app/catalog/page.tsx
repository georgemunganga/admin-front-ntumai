import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function CatalogPage() {
  redirect(routes.marketplace.products);
}
