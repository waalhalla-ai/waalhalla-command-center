import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dependable-abundance-production-86ba.up.railway.app'
const API_SECRET = process.env.WAALHALLA_API_SECRET || ''

export const revalidate = 0

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/status`, {
      headers: { 'x-api-secret': API_SECRET },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error', status: res.status }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', detail: String(err) }, { status: 503 })
  }
}
