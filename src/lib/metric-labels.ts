import type { MetricKey } from "./types";

export const METRIC_LABELS: Record<
  MetricKey,
  { label: string; format: (v: number) => string }
> = {
  ctr: { label: "Click-Through Rate", format: (v) => `${(v * 100).toFixed(2)}%` },
  cpc: { label: "Cost Per Click", format: (v) => `$${v.toFixed(2)}` },
  conversionRate: { label: "Conversion Rate", format: (v) => `${(v * 100).toFixed(2)}%` },
  cpa: { label: "Cost Per Acquisition", format: (v) => `$${v.toFixed(2)}` },
  impressions: { label: "Impressions", format: (v) => v.toLocaleString() },
  clicks: { label: "Clicks", format: (v) => v.toLocaleString() },
  impressionShare: { label: "Impression Share", format: (v) => `${(v * 100).toFixed(1)}%` },
  dailySpend: { label: "Daily Spend", format: (v) => `$${v.toFixed(2)}` },
  budgetUtilization: { label: "Budget Utilization", format: (v) => `${(v * 100).toFixed(1)}%` },
  roas: { label: "ROAS", format: (v) => `${v.toFixed(2)}x` },
};

export const ALL_METRICS: MetricKey[] = [
  "ctr", "cpc", "conversionRate", "cpa", "impressions",
  "clicks", "impressionShare", "dailySpend", "budgetUtilization", "roas",
];
