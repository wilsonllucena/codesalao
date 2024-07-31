import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function GET(req: Request, context: any) {
  try {
    const { params } = context;
    const services = await api.service.all({ id: params.userId });
    return NextResponse.json({ services });
  } catch (err) {
    return NextResponse.json(
      { error: "failed to fetch data" },
      { status: 500 },
    );
  }
}
