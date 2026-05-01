"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAdminLiveDispatch } from "@/repositories/admin/dispatch";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Badge, Button, Input, Select, Text, Title } from "rizzui";
import {
  PiArrowClockwiseBold,
  PiArrowsOutCardinalBold,
  PiBicycleBold,
  PiBusBold,
  PiCarBold,
  PiClockCounterClockwiseBold,
  PiEyeBold,
  PiFadersHorizontalBold,
  PiMagnifyingGlassBold,
  PiMapPinBold,
  PiNavigationArrowBold,
  PiPhoneCallBold,
  PiPersonSimpleWalkBold,
  PiStackPlusBold,
  PiStorefrontBold,
  PiWarningCircleBold,
} from "react-icons/pi";
import {
  dispatchEntities,
  toneLabel,
  zoneOverlays,
  type MapEntity,
  type MarkerTone,
} from "@/components/dispatch/live-map.data";

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "AIzaSyDw59gPssVHEg1TcHoC9at1KDF98yVnQe4";

const toneClasses: Record<MarkerTone, string> = {
  tasker: "bg-primary/10 text-primary",
  vendor: "bg-secondary/20 text-secondary-foreground",
  alert: "bg-red-50 text-red-700",
};

function normalizeZone(city?: string | null): MapEntity["zone"] {
  const value = city?.toLowerCase() ?? "";
  if (value.includes("roma")) return "Roma";
  if (value.includes("woodlands")) return "Woodlands";
  if (value.includes("airport")) return "Airport";
  if (value.includes("rhodes")) return "Rhodes Park";
  return "CBD";
}


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

