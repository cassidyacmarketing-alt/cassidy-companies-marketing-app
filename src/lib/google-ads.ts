import { GoogleAdsApi } from "google-ads-api";
import type { EnvConfig, CompanyConfig, FetchedMetrics } from "./types";

export function createGoogleAdsClient(env: EnvConfig): GoogleAdsApi {
  return new GoogleAdsApi({
    client_id: env.googleAds.clientId,
    client_secret: env.googleAds.clientSecret,
    developer_token: env.googleAds.developerToken,
  });
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export async function fetchCompanyMetrics(
  client: GoogleAdsApi,
  env: EnvConfig,
  company: CompanyConfig,
  lookbackDays: number
): Promise<FetchedMetrics> {
  const customer = client.Customer({
    customer_id: company.customerId,
    refresh_token: env.googleAds.refreshToken,
    login_customer_id: env.googleAds.loginCustomerId,
  });

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (lookbackDays - 1));

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.clicks,
      metrics.impressions,
      metrics.ctr,
      metrics.average_cpc,
      metrics.conversions,
      metrics.conversions_from_interactions_rate,
      metrics.cost_per_conversion,
      metrics.conversions_value,
      metrics.search_impression_share
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND segments.date BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'
  `;

  console.log(`Querying Google Ads for ${company.name} (${company.customerId})`);
  const rows = await customer.query(query);

  let totalCostMicros = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalConversions = 0;
  let totalConversionsValue = 0;
  let totalBudgetMicros = 0;
  let impressionShareSum = 0;
  let impressionShareCount = 0;

  for (const row of rows) {
    totalCostMicros += Number(row.metrics?.cost_micros || 0);
    totalClicks += Number(row.metrics?.clicks || 0);
    totalImpressions += Number(row.metrics?.impressions || 0);
    totalConversions += Number(row.metrics?.conversions || 0);
    totalConversionsValue += Number(row.metrics?.conversions_value || 0);
    totalBudgetMicros += Number(row.campaign_budget?.amount_micros || 0);

    const impShare = row.metrics?.search_impression_share;
    if (impShare !== undefined && impShare !== null) {
      impressionShareSum += Number(impShare);
      impressionShareCount++;
    }
  }

  const totalCost = totalCostMicros / 1_000_000;
  const totalBudget = totalBudgetMicros / 1_000_000;

  return {
    ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    cpc: totalClicks > 0 ? totalCost / totalClicks : 0,
    conversionRate: totalClicks > 0 ? totalConversions / totalClicks : 0,
    cpa: totalConversions > 0 ? totalCost / totalConversions : 0,
    impressions: totalImpressions,
    clicks: totalClicks,
    impressionShare:
      impressionShareCount > 0 ? impressionShareSum / impressionShareCount : 0,
    dailySpend: totalCost / lookbackDays,
    budgetUtilization: totalBudget > 0 ? totalCost / totalBudget : 0,
    roas: totalCost > 0 ? totalConversionsValue / totalCost : 0,
  };
}
