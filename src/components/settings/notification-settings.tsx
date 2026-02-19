"use client";

import { useState, useEffect } from "react";

interface NotificationSettingsProps {
  settings: {
    schedule: string;
    timezone: string;
    lookbackDays: number;
    emailRecipients: string[];
  } | null;
  onRefresh: () => void;
}

export default function NotificationSettings({ settings, onRefresh }: NotificationSettingsProps) {
  const [schedule, setSchedule] = useState("");
  const [timezone, setTimezone] = useState("");
  const [lookbackDays, setLookbackDays] = useState(1);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setSchedule(settings.schedule);
      setTimezone(settings.timezone);
      setLookbackDays(settings.lookbackDays);
      setRecipients(settings.emailRecipients);
    }
  }, [settings]);

  function addRecipient() {
    const email = newEmail.trim();
    if (email && !recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setNewEmail("");
      setSaved(false);
    }
  }

  function removeRecipient(email: string) {
    setRecipients(recipients.filter((r) => r !== email));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schedule, timezone, lookbackDays, emailRecipients: recipients }),
    });
    setSaving(false);
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Notifications & Schedule</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Check Schedule (cron)</label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => { setSchedule(e.target.value); setSaved(false); }}
            className="w-full max-w-md border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="0 8,12,17 * * 1-5"
          />
          <p className="text-xs text-slate-400 mt-1">Default: 8am, noon, 5pm on weekdays</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => { setTimezone(e.target.value); setSaved(false); }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="America/Chicago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lookback Days</label>
            <input
              type="number"
              min={1}
              max={30}
              value={lookbackDays}
              onChange={(e) => { setLookbackDays(parseInt(e.target.value) || 1); setSaved(false); }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-3">Email Recipients</label>
        <div className="flex gap-2 mb-3 max-w-md">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="email@example.com"
          />
          <button
            onClick={addRecipient}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {recipients.map((email) => (
            <div key={email} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 max-w-md">
              <span className="text-sm text-slate-700">{email}</span>
              <button
                onClick={() => removeRecipient(email)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {recipients.length === 0 && (
            <p className="text-sm text-slate-400">No recipients configured. Add an email address above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
