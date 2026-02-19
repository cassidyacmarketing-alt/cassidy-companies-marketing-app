import { Redis } from "@upstash/redis";
import type { StoredAppConfig } from "../src/lib/types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const defaultConfig: StoredAppConfig = {
  schedule: "0 8,12,17 * * 1-5",
  timezone: "America/Chicago",
  lookbackDays: 1,
  emailRecipients: [],
  defaultThresholds: {
    ctr: { min: 0.03, direction: "above" },
    cpc: { max: 15.0, direction: "below" },
    conversionRate: { min: 0.04, direction: "above" },
    cpa: { max: 150.0, direction: "below" },
    impressions: { min: 100, direction: "above" },
    clicks: { min: 10, direction: "above" },
    impressionShare: { min: 0.4, direction: "above" },
    dailySpend: { min: 50.0, direction: "above" },
    budgetUtilization: { min: 0.7, direction: "above" },
    roas: { min: 3.0, direction: "above" },
  },
  companies: [
    {
      name: "Cassidy Heating & Air",
      customerId: "1111111111",
      thresholds: {
        cpa: { max: 200.0, direction: "below" },
        roas: { min: 2.5, direction: "above" },
      },
    },
    { name: "Mountain View HVAC", customerId: "2222222222" },
    {
      name: "Summit Comfort Systems",
      customerId: "3333333333",
      thresholds: {
        ctr: { min: 0.025, direction: "above" },
        impressions: { min: 50, direction: "above" },
      },
    },
    { name: "Valley Air Solutions", customerId: "4444444444" },
    { name: "Peak Performance Heating", customerId: "5555555555" },
    {
      name: "Alpine Climate Control",
      customerId: "6666666666",
      thresholds: {
        dailySpend: { min: 100.0, direction: "above" },
      },
    },
    { name: "Ridgeline Mechanical", customerId: "7777777777" },
  ],
};

async function seed() {
  console.log("Seeding Cassidy Companies config to KV...");
  await redis.set("cassidy:config", defaultConfig);
  await redis.set("cassidy:isChecking", "false");
  console.log("Done! Config seeded with 7 companies and default thresholds.");
}

seed().catch(console.error);
