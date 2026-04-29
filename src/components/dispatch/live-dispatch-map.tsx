"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Badge, Button, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiMapPinBold,
  PiNavigationArrowBold,
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
};

const dispatchEntities: MapEntity[] = [
  {
    id: "tsk_roma_1",
    name: "Bike tasker 14",
    kind: "tasker",
    status: "Delivering",
    detail: "Heading to Kabulonga handoff",
    lat: -15.4165,
    lng: 28.3118,
  },
  {
    id: "tsk_cbd_3",
    name: "Bike tasker 23",
    kind: "tasker",
    status: "Available",
    detail: "Idle near Cairo Road",
    lat: -15.4136,
    lng: 28.2823,
  },
  {
    id: "tsk_woodlands_8",
    name: "Van tasker 08",
    kind: "tasker",
    status: "Stacked order",
    detail: "2 stops active in Woodlands",
    lat: -15.445,
    lng: 28.3346,
  },
  {
    id: "tsk_airport_2",
    name: "Bike tasker 05",
    kind: "tasker",
    status: "Heartbeat live",
    detail: "Holding airport queue",
    lat: -15.329,
    lng: 28.4532,
  },
  {
    id: "ven_cbd_1",
    name: "Green Basket Market",
    kind: "vendor",
    status: "Open",
    detail: "26 catalog items live",
    lat: -15.4114,
    lng: 28.2862,
  },
  {
    id: "ven_woodlands_4",
    name: "QuickBite Kitchens",
    kind: "vendor",
    status: "Rush lane",
    detail: "Prep queue rising",
    lat: -15.4382,
    lng: 28.3202,
  },
  {
    id: "ven_roma_3",
    name: "CityCare Pharmacy",
    kind: "vendor",
    status: "Open",
    detail: "Pharmacy handoff ready",
    lat: -15.4016,
    lng: 28.3143,
  },
  {
    id: "alt_1",
    name: "Trip stalled",
    kind: "alert",
    status: "11 min no movement",
    detail: "Customer waiting near Levy Junction",
    lat: -15.4172,
    lng: 28.2889,
  },
  {
    id: "alt_2",
    name: "Handoff mismatch",
    kind: "alert",
    status: "Needs dispatch call",
    detail: "Tasker and customer mismatch in Rhodes Park",
    lat: -15.4271,
    lng: 28.3004,
  },
];

const toneClasses: Record<MarkerTone, string> = {
  tasker: "bg-primary/10 text-primary",
  vendor: "bg-secondary/20 text-secondary-foreground",
  alert: "bg-red-50 text-red-700",
};

const toneBorderClasses: Record<MarkerTone, string> = {
  tasker: "border-primary/30",
  vendor: "border-secondary/40",
  alert: "border-red-200",
};

const toneLabel: Record<MarkerTone, string> = {
  tasker: "Taskers",
  vendor: "Vendors",
  alert: "Alerts",
};

export default function LiveDispatchMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const [selectedId, setSelectedId] = useState<string>(dispatchEntities[0]?.id ?? "");

  const selectedEntity =
    dispatchEntities.find((entity) => entity.id === selectedId) ?? dispatchEntities[0];

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setMapStatus("missing-key");
      return;
    }

    let mounted = true;

    const loader = new Loader({
      apiKey,
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

        markersRef.current = dispatchEntities.map((entity) => {
          const marker = new google.maps.Marker({
            map,
            position: { lat: entity.lat, lng: entity.lng },
            title: entity.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor:
                entity.kind === "tasker"
                  ? "#1ABAA6"
                  : entity.kind === "vendor"
                    ? "#EAB308"
                    : "#EF4444",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
              scale: entity.kind === "alert" ? 10 : 8,
            },
            label: {
              text: entity.kind === "tasker" ? "T" : entity.kind === "vendor" ? "V" : "!",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "11px",
            },
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
  }, []);

  function focusEntity(entity: MapEntity) {
    setSelectedId(entity.id);

    if (!mapInstanceRef.current) return;

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_380px]">
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
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
              onClick={() => selectedEntity && focusEntity(selectedEntity)}
            >
              <PiArrowClockwiseBold className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative h-[620px] w-full bg-gray-100">
          <div ref={mapRef} className="h-full w-full" />

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

      <div className="space-y-6">
        <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <Title as="h3" className="text-base font-semibold text-gray-900">
            Live layers
          </Title>
          <div className="mt-4 grid gap-3">
            {(["tasker", "vendor", "alert"] as MarkerTone[]).map((tone) => (
              <div
                key={tone}
                className={`rounded-[22px] border ${toneBorderClasses[tone]} bg-gray-50/80 p-4`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="flat" className={`rounded-2xl px-3 py-1 ${toneClasses[tone]}`}>
                    {toneLabel[tone]}
                  </Badge>
                  <Text className="text-sm font-semibold text-gray-900">
                    {dispatchEntities.filter((entity) => entity.kind === tone).length}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <Title as="h3" className="text-base font-semibold text-gray-900">
            Live supervision
          </Title>
          <div className="mt-4 space-y-3">
            {dispatchEntities.map((entity) => {
              const isActive = entity.id === selectedEntity?.id;

              return (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => focusEntity(entity)}
                  className={`w-full rounded-[22px] border p-4 text-left transition ${
                    isActive
                      ? "border-primary/30 bg-primary/5"
                      : "border-gray-200 bg-gray-50/80 hover:border-primary/20 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Text className="font-semibold text-gray-900">{entity.name}</Text>
                      <Text className="mt-1 text-sm text-gray-500">{entity.detail}</Text>
                    </div>
                    <Badge variant="flat" className={`rounded-2xl px-3 py-1 ${toneClasses[entity.kind]}`}>
                      {entity.status}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <Title as="h3" className="text-base font-semibold text-gray-900">
            Selected pin
          </Title>
          {selectedEntity ? (
            <div className="mt-4 rounded-[22px] border border-gray-200 bg-gray-50/80 p-4">
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
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
