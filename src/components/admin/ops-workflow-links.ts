import { routes } from "@/config/routes";

export const shipmentOrderHrefById: Record<string, string> = {
  "SHP-50012": routes.sales.orderDetails("ORD-90014"),
  "SHP-50004": routes.sales.orderDetails("ORD-89941"),
};

export const orderTrackingHrefBySlug: Record<string, string> = {
  "ORD-90014": routes.logistics.trackingDetails("SHP-50012"),
  "ORD-89941": routes.logistics.trackingDetails("SHP-50004"),
};

export const manualDispatchTrackingHrefByBooking: Record<string, string> = {
  "ORD-50318": routes.logistics.trackingDetails("SHP-50012"),
  "ORD-50344": routes.logistics.trackingDetails("SHP-49991"),
  "ORD-50379": routes.logistics.trackingDetails("SHP-49991"),
  "ORD-50403": routes.logistics.trackingDetails("SHP-49974"),
  "ORD-50426": routes.logistics.trackingDetails("SHP-50004"),
};

export const manualDispatchOrderHrefByBooking: Record<string, string> = {
  "ORD-50318": routes.sales.orderDetails("ORD-90014"),
  "ORD-50426": routes.sales.orderDetails("ORD-89941"),
};

export const vendorDetailHrefByName: Record<string, string> = {
  "Green Basket Market": routes.marketplace.vendorDetails("VND-2401"),
  "QuickBite Kitchens": routes.marketplace.vendorDetails("VND-2398"),
  "QuickBite Express": routes.marketplace.vendorDetails("VND-2398"),
  "CityCare Pharmacy": routes.marketplace.vendorDetails("VND-2394"),
  "HomeBox Supplies": routes.marketplace.vendorDetails("VND-2388"),
};
