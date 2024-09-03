import { NextRequest, NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function GET(req: NextRequest) {
  try {
    const company = await api.company.getAll();
    return NextResponse.json({ company });
  } catch (err) {
    return NextResponse.json(
      { error: "failed to fetch data" },
      { status: 500 },
    );
  }
}
