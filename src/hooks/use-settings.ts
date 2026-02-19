import useSWR from "swr";
import type { CompanyConfig, ThresholdMap } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCompanies() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: CompanyConfig[];
  }>("/api/companies", fetcher);

  return {
    companies: data?.data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useThresholds() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: ThresholdMap;
  }>("/api/thresholds", fetcher);

  return {
    thresholds: data?.data ?? ({} as ThresholdMap),
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: {
      schedule: string;
      timezone: string;
      lookbackDays: number;
      emailRecipients: string[];
    } | null;
  }>("/api/settings", fetcher);

  return {
    settings: data?.data ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}
