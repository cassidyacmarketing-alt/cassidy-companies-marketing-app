export interface ThresholdDef {
  min?: number;
  max?: number;
  direction: "above" | "below";
}

export interface ThresholdMap {
  ctr?: ThresholdDef;
  cpc?: ThresholdDef;
  conversionRate?: ThresholdDef;
  cpa?: ThresholdDef;
  impressions?: ThresholdDef;
  clicks?: ThresholdDef;
  impressionShare?: ThresholdDef;
  dailySpend?: ThresholdDef;
  budgetUtilization?: ThresholdDef;
  roas?: ThresholdDef;
}

export interface CompanyConfig {
  name: string;
  customerId: string;
  thresholds?: Partial<ThresholdMap>;
}

export interface AppConfig {
  schedule: string;
  timezone: string;
  lookbackDays: number;
  defaultThresholds: ThresholdMap;
  companies: CompanyConfig[];
}

export interface EnvConfig {
  googleAds: {
    clientId: string;
    clientSecret: string;
    developerToken: string;
    refreshToken: string;
    loginCustomerId?: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  alertFrom: string;
  alertTo: string[];
}

export type MetricKey = keyof ThresholdMap;

export interface FetchedMetrics {
  ctr: number;
  cpc: number;
  conversionRate: number;
  cpa: number;
  impressions: number;
  clicks: number;
  impressionShare: number;
  dailySpend: number;
  budgetUtilization: number;
  roas: number;
}

export interface ThresholdViolation {
  metric: MetricKey;
  actualValue: number;
  threshold: ThresholdDef;
  direction: "too_low" | "too_high";
}

export interface CompanyAlert {
  company: CompanyConfig;
  violations: ThresholdViolation[];
  metrics: FetchedMetrics;
  checkedAt: Date;
}

export interface StoredAppConfig {
  schedule: string;
  timezone: string;
  lookbackDays: number;
  defaultThresholds: ThresholdMap;
  companies: CompanyConfig[];
  emailRecipients: string[];
}

export interface MetricsSnapshot {
  companyId: string;
  companyName: string;
  metrics: FetchedMetrics;
  violations: ThresholdViolation[];
  checkedAt: string;
}

export interface StoredAlert {
  id: string;
  companyName: string;
  companyId: string;
  violations: ThresholdViolation[];
  metrics: FetchedMetrics;
  checkedAt: string;
  emailSent: boolean;
}

export interface DashboardData {
  snapshots: MetricsSnapshot[];
  lastCheckAt: string | null;
  isChecking: boolean;
}
