import { Redis } from "@upstash/redis";
import type { StoredAppConfig, MetricsSnapshot, StoredAlert } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KEYS = {
  appConfig: "cassidy:config",
  latestSnapshots: "cassidy:snapshots:latest",
  lastCheckAt: "cassidy:lastCheckAt",
  isChecking: "cassidy:isChecking",
  alerts: "cassidy:alerts",
};

// --- App Config ---

export async function getAppConfig(): Promise<StoredAppConfig | null> {
  return redis.get<StoredAppConfig>(KEYS.appConfig);
}

export async function setAppConfig(config: StoredAppConfig): Promise<void> {
  await redis.set(KEYS.appConfig, config);
}

// --- Metrics Snapshots ---

export async function getLatestSnapshots(): Promise<MetricsSnapshot[]> {
  const data = await redis.get<MetricsSnapshot[]>(KEYS.latestSnapshots);
  return data ?? [];
}

export async function setLatestSnapshots(snapshots: MetricsSnapshot[]): Promise<void> {
  await redis.set(KEYS.latestSnapshots, snapshots);
}

// --- Check Status ---

export async function getLastCheckAt(): Promise<string | null> {
  return redis.get<string>(KEYS.lastCheckAt);
}

export async function setLastCheckAt(iso: string): Promise<void> {
  await redis.set(KEYS.lastCheckAt, iso);
}

export async function getIsChecking(): Promise<boolean> {
  const val = await redis.get<string>(KEYS.isChecking);
  return val === "true";
}

export async function setIsChecking(v: boolean): Promise<void> {
  await redis.set(KEYS.isChecking, v ? "true" : "false");
}

// --- Alert History ---

export async function addAlerts(alerts: StoredAlert[]): Promise<void> {
  if (alerts.length === 0) return;
  for (const a of alerts) {
    await redis.zadd(KEYS.alerts, {
      score: new Date(a.checkedAt).getTime(),
      member: JSON.stringify(a),
    });
  }
}

export async function getAlertHistory(
  offset: number,
  limit: number
): Promise<StoredAlert[]> {
  const raw = await redis.zrange<string[]>(KEYS.alerts, "+inf", "-inf", {
    byScore: true,
    rev: true,
    offset,
    count: limit,
  });
  return raw.map((s) => (typeof s === "string" ? JSON.parse(s) : s) as StoredAlert);
}

export async function getAlertCount(): Promise<number> {
  return redis.zcard(KEYS.alerts);
}
