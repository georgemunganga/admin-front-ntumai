import ModulePage from "@/components/admin/module-page";
import { salesExtraPages } from "@/components/admin/module-configs";

export default function SalesPaymentsPage() {
  return <ModulePage {...salesExtraPages.payments} />;
}
