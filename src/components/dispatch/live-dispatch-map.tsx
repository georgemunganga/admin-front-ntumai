"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Badge, Button, Select, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiArrowsOutCardinalBold,
  PiClockCounterClockwiseBold,
  PiEyeBold,
  PiFadersHorizontalBold,
  PiMapPinBold,
  PiNavigationArrowBold,
  PiPhoneCallBold,
  PiStackPlusBold,
  PiStorefrontBold,
  PiWarningCircleBold,
} from "react-icons/pi";

type MarkerTone = "tasker" | "vendor" | "alert";

type MapEntity = {
  id: string;
  name: string;
  kind: MarkerTone;
  status: string;
  detail: string;
  lat: number;
  lng: number;
  vehicleType?: "Walking" | "Bicycle" | "Motorbike" | "Car" | "Van";
  zone: "CBD" | "Roma" | "Woodlands" | "Airport" | "Rhodes Park";
};

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "AIzaSyDw59gPssVHEg1TcHoC9at1KDF98yVnQe4";

const dispatchEntities: MapEntity[] = [
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

const toneClasses: Record<MarkerTone, string> = {
  tasker: "bg-primary/10 text-primary",
  vendor: "bg-secondary/20 text-secondary-foreground",
  alert: "bg-red-50 text-red-700",
};

const toneLabel: Record<MarkerTone, string> = {
  tasker: "Taskers",
  vendor: "Vendors",
  alert: "Alerts",
};

function markerSvg(kind: MarkerTone) {
  if (kind === "tasker") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#1ABAA6" />
        <circle cx="14.5" cy="28.5" r="4.5" fill="none" stroke="#fff" stroke-width="2.4"/>
        <circle cx="29.5" cy="28.5" r="4.5" fill="none" stroke="#fff" stroke-width="2.4"/>
        <path d="M16 18h5l3 6h5l-2.4-6.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 18l-5.2 10.3M24 24l-4.8 4.5M29 18h-3.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  if (kind === "vendor") {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
        <path d="M22 50c8.7-10 14-17.2 14-25.3C36 14.4 29.7 8 22 8S8 14.4 8 24.7C8 32.8 13.3 40 22 50z" fill="#EAB308"/>
        <path d="M14 19.5h16l-1.7-5.2H15.7L14 19.5z" fill="#fff"/>
        <path d="M15.5 20.5h13v9h-13z" fill="#fff"/>
        <path d="M19 20.5v9M25 20.5v9" stroke="#EAB308" stroke-width="1.8"/>
        <rect x="20.5" y="24" width="3" height="5.5" fill="#EAB308"/>
      </svg>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
      <path d="M22 50c8.7-10 14-17.2 14-25.3C36 14.4 29.7 8 22 8S8 14.4 8 24.7C8 32.8 13.3 40 22 50z" fill="#EF4444"/>
      <circle cx="22" cy="23" r="8.5" fill="#fff"/>
      <path d="M22 18v6" stroke="#EF4444" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="22" cy="27.8" r="1.6" fill="#EF4444"/>
    </svg>
  `;
}

function markerIcon(kind: MarkerTone): google.maps.Icon {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg(kind))}`,
    scaledSize:
      kind === "tasker"
        ? new google.maps.Size(44, 44)
        : new google.maps.Size(44, 52),
    anchor:
      kind === "tasker"
        ? new google.maps.Point(22, 22)
        : new google.maps.Point(22, 50),
  };
}

