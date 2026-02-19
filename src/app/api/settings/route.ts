import { NextRequest, NextResponse } from "next/server";
import * as kv from "@/lib/kv";

export async function GET() {
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ success: true, data: null });
  return NextResponse.json({
    success: true,
    data: {
      schedule: config.schedule,
      timezone: config.timezone,
      lookbackDays: config.lookbackDays,
      emailRecipients: config.emailRecipients,
    },
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ error: "No config" }, { status: 500 });

  if (body.schedule !== undefined) config.schedule = body.schedule;
  if (body.timezone !== undefined) config.timezone = body.timezone;
  if (body.lookbackDays !== undefined) config.lookbackDays = body.lookbackDays;
  if (body.emailRecipients !== undefined) config.emailRecipients = body.emailRecipients;

  await kv.setAppConfig(config);
  return NextResponse.json({
    success: true,
    data: {
      schedule: config.schedule,
      timezone: config.timezone,
      lookbackDays: config.lookbackDays,
      emailRecipients: config.emailRecipients,
    },
  });
}
