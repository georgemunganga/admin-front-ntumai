import PinningListPage from "@/components/crud/pinning-list-page";
import { crudPages } from "@/components/crud/crud-data";

export default function MarketplaceVendorsPage() {
  return <PinningListPage {...crudPages.marketplaceVendors} />;
}
