import type {
  CompanyConfig,
  FetchedMetrics,
  ThresholdMap,
  ThresholdDef,
  ThresholdViolation,
  MetricKey,
  CompanyAlert,
  AppConfig,
} from "./types";
import { ALL_METRICS } from "./metric-labels";

function mergeThresholds(
  defaults: ThresholdMap,
  overrides?: Partial<ThresholdMap>
): ThresholdMap {
  if (!overrides) return { ...defaults };
  const merged = { ...defaults };
  for (const key of ALL_METRICS) {
    if (overrides[key]) {
      merged[key] = { ...defaults[key], ...overrides[key] };
    }
  }
  return merged;
}

function checkThreshold(
  metric: MetricKey,
  value: number,
  threshold: ThresholdDef
): ThresholdViolation | null {
  if (threshold.direction === "above" && threshold.min !== undefined) {
    if (value < threshold.min) {
      return { metric, actualValue: value, threshold, direction: "too_low" };
    }
  }
  if (threshold.direction === "below" && threshold.max !== undefined) {
    if (value > threshold.max) {
      return { metric, actualValue: value, threshold, direction: "too_high" };
    }
  }
  return null;
}

export function evaluateCompany(
  company: CompanyConfig,
  metrics: FetchedMetrics,
  appConfig: AppConfig
): CompanyAlert | null {
  const thresholds = mergeThresholds(
    appConfig.defaultThresholds,
    company.thresholds
  );

  const violations: ThresholdViolation[] = [];

  for (const key of ALL_METRICS) {
    const td = thresholds[key];
    if (!td) continue;
    const violation = checkThreshold(key, metrics[key], td);
    if (violation) violations.push(violation);
  }

  if (violations.length === 0) return null;

  return {
    company,
    violations,
    metrics,
    checkedAt: new Date(),
  };
}
