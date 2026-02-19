"use client";

import type { MetricsSnapshot, ThresholdMap } from "@/lib/types";
import { ALL_METRICS } from "@/lib/metric-labels";
import MetricCell from "./metric-cell";

interface CompanyCardProps {
  snapshot: MetricsSnapshot;
  thresholds: ThresholdMap;
  companyThresholds?: Partial<ThresholdMap>;
}

export default function CompanyCard({ snapshot, thresholds, companyThresholds }: CompanyCardProps) {
  const violationCount = snapshot.violations.length;

  function getThreshold(key: keyof ThresholdMap) {
    return companyThresholds?.[key] ?? thresholds[key];
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{snapshot.companyName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Checked {new Date(snapshot.checkedAt).toLocaleString()}
          </p>
        </div>
        {violationCount > 0 ? (
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {violationCount} alert{violationCount > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            All clear
          </span>
        )}
      </div>
      <div className="p-4 grid gap-1.5">
        {ALL_METRICS.map((key) => (
          <MetricCell
            key={key}
            metricKey={key}
            value={snapshot.metrics[key]}
            threshold={getThreshold(key)}
          />
        ))}
      </div>
    </div>
  );
}
