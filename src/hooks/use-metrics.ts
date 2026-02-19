import useSWR from "swr";
import type { DashboardData } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMetrics() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: DashboardData }>(
    "/api/metrics",
    fetcher,
    { refreshInterval: 60000 }
  );

  return {
    dashboard: data?.data ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}