function taskerMarkerSvg(vehicleType?: MapEntity["vehicleType"]) {
  const glyph =
    vehicleType === "Walking"
      ? "W"
      : vehicleType === "Bicycle"
        ? "B"
        : vehicleType === "Motorbike"
          ? "M"
          : vehicleType === "Car"
            ? "C"
            : "V";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="#1ABAA6" />
      <circle cx="22" cy="22" r="12" fill="rgba(255,255,255,0.18)" />
      <text x="22" y="27" text-anchor="middle" font-family="Ubuntu, sans-serif" font-size="16" font-weight="700" fill="#fff">${glyph}</text>
    </svg>
  `;
}

function markerIcon(kind: MarkerTone, vehicleType?: MapEntity["vehicleType"]): google.maps.Icon {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      kind === "tasker" ? taskerMarkerSvg(vehicleType) : markerSvg(kind),
    )}`,
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
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const routeMarkersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const [selectedId, setSelectedId] = useState<string>(dispatchEntities[0]?.id ?? "");
  const [kindFilter, setKindFilter] = useState<"all" | MarkerTone>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [liveFollow, setLiveFollow] = useState(true);
  const [mergedEntities, setMergedEntities] = useState<MapEntity[]>(dispatchEntities);

  // Live dispatch data from backend
  const { entities: liveEntities } = useAdminLiveDispatch();

  // Merge live backend taskers into the seed entities
  // Live taskers replace seed taskers by ID; vendors and alerts are preserved
  useEffect(() => {
    if (!liveEntities || liveEntities.length === 0) return;

    const nonTaskerSeeds = dispatchEntities.filter((e) => e.kind !== "tasker");
    const liveTaskerEntities: MapEntity[] = liveEntities.map((entity) => ({
      id: entity.id,
      name: entity.label,
      kind: "tasker" as const,
      lat: -15.4167 + (Math.random() - 0.5) * 0.08, // approximate until GPS is available
      lng: 28.2833 + (Math.random() - 0.5) * 0.08,
      status: entity.status,
      detail: `${entity.orderRef} · ${entity.customer} → ${entity.vendor}`,
      zone: normalizeZone(entity.city),
      orderId: entity.orderId,
    }));

    setMergedEntities([...nonTaskerSeeds, ...liveTaskerEntities]);
  }, [liveEntities]);

  const filteredEntities = useMemo(
    () =>
      mergedEntities.filter((entity) => {
        const kindMatch = kindFilter === "all" || entity.kind === kindFilter;
        const vehicleMatch =
          vehicleFilter === "all" ||
          (entity.kind === "tasker" && entity.vehicleType === vehicleFilter);
        const zoneMatch = zoneFilter === "all" || entity.zone === zoneFilter;

        return kindMatch && vehicleMatch && zoneMatch;
      }),
    [kindFilter, vehicleFilter, zoneFilter, mergedEntities],
  );

  const selectedEntity =
    filteredEntities.find((entity) => entity.id === selectedId) ??
    filteredEntities[0] ??
    dispatchEntities[0];

  useEffect(() => {
    if (!liveFollow || !selectedEntity) return;
    if (selectedEntity.kind !== "tasker") return;
    focusEntity(selectedEntity, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, liveFollow]);

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
            icon: markerIcon(entity.kind, entity.vehicleType),
          });

          marker.addListener("click", () => {
            setSelectedId(entity.id);
            focusEntity(entity);

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

        clustererRef.current = new MarkerClusterer({
          map,
          markers: markersRef.current,
        });

        circlesRef.current = zoneOverlays.map((zone) => {
          const tone =
            zone.pressure === "Hot"
              ? { fill: "#ef4444", stroke: "#ef4444" }
              : zone.pressure === "Watch"
                ? { fill: "#eab308", stroke: "#d97706" }
                : { fill: "#1ABAA6", stroke: "#0f766e" };

          return new google.maps.Circle({
            map,
            center: zone.center,
            radius: zone.radius,
            fillColor: tone.fill,
            fillOpacity: 0.12,
            strokeColor: tone.stroke,
            strokeOpacity: 0.4,
            strokeWeight: 2,
          });
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
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      polylinesRef.current.forEach((polyline) => polyline.setMap(null));
      polylinesRef.current = [];
      routeMarkersRef.current.forEach((marker) => marker.setMap(null));
      routeMarkersRef.current = [];
      circlesRef.current.forEach((circle) => circle.setMap(null));
      circlesRef.current = [];
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      infoWindowRef.current?.close();
      infoWindowRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [filteredEntities]);

  function focusEntity(entity: MapEntity, force = false) {
    if (!mapInstanceRef.current) return;

    setSelectedId(entity.id);
    if (force || mapInstanceRef.current.getZoom()! < (entity.kind === "alert" ? 14 : 13)) {
      mapInstanceRef.current.setZoom(entity.kind === "alert" ? 14 : 13);
    }
    mapInstanceRef.current.panTo({ lat: entity.lat, lng: entity.lng });

    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    polylinesRef.current = [];
    routeMarkersRef.current.forEach((marker) => marker.setMap(null));
    routeMarkersRef.current = [];

    if (entity.kind === "tasker" && entity.routePath?.length) {
      const routeLine = new google.maps.Polyline({
        map: mapInstanceRef.current,
        path: entity.routePath,
        geodesic: true,
        strokeColor: "#1ABAA6",
        strokeOpacity: 0.9,
        strokeWeight: 5,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 1,
              scale: 3,
            },
            offset: "0",
            repeat: "14px",
          },
        ],
      });

      polylinesRef.current = [routeLine];

      if (entity.pickup) {
        routeMarkersRef.current.push(
          new google.maps.Marker({
            map: mapInstanceRef.current,
            position: entity.pickup,
            title: entity.pickup.label,
            label: {
              text: "P",
              color: "#ffffff",
              fontWeight: "700",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#EAB308",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 9,
            },
          }),
        );
      }

      if (entity.dropoff) {
        routeMarkersRef.current.push(
          new google.maps.Marker({
            map: mapInstanceRef.current,
            position: entity.dropoff,
            title: entity.dropoff.label,
            label: {
              text: "D",
              color: "#ffffff",
              fontWeight: "700",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#ef4444",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 9,
            },
          }),
        );
      }
    }

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
        <div className="min-w-[220px] flex-1 sm:max-w-[280px]">
          <Input
            placeholder="Search tasker, vendor, order, tracking ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            rounded="lg"
          />
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
        <Button
          variant={liveFollow ? "solid" : "outline"}
          className={`h-10 rounded-2xl px-4 ${liveFollow ? "bg-primary text-white hover:bg-primary/90" : ""}`}
          onClick={() => setLiveFollow((value) => !value)}
        >
          Live follow {liveFollow ? "on" : "off"}
        </Button>
        <Button
          variant="outline"
          className="h-10 rounded-2xl px-4"
          onClick={() => {
            const found = dispatchEntities.find((entity) => {
              const q = query.trim().toLowerCase();
              if (!q) return false;
              return (
                entity.name.toLowerCase().includes(q) ||
                entity.orderId?.toLowerCase().includes(q) ||
                entity.trackingId?.toLowerCase().includes(q)
              );
            });
            if (found) focusEntity(found, true);
          }}
        >
          Jump
        </Button>
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
              <LegendRow label="Hot zones" toneClass="bg-red-300" />
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
                  {selectedEntity.vehicleType === "Walking" ? (
                    <PiPersonSimpleWalkBold className="h-4 w-4 text-primary" />
                  ) : selectedEntity.vehicleType === "Bicycle" ? (
                    <PiBicycleBold className="h-4 w-4 text-primary" />
                  ) : selectedEntity.vehicleType === "Motorbike" ? (
                    <PiArrowsOutCardinalBold className="h-4 w-4 text-primary" />
                  ) : selectedEntity.vehicleType === "Car" ? (
                    <PiCarBold className="h-4 w-4 text-primary" />
                  ) : (
                    <PiBusBold className="h-4 w-4 text-primary" />
                  )}
                  <span>{selectedEntity.vehicleType}</span>
                </div>
              ) : null}
              {selectedEntity.kind === "tasker" && selectedEntity.heartbeatSec != null ? (
                <div className="flex items-center gap-2">
                  <PiClockCounterClockwiseBold className="h-4 w-4 text-primary" />
                  <span>{heartbeatLabel(selectedEntity.heartbeatSec)}</span>
                </div>
              ) : null}
              {selectedEntity.orderId ? (
                <div className="flex items-center gap-2">
                  <PiStackPlusBold className="h-4 w-4 text-primary" />
                  <span>{selectedEntity.orderId}</span>
                </div>
              ) : null}
              {selectedEntity.trackingId ? (
                <div className="flex items-center gap-2">
                  <PiMapPinBold className="h-4 w-4 text-primary" />
                  <span>{selectedEntity.trackingId}</span>
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

function heartbeatLabel(seconds: number) {
  if (seconds <= 10) return `Heartbeat live ${seconds}s ago`;
  if (seconds <= 30) return `Heartbeat warm ${seconds}s ago`;
  return `Heartbeat stale ${seconds}s ago`;
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
