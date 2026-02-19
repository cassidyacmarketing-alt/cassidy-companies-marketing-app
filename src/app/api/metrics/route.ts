import { NextResponse } from "next/server";
import * as kv from "@/lib/kv";
import type { DashboardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const [snapshots, lastCheckAt, isChecking] = await Promise.all([
    kv.getLatestSnapshots(),
    kv.getLastCheckAt(),
    kv.getIsChecking(),
  ]);

  const data: DashboardData = { snapshots, lastCheckAt, isChecking };
  return NextResponse.json({ success: true, data });
}
