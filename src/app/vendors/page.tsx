import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function VendorsPage() {
  redirect(routes.marketplace.vendors);
}
