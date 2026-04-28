"use client";

export type LogisticsShipment = {
  id: string;
  trackingId: string;
  customer: string;
  customerPhone: string;
  pickup: string;
  dropoff: string;
  recipient: string;
  lane: string;
  owner: string;
  status: "live" | "stable" | "review" | "monitoring" | "queued" | "at_risk";
  updatedAt: string;
  value: string;
  tasker: string;
  notes: string;
  items: Array<{ label: string; value: string }>;
  timeline: Array<{ label: string; detail: string; time: string }>;
};

export const logisticsShipments: LogisticsShipment[] = [
  {
    id: "SHP-50012",
    trackingId: "TRK-50012-LSK",
    customer: "Chipo Mwansa",
    customerPhone: "+260 97 411 2084",
    pickup: "Roma, Lusaka",
    dropoff: "Kabulonga, Lusaka",
    recipient: "Mwila Household",
    lane: "CBD dispatch lane",
    owner: "Dispatch ops",
    status: "live",
    updatedAt: "2 min ago",
    value: "ZMW 118",
    tasker: "Moses Banda",
    notes: "Active same-day neighborhood shipment.",
    items: [
      { label: "Package type", value: "Groceries" },
      { label: "Weight", value: "6kg" },
      { label: "ETA", value: "14 min" },
    ],
    timeline: [
      { label: "Shipment created", detail: "Customer order converted to active delivery.", time: "08:12" },
      { label: "Tasker assigned", detail: "Dispatch assigned Moses Banda.", time: "08:16" },
      { label: "In transit", detail: "Shipment is currently moving to the dropoff zone.", time: "08:22" },
    ],
  },
  {
    id: "SHP-50004",
    trackingId: "TRK-50004-LSK",
    customer: "Mercy Zulu",
    customerPhone: "+260 96 771 2234",
    pickup: "Woodlands, Lusaka",
    dropoff: "Chalala, Lusaka",
    recipient: "Returns desk",
    lane: "Woodlands returns",
    owner: "Recovery ops",
    status: "review",
    updatedAt: "11 min ago",
    value: "ZMW 76",
    tasker: "Mercy Zulu",
    notes: "Return shipment waiting for resolution handling.",
    items: [
      { label: "Package type", value: "Return parcel" },
      { label: "Weight", value: "2kg" },
      { label: "ETA", value: "31 min" },
    ],
    timeline: [
      { label: "Return opened", detail: "Customer initiated a return after failed handoff.", time: "07:41" },
      { label: "Recovery lane", detail: "Shipment moved to returns workflow.", time: "07:55" },
      { label: "Review opened", detail: "Ops reviewing next action on the return.", time: "08:09" },
    ],
  },
  {
    id: "SHP-49991",
    trackingId: "TRK-49991-LSK",
    customer: "Brian Phiri",
    customerPhone: "+260 97 114 3892",
    pickup: "Airport, Lusaka",
    dropoff: "Ibex, Lusaka",
    recipient: "Airport corridor office",
    lane: "Airport corridor",
    owner: "Zone watch",
    status: "monitoring",
    updatedAt: "9 min ago",
    value: "ZMW 144",
    tasker: "Derrick Phiri",
    notes: "Shipment under watch because corridor ETA is rising.",
    items: [
      { label: "Package type", value: "Express parcel" },
      { label: "Weight", value: "4kg" },
      { label: "ETA", value: "22 min" },
    ],
    timeline: [
      { label: "Shipment created", detail: "Express parcel accepted for airport corridor.", time: "06:58" },
      { label: "Traffic watch", detail: "Route congestion pushed ETA above target.", time: "07:16" },
      { label: "Monitoring", detail: "Dispatch is watching for intervention need.", time: "07:31" },
    ],
  },
  {
    id: "SHP-49974",
    trackingId: "TRK-49974-KTW",
    customer: "Tina Mwale",
    customerPhone: "+260 95 445 2001",
    pickup: "Kitwe CBD",
    dropoff: "Parklands, Kitwe",
    recipient: "Parklands home delivery",
    lane: "Scheduled lane",
    owner: "Planning desk",
    status: "queued",
    updatedAt: "18 min ago",
    value: "ZMW 92",
    tasker: "Unassigned",
    notes: "Scheduled shipment waiting for assignment window.",
    items: [
      { label: "Package type", value: "Household bundle" },
      { label: "Weight", value: "7kg" },
      { label: "ETA", value: "Awaiting dispatch" },
    ],
    timeline: [
      { label: "Shipment created", detail: "Scheduled delivery booked for later window.", time: "07:12" },
      { label: "Queue hold", detail: "Assignment delayed until tasker window opens.", time: "07:25" },
    ],
  },
];

export function getLogisticsShipment(id: string) {
  return logisticsShipments.find((shipment) => shipment.id === id);
}
