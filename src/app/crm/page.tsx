import ModulePage from "@/components/admin/module-page";
import { crmModulePages } from "@/components/admin/module-configs";

export default function CrmPage() {
  return <ModulePage {...crmModulePages.overview} />;
}
