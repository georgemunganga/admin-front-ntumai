export type MarkerTone = "tasker" | "vendor" | "alert";

export type MapEntity = {
  id: string;
  name: string;
  kind: MarkerTone;
  status: string;
  detail: string;
  lat: number;
  lng: number;
  assignmentId?: string;
  driverId?: string;
  vehicleType?: "Walking" | "Bicycle" | "Motorbike" | "Car" | "Van";
  zone: "CBD" | "Roma" | "Woodlands" | "Airport" | "Rhodes Park";
  heartbeatSec?: number;
  routePath?: Array<{ lat: number; lng: number }>;
  trackingId?: string;
  orderId?: string;
  pickup?: { lat: number; lng: number; label: string };
  dropoff?: { lat: number; lng: number; label: string };
};

export type ZoneOverlay = {
  name: MapEntity["zone"];
  center: { lat: number; lng: number };
  radius: number;
  pressure: "Healthy" | "Watch" | "Hot";
};

export const dispatchEntities: MapEntity[] = [
  {
    id: "tsk_roma_1",
    name: "Bike tasker 14",
    kind: "tasker",
    status: "Delivering",
    detail: "Heading to Kabulonga handoff",
    lat: -15.4165,
    lng: 28.3118,
    vehicleType: "Bicycle",
    zone: "Roma",
    heartbeatSec: 8,
    trackingId: "TRK-24081",
    orderId: "ORD-10091",
    pickup: { lat: -15.4143, lng: 28.3051, label: "Green Basket pickup" },
    dropoff: { lat: -15.4262, lng: 28.3278, label: "Kabulonga dropoff" },
    routePath: [
      { lat: -15.4165, lng: 28.3118 },
      { lat: -15.4214, lng: 28.3189 },
      { lat: -15.4262, lng: 28.3278 },
    ],
  },
  {
    id: "tsk_cbd_3",
    name: "Bike tasker 23",
    kind: "tasker",
    status: "Available",
    detail: "Idle near Cairo Road",
    lat: -15.4136,
    lng: 28.2823,
    vehicleType: "Bicycle",
    zone: "CBD",
    heartbeatSec: 21,
    trackingId: "TRK-24075",
    orderId: "ORD-10084",
    pickup: { lat: -15.4141, lng: 28.2794, label: "Quick pickup" },
    dropoff: { lat: -15.4098, lng: 28.2922, label: "CBD customer" },
    routePath: [
      { lat: -15.4136, lng: 28.2823 },
      { lat: -15.4123, lng: 28.2873 },
      { lat: -15.4098, lng: 28.2922 },
    ],
  },
  {
    id: "tsk_woodlands_8",
    name: "Van tasker 08",
    kind: "tasker",
    status: "Stacked order",
    detail: "2 stops active in Woodlands",
    lat: -15.445,
    lng: 28.3346,
    vehicleType: "Van",
    zone: "Woodlands",
    heartbeatSec: 34,
    trackingId: "TRK-24062",
    orderId: "ORD-10063",
    pickup: { lat: -15.4382, lng: 28.3202, label: "QuickBite pickup" },
    dropoff: { lat: -15.4325, lng: 28.3112, label: "Woodlands handoff" },
    routePath: [
      { lat: -15.445, lng: 28.3346 },
      { lat: -15.4382, lng: 28.3202 },
      { lat: -15.4325, lng: 28.3112 },
    ],
  },
  {
    id: "tsk_airport_2",
    name: "Bike tasker 05",
    kind: "tasker",
    status: "Heartbeat live",
    detail: "Holding airport queue",
    lat: -15.329,
    lng: 28.4532,
    vehicleType: "Bicycle",
    zone: "Airport",
    heartbeatSec: 5,
    trackingId: "TRK-24096",
    orderId: "ORD-10112",
    pickup: { lat: -15.3337, lng: 28.4486, label: "Airport pickup lane" },
    dropoff: { lat: -15.3491, lng: 28.4277, label: "Airport corridor handoff" },
    routePath: [
      { lat: -15.329, lng: 28.4532 },
      { lat: -15.3384, lng: 28.4419 },
      { lat: -15.3491, lng: 28.4277 },
    ],
  },
  {
    id: "ven_cbd_1",
    name: "Green Basket Market",
    kind: "vendor",
    status: "Open",
    detail: "26 catalog items live",
    lat: -15.4114,
    lng: 28.2862,
    zone: "CBD",
  },
  {
    id: "ven_woodlands_4",
    name: "QuickBite Kitchens",
    kind: "vendor",
    status: "Rush lane",
    detail: "Prep queue rising",
    lat: -15.4382,
    lng: 28.3202,
    zone: "Woodlands",
  },
  {
    id: "ven_roma_3",
    name: "CityCare Pharmacy",
    kind: "vendor",
    status: "Open",
    detail: "Pharmacy handoff ready",
    lat: -15.4016,
    lng: 28.3143,
    zone: "Roma",
  },
  {
    id: "alt_1",
    name: "Trip stalled",
    kind: "alert",
    status: "11 min no movement",
    detail: "Customer waiting near Levy Junction",
    lat: -15.4172,
    lng: 28.2889,
    zone: "CBD",
  },
  {
    id: "alt_2",
    name: "Handoff mismatch",
    kind: "alert",
    status: "Needs dispatch call",
    detail: "Tasker and customer mismatch in Rhodes Park",
    lat: -15.4271,
    lng: 28.3004,
    zone: "Rhodes Park",
  },
];

export const zoneOverlays: ZoneOverlay[] = [
  {
    name: "CBD",
    center: { lat: -15.4128, lng: 28.2854 },
    radius: 1900,
    pressure: "Hot",
  },
  {
    name: "Roma",
    center: { lat: -15.4071, lng: 28.3148 },
    radius: 1650,
    pressure: "Healthy",
  },
  {
    name: "Woodlands",
    center: { lat: -15.4405, lng: 28.3258 },
    radius: 1750,
    pressure: "Watch",
  },
  {
    name: "Airport",
    center: { lat: -15.3337, lng: 28.4486 },
    radius: 2100,
    pressure: "Watch",
  },
];

export const toneLabel: Record<MarkerTone, string> = {
  tasker: "Taskers",
  vendor: "Vendors",
  alert: "Alerts",
};
