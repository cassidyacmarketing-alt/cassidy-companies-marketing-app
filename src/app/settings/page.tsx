"use client";

import { useState } from "react";
import { useCompanies, useThresholds, useSettings } from "@/hooks/use-settings";
import CompanyList from "@/components/settings/company-list";
import ThresholdEditor from "@/components/settings/threshold-editor";
import NotificationSettings from "@/components/settings/notification-settings";

const TABS = ["Companies", "Thresholds", "Notifications"] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Companies");
  const { companies, refresh: refreshCompanies } = useCompanies();
  const { thresholds, refresh: refreshThresholds } = useThresholds();
  const { settings, refresh: refreshSettings } = useSettings();

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage companies, thresholds, and notification preferences.
        </p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Companies" && (
        <CompanyList companies={companies} onRefresh={refreshCompanies} />
      )}
      {activeTab === "Thresholds" && (
        <ThresholdEditor thresholds={thresholds} onRefresh={refreshThresholds} />
      )}
      {activeTab === "Notifications" && (
        <NotificationSettings settings={settings} onRefresh={refreshSettings} />
      )}
    </div>
  );
}
