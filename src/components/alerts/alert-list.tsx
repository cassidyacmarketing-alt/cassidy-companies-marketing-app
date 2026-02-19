"use client";

import { Fragment, useState } from "react";
import type { StoredAlert, MetricKey } from "@/lib/types";
import { METRIC_LABELS } from "@/lib/metric-labels";

interface AlertListProps {
  alerts: StoredAlert[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

export default function AlertList({ alerts, total, page, onPageChange }: AlertListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const totalPages = Math.ceil(total / 20);

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-slate-700 mb-1">No alerts yet</h3>
        <p className="text-sm text-slate-400">Alerts will appear here when metrics fall outside thresholds.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Company</th>
            <th className="px-5 py-3">Violations</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <Fragment key={alert.id}>
              <tr
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
              >
                <td className="px-5 py-3.5 text-sm text-slate-600">
                  {new Date(alert.checkedAt).toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-slate-900">
                  {alert.companyName}
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {alert.violations.length} violation{alert.violations.length > 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {alert.emailSent ? (
                    <span className="text-green-600">Sent</span>
                  ) : (
                    <span className="text-slate-400">Not sent</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === alert.id ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </td>
              </tr>
              {expandedId === alert.id && (
                <tr>
                  <td colSpan={5} className="px-5 py-4 bg-slate-50">
                    <div className="grid gap-2 max-w-xl">
                      {alert.violations.map((v, i) => {
                        const meta = METRIC_LABELS[v.metric as MetricKey];
                        return (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{meta.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-red-600">{meta.format(v.actualValue)}</span>
                              <span className="text-slate-400">
                                {v.direction === "too_low"
                                  ? `min ${meta.format(v.threshold.min!)}`
                                  : `max ${meta.format(v.threshold.max!)}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-sm text-slate-500">{total} total alerts</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
