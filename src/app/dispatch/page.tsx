import ModulePage from "@/components/admin/module-page";
import { dispatchModulePages } from "@/components/admin/module-configs";

export default function DispatchPage() {
  return <ModulePage {...dispatchModulePages.overview} />;
}
