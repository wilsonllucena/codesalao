import   {  NextRequest, NextResponse } from 'next/server'
import { api } from '~/trpc/server'

export async function GET(
    req: Request,
    context: any
) {
  try {
    const { params } = context;
    const clients = await api.client.getAll();
    return NextResponse.json({ clients })
  } catch (err) {
    return NextResponse.json({ error: 'failed to fetch data' }, { status: 500 })
  }
}