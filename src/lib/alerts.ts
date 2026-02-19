import * as nodemailer from "nodemailer";
import type { EnvConfig, CompanyAlert, ThresholdViolation, MetricKey } from "./types";
import { METRIC_LABELS } from "./metric-labels";

function formatViolation(v: ThresholdViolation): string {
  const meta = METRIC_LABELS[v.metric];
  const actual = meta.format(v.actualValue);
  const limit =
    v.direction === "too_low"
      ? `min ${meta.format(v.threshold.min!)}`
      : `max ${meta.format(v.threshold.max!)}`;
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #eee">${meta.label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#c0392b;font-weight:bold">${actual}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eee">${limit}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eee">${v.direction === "too_low" ? "Below minimum" : "Above maximum"}</td>
  </tr>`;
}

function buildEmailHtml(alerts: CompanyAlert[]): string {
  const sections = alerts
    .map((alert) => {
      const rows = alert.violations.map(formatViolation).join("\n");
      return `
      <h2 style="color:#2c3e50;border-bottom:2px solid #e74c3c;padding-bottom:8px;margin-top:24px">
        ${alert.company.name}
      </h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <thead>
          <tr style="background:#f8f9fa">
            <th style="padding:8px 12px;text-align:left">Metric</th>
            <th style="padding:8px 12px;text-align:left">Actual</th>
            <th style="padding:8px 12px;text-align:left">Threshold</th>
            <th style="padding:8px 12px;text-align:left">Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    })
    .join("\n<hr style='border:none;border-top:1px solid #ddd;margin:16px 0'>\n");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:20px">
      <h1 style="color:#e74c3c;margin-bottom:4px">Cassidy Companies</h1>
      <h3 style="color:#7f8c8d;margin-top:0;font-weight:normal">Google Ads Performance Alert</h3>
      <p style="color:#2c3e50">
        <strong>${alerts.length}</strong> account(s) have metrics outside acceptable thresholds.
      </p>
      <p style="color:#7f8c8d;font-size:13px">
        Checked at: ${alerts[0].checkedAt.toLocaleString()}
      </p>
      ${sections}
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
      <p style="color:#95a5a6;font-size:12px">
        Automated alert from the Cassidy Companies monitoring service.
      </p>
    </div>
  `;
}

export async function sendAlertEmail(
  env: EnvConfig,
  alerts: CompanyAlert[],
  recipients: string[]
): Promise<void> {
  if (alerts.length === 0 || recipients.length === 0) return;

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });

  const totalViolations = alerts.reduce((n, a) => n + a.violations.length, 0);

  await transporter.sendMail({
    from: env.alertFrom,
    to: recipients.join(", "),
    subject: `[Cassidy Alert] ${totalViolations} violation(s) across ${alerts.length} account(s)`,
    html: buildEmailHtml(alerts),
  });

  console.log(`Alert email sent to ${recipients.join(", ")}`);
}
