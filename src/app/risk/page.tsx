import ModulePage from "@/components/admin/module-page";
import { riskModulePages } from "@/components/admin/module-configs";

export default function RiskPage() {
  return <ModulePage {...riskModulePages.overview} />;
}
