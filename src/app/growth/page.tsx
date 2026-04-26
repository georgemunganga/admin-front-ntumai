import ModulePage from "@/components/admin/module-page";
import { growthModulePages } from "@/components/admin/module-configs";

export default function GrowthPage() {
  return <ModulePage {...growthModulePages.overview} />;
}