export default function LiveDispatchMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const [selectedId, setSelectedId] = useState<string>(dispatchEntities[0]?.id ?? "");
  const [kindFilter, setKindFilter] = useState<"all" | MarkerTone>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");

  const filteredEntities = dispatchEntities.filter((entity) => {
    const kindMatch = kindFilter === "all" || entity.kind === kindFilter;
    const vehicleMatch =
      vehicleFilter === "all" ||
      (entity.kind === "tasker" && entity.vehicleType === vehicleFilter);
    const zoneMatch = zoneFilter === "all" || entity.zone === zoneFilter;

    return kindMatch && vehicleMatch && zoneMatch;
  });

  const selectedEntity =
    filteredEntities.find((entity) => entity.id === selectedId) ??
    filteredEntities[0] ??
    dispatchEntities[0];

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapStatus("missing-key");
      return;
    }

    let mounted = true;

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then(() => {
        if (!mounted || !mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -15.4167, lng: 28.2833 },
          zoom: 12.3,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
          ],
        });

        const infoWindow = new google.maps.InfoWindow();

        mapInstanceRef.current = map;
        infoWindowRef.current = infoWindow;

        markersRef.current = filteredEntities.map((entity) => {
          const marker = new google.maps.Marker({
            map,
            position: { lat: entity.lat, lng: entity.lng },
            title: entity.name,
            icon: markerIcon(entity.kind),
          });

          marker.addListener("click", () => {
            setSelectedId(entity.id);
            infoWindow.setContent(
              `<div style="min-width:180px;padding:6px 4px;font-family:Ubuntu, sans-serif;">
                <div style="font-weight:700;color:#111827;">${entity.name}</div>
                <div style="font-size:12px;color:#0f766e;margin-top:4px;">${entity.status}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:6px;line-height:1.5;">${entity.detail}</div>
              </div>`,
            );
            infoWindow.open({ anchor: marker, map });
          });

          return marker;
        });

        if (filteredEntities.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          filteredEntities.forEach((entity) =>
            bounds.extend({ lat: entity.lat, lng: entity.lng }),
          );
          map.fitBounds(bounds, 72);
        }

        setMapStatus("ready");
      })
      .catch(() => {
        if (mounted) setMapStatus("error");
      });

    return () => {
      mounted = false;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      infoWindowRef.current?.close();
      infoWindowRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [filteredEntities]);

  function focusEntity(entity: MapEntity) {
    if (!mapInstanceRef.current) return;

    setSelectedId(entity.id);
    mapInstanceRef.current.panTo({ lat: entity.lat, lng: entity.lng });
    mapInstanceRef.current.setZoom(entity.kind === "alert" ? 14 : 13);

    const marker = markersRef.current[dispatchEntities.findIndex((item) => item.id === entity.id)];
    if (marker && infoWindowRef.current) {
      infoWindowRef.current.setContent(
        `<div style="min-width:180px;padding:6px 4px;font-family:Ubuntu, sans-serif;">
          <div style="font-weight:700;color:#111827;">${entity.name}</div>
          <div style="font-size:12px;color:#0f766e;margin-top:4px;">${entity.status}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:6px;line-height:1.5;">${entity.detail}</div>
        </div>`,
      );
      infoWindowRef.current.open({ anchor: marker, map: mapInstanceRef.current });
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
        <div>
          <Title as="h3" className="text-base font-semibold text-gray-900">
            Live operations map
          </Title>
          <Text className="mt-1 text-sm text-gray-500">
            Taskers, marketplace locations, and live dispatch alerts.
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="flat" className="rounded-2xl bg-primary/10 px-3 py-1 text-primary">
            Lusaka live
          </Badge>
          <Button
            variant="outline"
            className="h-10 rounded-2xl px-3"
            onClick={() => focusEntity(dispatchEntities[0])}
          >
            <PiArrowClockwiseBold className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4">
        <div className="flex items-center gap-2 pe-2 text-sm font-medium text-gray-700">
          <PiFadersHorizontalBold className="h-4 w-4 text-primary" />
          Filters
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
          <Select
            placeholder="Marker type"
            options={[
              { label: "All markers", value: "all" },
              { label: "Taskers", value: "tasker" },
              { label: "Vendors", value: "vendor" },
              { label: "Alerts", value: "alert" },
            ]}
            value={kindFilter}
            onChange={(option: any) => setKindFilter(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
          <Select
            placeholder="Vehicle type"
            options={[
              { label: "All vehicles", value: "all" },
              { label: "Walking", value: "Walking" },
              { label: "Bicycle", value: "Bicycle" },
              { label: "Motorbike", value: "Motorbike" },
              { label: "Car", value: "Car" },
              { label: "Van", value: "Van" },
            ]}
            value={vehicleFilter}
            onChange={(option: any) => setVehicleFilter(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-[220px]">
          <Select
            placeholder="Zone"
            options={[
              { label: "All zones", value: "all" },
              { label: "CBD", value: "CBD" },
              { label: "Roma", value: "Roma" },
              { label: "Woodlands", value: "Woodlands" },
              { label: "Airport", value: "Airport" },
              { label: "Rhodes Park", value: "Rhodes Park" },
            ]}
            value={zoneFilter}
            onChange={(option: any) => setZoneFilter(option?.value ?? "all")}
            selectClassName="rounded-2xl"
          />
        </div>
      </div>

      <div className="relative h-[72vh] min-h-[620px] max-h-[860px] w-full bg-gray-100">
        <div ref={mapRef} className="h-full w-full" />

        <div className="pointer-events-none absolute inset-x-5 top-5 z-10 flex flex-wrap items-start justify-between gap-3">
          <div className="pointer-events-auto flex flex-wrap gap-2">
            <Badge variant="flat" className="rounded-2xl bg-white/95 px-3 py-2 text-gray-900 shadow">
              {filteredEntities.filter((entity) => entity.kind === "tasker").length} taskers
            </Badge>
            <Badge variant="flat" className="rounded-2xl bg-white/95 px-3 py-2 text-gray-900 shadow">
              {filteredEntities.filter((entity) => entity.kind === "vendor").length} vendors
            </Badge>
            <Badge variant="flat" className="rounded-2xl bg-white/95 px-3 py-2 text-gray-900 shadow">
              {filteredEntities.filter((entity) => entity.kind === "alert").length} alerts
            </Badge>
          </div>

          <div className="pointer-events-auto rounded-[22px] border border-gray-200 bg-white/96 p-3 shadow-lg backdrop-blur">
            <div className="grid gap-2 text-sm">
              <LegendRow label="Taskers" toneClass="bg-primary" />
              <LegendRow label="Vendors" toneClass="bg-secondary" />
              <LegendRow label="Alerts" toneClass="bg-red-500" />
            </div>
          </div>
        </div>

        {selectedEntity ? (
          <div className="absolute bottom-5 left-5 z-10 max-w-sm rounded-[24px] border border-gray-200 bg-white/96 p-4 shadow-xl backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Text className="font-semibold text-gray-900">{selectedEntity.name}</Text>
                <Text className="mt-1 text-sm text-gray-500">{selectedEntity.detail}</Text>
              </div>
              <Badge
                variant="flat"
                className={`rounded-2xl px-3 py-1 ${toneClasses[selectedEntity.kind]}`}
              >
                {selectedEntity.status}
              </Badge>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <PiNavigationArrowBold className="h-4 w-4 text-primary" />
                <span>
                  {selectedEntity.lat.toFixed(4)}, {selectedEntity.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedEntity.kind === "vendor" ? (
                  <PiStorefrontBold className="h-4 w-4 text-primary" />
                ) : selectedEntity.kind === "alert" ? (
                  <PiWarningCircleBold className="h-4 w-4 text-red-500" />
                ) : (
                  <PiMapPinBold className="h-4 w-4 text-primary" />
                )}
                <span>{toneLabel[selectedEntity.kind]}</span>
              </div>
              {selectedEntity.zone ? (
                <div className="flex items-center gap-2">
                  <PiClockCounterClockwiseBold className="h-4 w-4 text-primary" />
                  <span>{selectedEntity.zone}</span>
                </div>
              ) : null}
              {selectedEntity.vehicleType ? (
                <div className="flex items-center gap-2">
                  <PiArrowsOutCardinalBold className="h-4 w-4 text-primary" />
                  <span>{selectedEntity.vehicleType}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="rounded-2xl bg-primary px-3 text-white hover:bg-primary/90">
                <PiEyeBold className="me-1.5 h-4 w-4" />
                View tasker
              </Button>
              <Button size="sm" variant="outline" className="rounded-2xl px-3">
                <PiPhoneCallBold className="me-1.5 h-4 w-4" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="rounded-2xl px-3">
                <PiStackPlusBold className="me-1.5 h-4 w-4" />
                Open order
              </Button>
            </div>
          </div>
        ) : null}

        {mapStatus !== "ready" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/85 p-6">
            <div className="max-w-md rounded-[28px] border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PiMapPinBold className="h-6 w-6" />
              </div>
              <Title as="h4" className="mt-4 text-base font-semibold text-gray-900">
                {mapStatus === "missing-key" ? "Google Maps API key needed" : mapStatus === "loading" ? "Loading map" : "Map unavailable"}
              </Title>
              <Text className="mt-2 text-sm leading-6 text-gray-500">
                {mapStatus === "missing-key"
                  ? "Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to render the live dispatch map in this surface."
                  : mapStatus === "loading"
                    ? "Loading Google Maps and plotting taskers, vendors, and live alerts."
                    : "Google Maps could not load right now. Check the API key, billing, and domain configuration."}
              </Text>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LegendRow({
  label,
  toneClass,
}: {
  label: string;
  toneClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${toneClass}`} />
      <span className="text-gray-700">{label}</span>
    </div>
  );
}
