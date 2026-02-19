import type { EnvConfig } from "./types";

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export function loadEnvConfig(): EnvConfig {
  return {
    googleAds: {
      clientId: requireEnv("GOOGLE_ADS_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_ADS_CLIENT_SECRET"),
      developerToken: requireEnv("GOOGLE_ADS_DEVELOPER_TOKEN"),
      refreshToken: requireEnv("GOOGLE_ADS_REFRESH_TOKEN"),
      loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    },
    smtp: {
      host: requireEnv("SMTP_HOST"),
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASS"),
    },
    alertFrom: requireEnv("ALERT_FROM"),
    alertTo: [],
  };
}
