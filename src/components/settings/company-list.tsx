"use client";

import { useState } from "react";
import type { CompanyConfig } from "@/lib/types";
import CompanyForm from "./company-form";

interface CompanyListProps {
  companies: CompanyConfig[];
  onRefresh: () => void;
}

export default function CompanyList({ companies, onRefresh }: CompanyListProps) {
  const [editing, setEditing] = useState<CompanyConfig | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleDelete(customerId: string) {
    if (!confirm("Remove this company?")) return;
    await fetch("/api/companies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    onRefresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">Monitored Accounts</h3>
        <button
          onClick={() => setAdding(true)}
          className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          + Add Company
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Customer ID</th>
              <th className="px-5 py-3">Thresholds</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((c) => (
              <tr key={c.customerId} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{c.name}</td>
                <td className="px-5 py-3.5 text-sm text-slate-600 font-mono">{c.customerId}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {c.thresholds && Object.keys(c.thresholds).length > 0
                    ? `${Object.keys(c.thresholds).length} override(s)`
                    : "Defaults"}
                </td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button
                    onClick={() => setEditing(c)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.customerId)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <CompanyForm
          company={editing ?? undefined}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={() => { setAdding(false); setEditing(null); onRefresh(); }}
        />
      )}
    </div>
  );
}
