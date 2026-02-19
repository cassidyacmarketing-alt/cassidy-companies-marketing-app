import useSWR from "swr";
import type { StoredAlert } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAlerts(page: number = 0, limit: number = 20) {
  const offset = page * limit;
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: { alerts: StoredAlert[]; total: number; offset: number; limit: number };
  }>(`/api/alerts?offset=${offset}&limit=${limit}`, fetcher);

  return {
    alerts: data?.data?.alerts ?? [],
    total: data?.data?.total ?? 0,
    isLoading,
    error,
    refresh: mutate,
  };
}
