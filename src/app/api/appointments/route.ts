import { NextRequest, NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function POST(req: NextRequest, ctx: any) {
  try {
    const { params } = ctx;
    const appointments = await api.appointment.all({ id: params.userId });
    return NextResponse.json({ appointments });
  } catch (err) {
    return NextResponse.json(
      { error: "failed to fetch data" },
      { status: 500 },
    );
  }
}
