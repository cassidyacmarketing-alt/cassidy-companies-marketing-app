"use client";

import { useState, useEffect } from "react";
import type { ThresholdMap, ThresholdDef, MetricKey } from "@/lib/types";
import { METRIC_LABELS, ALL_METRICS } from "@/lib/metric-labels";

interface ThresholdEditorProps {
  thresholds: ThresholdMap;
  onRefresh: () => void;
}

export default function ThresholdEditor({ thresholds, onRefresh }: ThresholdEditorProps) {
  const [draft, setDraft] = useState<ThresholdMap>(thresholds);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(thresholds);
  }, [thresholds]);

  function updateField(key: MetricKey, field: keyof ThresholdDef, value: string) {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === "direction" ? value : value === "" ? undefined : parseFloat(value),
      },
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/thresholds", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700">Default Thresholds</h3>
          <p className="text-xs text-slate-400 mt-0.5">Apply to all companies unless overridden.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3">Metric</th>
              <th className="px-5 py-3">Direction</th>
              <th className="px-5 py-3">Min</th>
              <th className="px-5 py-3">Max</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ALL_METRICS.map((key) => {
              const td = draft[key];
              return (
                <tr key={key} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">
                    {METRIC_LABELS[key].label}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={td?.direction ?? "above"}
                      onChange={(e) => updateField(key, "direction", e.target.value)}
                      className="text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    >
                      <option value="above">Alert below min</option>
                      <option value="below">Alert above max</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      step="any"
                      value={td?.min ?? ""}
                      onChange={(e) => updateField(key, "min", e.target.value)}
                      className="w-24 text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="â"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      step="any"
                      value={td?.max ?? ""}
                      onChange={(e) => updateField(key, "max", e.target.value)}
                      className="w-24 text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="â"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
