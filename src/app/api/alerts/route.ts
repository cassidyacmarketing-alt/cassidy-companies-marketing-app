import { NextRequest, NextResponse } from "next/server";
import * as kv from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  const [alerts, total] = await Promise.all([
    kv.getAlertHistory(offset, limit),
    kv.getAlertCount(),
  ]);

  return NextResponse.json({
    success: true,
    data: { alerts, total, offset, limit },
  });
}
