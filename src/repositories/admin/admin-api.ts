"use client";

import { useEffect, useState } from "react";
import type { AdminSessionUser } from "@/repositories/admin/admin-session";
import { readStoredAdminSession } from "@/repositories/admin/admin-session";

const DEFAULT_API_BASE_URL = "https://api.ntumai.com";

type AdminEnvelope<T> = {
  success?: boolean;
  data?: T;
};

export type AdminResourceState<T> = {
  data: T;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
};

export function getAdminApiBaseUrl() {
  return process.env.NEXT_PUBLIC_NTUMAI_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getAdminApiToken() {
  const session = readStoredAdminSession();
  return session?.apiToken?.trim() || null;
}

export async function fetchAdminData<T>(path: string): Promise<T | null> {
  const token = getAdminApiToken();
  if (!token) return null;

  const response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Admin API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AdminEnvelope<T>;
  return payload.data ?? null;
}

export function useAdminResource<T>({
  path,
  fallback,
  map,
  enabled = true,
}: {
  path: string;
  fallback: T;
  map: (payload: unknown) => T;
  enabled?: boolean;
}): AdminResourceState<T> {
  const [state, setState] = useState<AdminResourceState<T>>({
    data: fallback,
    isLoading: enabled && Boolean(getAdminApiToken()),
    isLive: false,
    error: null,
  });

  useEffect(() => {
    let active = true;

    if (!enabled) {
      setState({
        data: fallback,
        isLoading: false,
        isLive: false,
        error: null,
      });
      return;
    }

    const token = getAdminApiToken();
    if (!token) {
      setState({
        data: fallback,
        isLoading: false,
        isLive: false,
        error: null,
      });
      return;
    }

    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    fetchAdminData(path)
      .then((payload) => {
        if (!active) return;
        if (!payload) {
          setState({
            data: fallback,
            isLoading: false,
            isLive: false,
            error: null,
          });
          return;
        }

        setState({
          data: map(payload),
          isLoading: false,
          isLive: true,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          data: fallback,
          isLoading: false,
          isLive: false,
          error: error instanceof Error ? error.message : "Failed to load live admin data",
        });
      });

    return () => {
      active = false;
    };
  }, [enabled, fallback, map, path]);

  return state;
}
