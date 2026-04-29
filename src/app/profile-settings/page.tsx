import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export default function ProfileSettingsPage() {
  redirect(routes.profileSettings.profile);
}
