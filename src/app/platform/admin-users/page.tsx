import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function PlatformAdminUsersPage() {
  redirect(routes.rolesPermissions);
}
