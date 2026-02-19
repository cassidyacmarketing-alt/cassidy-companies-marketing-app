"use client";

import type { MetricKey, ThresholdDef } from "@/lib/types";
import { METRIC_LABELS } from "@/lib/metric-labels";

interface MetricCellProps {
  metricKey: MetricKey;
  value: number;
  threshold?: ThresholdDef;
}

function isViolation(value: number, threshold?: ThresholdDef): boolean {
  if (!threshold) return false;
  if (threshold.direction === "above" && threshold.min !== undefined) {
    return value < threshold.min;
  }
  if (threshold.direction === "below" && threshold.max !== undefined) {
    return value > threshold.max;
  }
  return false;
}

export default function MetricCell({ metricKey, value, threshold }: MetricCellProps) {
  const meta = METRIC_LABELS[metricKey];
  const bad = isViolation(value, threshold);

  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-md ${
      bad ? "bg-red-50" : "bg-green-50"
    }`}>
      <span className="text-xs text-slate-600">{meta.label}</span>
      <span className={`text-sm font-semibold ${bad ? "text-red-600" : "text-green-700"}`}>
        {meta.format(value)}
      </span>
    </div>
  );
}
