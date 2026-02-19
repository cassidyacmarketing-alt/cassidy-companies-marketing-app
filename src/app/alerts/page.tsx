"use client";

import { useState } from "react";
import { useAlerts } from "@/hooks/use-alerts";
import AlertList from "@/components/alerts/alert-list";

export default function AlertsPage() {
  const [page, setPage] = useState(0);
  const { alerts, total, isLoading } = useAlerts(page);

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Alert History</h1>
        <p className="text-sm text-slate-500 mt-1">
          Threshold violations detected during automated checks.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading alerts...
        </div>
      ) : (
        <AlertList
          alerts={alerts}
          total={total}
          page={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
