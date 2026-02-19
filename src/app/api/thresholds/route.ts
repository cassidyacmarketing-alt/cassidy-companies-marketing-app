import { NextRequest, NextResponse } from "next/server";
import * as kv from "@/lib/kv";

export async function GET() {
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ success: true, data: {} });
  return NextResponse.json({ success: true, data: config.defaultThresholds });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ error: "No config" }, { status: 500 });

  config.defaultThresholds = body;
  await kv.setAppConfig(config);
  return NextResponse.json({ success: true, data: config.defaultThresholds });
}
