import ModulePage from "@/components/admin/module-page";
import { fleetModulePages } from "@/components/admin/module-configs";

export default function FleetPage() {
  return <ModulePage {...fleetModulePages.overview} />;
}
