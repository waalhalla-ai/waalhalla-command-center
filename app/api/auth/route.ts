import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const expected = process.env.DASHBOARD_PASSWORD

    if (!expected) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    if (password === expected) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
