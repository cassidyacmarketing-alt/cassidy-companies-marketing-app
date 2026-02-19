"use client";

import { useMetrics } from "@/hooks/use-metrics";
import { useThresholds, useCompanies } from "@/hooks/use-settings";
import CompanyCard from "@/components/dashboard/company-card";
import CheckNowButton from "@/components/dashboard/check-now-button";

export default function DashboardPage() {
  const { dashboard, isLoading, refresh } = useMetrics();
  const { thresholds } = useThresholds();
  const { companies } = useCompanies();

  function getCompanyThresholds(companyId: string) {
    const company = companies.find((c) => c.customerId === companyId);
    return company?.thresholds;
  }

  const timeAgo = dashboard?.lastCheckAt
    ? formatTimeAgo(new Date(dashboard.lastCheckAt))
    : null;

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            {timeAgo ? `Last checked ${timeAgo}` : "No checks yet"}
            {dashboard?.isChecking && " â Checking now..."}
          </p>
        </div>
        <CheckNowButton onComplete={() => refresh()} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading metrics...
        </div>
      ) : !dashboard?.snapshots.length ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-700 mb-1">No metrics yet</h3>
          <p className="text-sm text-slate-400">Click &quot;Check Now&quot; to run your first metrics check.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboard.snapshots.map((snapshot) => (
            <CompanyCard
              key={snapshot.companyId}
              snapshot={snapshot}
              thresholds={thresholds}
              companyThresholds={getCompanyThresholds(snapshot.companyId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
