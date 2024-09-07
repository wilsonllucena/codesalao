import   {  NextRequest, NextResponse } from 'next/server'
import { api } from '~/trpc/server'

export async function GET(
    req: NextRequest,
    ctx: any
) { 
  try {     
    const appointments = await api.appointment.getAll();
    return NextResponse.json({ appointments })
  } catch (err) {
    return NextResponse.json({ error: 'failed to fetch data' }, { status: 500 })
  }
}