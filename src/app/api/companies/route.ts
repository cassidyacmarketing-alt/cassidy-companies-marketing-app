import { NextRequest, NextResponse } from "next/server";
import * as kv from "@/lib/kv";

export async function GET() {
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ success: true, data: [] });
  return NextResponse.json({ success: true, data: config.companies });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ error: "No config" }, { status: 500 });

  config.companies.push({
    name: body.name,
    customerId: String(body.customerId).replace(/-/g, ""),
    thresholds: body.thresholds ?? undefined,
  });

  await kv.setAppConfig(config);
  return NextResponse.json({ success: true, data: config.companies });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ error: "No config" }, { status: 500 });

  const idx = config.companies.findIndex(
    (c) => c.customerId === String(body.customerId).replace(/-/g, "")
  );
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  config.companies[idx] = {
    ...config.companies[idx],
    name: body.name ?? config.companies[idx].name,
    thresholds: body.thresholds !== undefined ? body.thresholds : config.companies[idx].thresholds,
  };

  await kv.setAppConfig(config);
  return NextResponse.json({ success: true, data: config.companies });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const config = await kv.getAppConfig();
  if (!config) return NextResponse.json({ error: "No config" }, { status: 500 });

  config.companies = config.companies.filter(
    (c) => c.customerId !== String(body.customerId).replace(/-/g, "")
  );

  await kv.setAppConfig(config);
  return NextResponse.json({ success: true, data: config.companies });
}
