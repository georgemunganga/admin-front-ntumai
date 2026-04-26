import ModulePage from "@/components/admin/module-page";
import { platformModulePages } from "@/components/admin/module-configs";

export default function PlatformPage() {
  return <ModulePage {...platformModulePages.overview} />;
}
