import { NextRequest, NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function GET(req: NextRequest) {
  try {
    const response = await api.company.getAll();

    if (!response!.length) {
      return NextResponse.json(
        {
          company: [],
        }
      );
    }
    return NextResponse.json({ company: response[0]?.company});
  } catch (err) {
    return NextResponse.json(
      { error: "failed to fetch data" },
      { status: 500 },
    );
  }
}
