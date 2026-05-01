"use client";

import { useEffect, useState } from "react";
import { readStoredAdminSession } from "@/repositories/admin/admin-session";
import { refreshAdminSession } from "@/repositories/admin/admin-auth";

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
  refreshedAt: number | null;
  refresh: () => void;
};

export function getAdminApiBaseUrl() {
  return process.env.NEXT_PUBLIC_NTUMAI_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getAdminApiToken() {
  const session = readStoredAdminSession();
  return session?.accessToken?.trim() || null;
}

async function getValidAdminApiToken() {
  let session = readStoredAdminSession();
  if (!session?.accessToken) return null;

  if (session.tokenExpiresAt && session.tokenExpiresAt <= Date.now() + 30_000) {
    session = await refreshAdminSession(session);
  }

  return session?.accessToken?.trim() || null;
}

export async function fetchAdminData<T>(path: string): Promise<T | null> {
  const token = await getValidAdminApiToken();
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

export async function postAdminData<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T | null> {
  const token = await getValidAdminApiToken();
  if (!token) return null;

  const response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Admin API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AdminEnvelope<T>;
  return payload.data ?? null;
}

export async function patchAdminData<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T | null> {
  const token = await getValidAdminApiToken();
  if (!token) return null;

  const response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Admin API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AdminEnvelope<T>;
  return payload.data ?? null;
}

export async function deleteAdminData<T>(path: string): Promise<T | null> {
  const token = await getValidAdminApiToken();
  if (!token) return null;

  const response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
    method: "DELETE",
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
  refreshMs,
}: {
  path: string;
  fallback: T;
  map: (payload: unknown) => T;
  enabled?: boolean;
  refreshMs?: number;
}): AdminResourceState<T> {
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [state, setState] = useState<AdminResourceState<T>>({
    data: fallback,
    isLoading: enabled && Boolean(getAdminApiToken()),
    isLive: false,
    error: null,
    refreshedAt: null,
    refresh: () => setRefreshNonce((value) => value + 1),
  });

  useEffect(() => {
    if (!enabled || !refreshMs) return;
    const interval = window.setInterval(() => {
      setRefreshNonce((value) => value + 1);
    }, refreshMs);
    return () => window.clearInterval(interval);
  }, [enabled, refreshMs]);

  useEffect(() => {
    let active = true;

    if (!enabled) {
      setState({
        data: fallback,
        isLoading: false,
        isLive: false,
        error: null,
        refreshedAt: null,
        refresh: () => setRefreshNonce((value) => value + 1),
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
        refreshedAt: null,
        refresh: () => setRefreshNonce((value) => value + 1),
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
            refreshedAt: null,
            refresh: () => setRefreshNonce((value) => value + 1),
          });
          return;
        }

        setState({
          data: map(payload),
          isLoading: false,
          isLive: true,
          error: null,
          refreshedAt: Date.now(),
          refresh: () => setRefreshNonce((value) => value + 1),
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          data: fallback,
          isLoading: false,
          isLive: false,
          error: error instanceof Error ? error.message : "Failed to load live admin data",
          refreshedAt: null,
          refresh: () => setRefreshNonce((value) => value + 1),
        });
      });

    return () => {
      active = false;
    };
  }, [enabled, fallback, map, path, refreshNonce]);

  return state;
}
