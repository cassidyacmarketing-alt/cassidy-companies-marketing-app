import { nanoid } from "nanoid";
import { loadEnvConfig } from "./env";
import { createGoogleAdsClient, fetchCompanyMetrics } from "./google-ads";
import { evaluateCompany } from "./metrics";
import { sendAlertEmail } from "./alerts";
import * as kv from "./kv";
import type {
  AppConfig,
  CompanyAlert,
  MetricsSnapshot,
  StoredAlert,
} from "./types";

export async function runCheck(): Promise<{
  snapshots: MetricsSnapshot[];
  alerts: StoredAlert[];
}> {
  const env = loadEnvConfig();
  const storedConfig = await kv.getAppConfig();
  if (!storedConfig) throw new Error("No config found. Run the seed script first.");

  const appConfig: AppConfig = {
    schedule: storedConfig.schedule,
    timezone: storedConfig.timezone,
    lookbackDays: storedConfig.lookbackDays,
    defaultThresholds: storedConfig.defaultThresholds,
    companies: storedConfig.companies,
  };

  await kv.setIsChecking(true);

  const client = createGoogleAdsClient(env);
  const snapshots: MetricsSnapshot[] = [];
  const companyAlerts: CompanyAlert[] = [];
  const storedAlerts: StoredAlert[] = [];

  const results = await Promise.allSettled(
    appConfig.companies.map(async (company) => {
      const metrics = await fetchCompanyMetrics(
        client, env, company, appConfig.lookbackDays
      );
      return { company, metrics };
    })
  );

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Failed to fetch company metrics:", result.reason);
      continue;
    }

    const { company, metrics } = result.value;
    const alert = evaluateCompany(company, metrics, appConfig);
    const now = new Date().toISOString();

    const snapshot: MetricsSnapshot = {
      companyId: company.customerId,
      companyName: company.name,
      metrics,
      violations: alert?.violations ?? [],
      checkedAt: now,
    };
    snapshots.push(snapshot);

    if (alert) {
      companyAlerts.push(alert);
      storedAlerts.push({
        id: nanoid(),
        companyName: company.name,
        companyId: company.customerId,
        violations: alert.violations,
        metrics,
        checkedAt: now,
        emailSent: false,
      });
    }
  }

  await kv.setLatestSnapshots(snapshots);
  await kv.setLastCheckAt(new Date().toISOString());

  if (companyAlerts.length > 0) {
    try {
      await sendAlertEmail(env, companyAlerts, storedConfig.emailRecipients);
      storedAlerts.forEach((a) => (a.emailSent = true));
    } catch (err) {
      console.error("Failed to send alert email:", err);
    }
  }

  if (storedAlerts.length > 0) {
    await kv.addAlerts(storedAlerts);
  }

  await kv.setIsChecking(false);

  return { snapshots, alerts: storedAlerts };
}
